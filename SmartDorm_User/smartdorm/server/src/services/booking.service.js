import pool from "../config/db.js";
import dayjs from "dayjs";
import crypto from "crypto";

function calcTotal({ giaThang, months }) {
  const deposit = Number(giaThang);
  const roomFee = Number(giaThang) * Number(months);
  return { deposit, total: deposit + roomFee };
}


export async function ensureUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id FROM nguoi_dung WHERE email = ? LIMIT 1",
    [email]
  );
  if (rows.length) return rows[0].id;

  const err = new Error("Email chưa tồn tại trong hệ thống. Vui lòng nhập lại.");
  err.status = 400;
  throw err;
}

export async function createBooking(payload, authUser) {
  const {
    ho_ten,
    email,
    so_dien_thoai,
    truong_dai_hoc_id,
    phong_id,
    ngay_nhan_phong,
    thoi_gian_cu_tru,
  } = payload;

  const userIdFromToken = authUser?.id || authUser?.userId;
  if (!userIdFromToken) {
    const err = new Error("Token không hợp lệ (thiếu id user).");
    err.status = 401;
    throw err;
  }

  if (!email || !ho_ten || !phong_id || !ngay_nhan_phong || !thoi_gian_cu_tru) {
    const err = new Error("Thiếu dữ liệu bắt buộc.");
    err.status = 400;
    throw err;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [uRows] = await conn.query(
      "SELECT id, email FROM nguoi_dung WHERE id = ? LIMIT 1",
      [userIdFromToken]
    );
    if (!uRows.length) {
      const err = new Error("Người dùng không tồn tại.");
      err.status = 401;
      throw err;
    }

    const tokenEmail = (uRows[0].email || "").trim().toLowerCase();
    const formEmail = (email || "").trim().toLowerCase();


    if (tokenEmail !== formEmail) {
      const err = new Error("Email đặt phòng phải trùng với email đang đăng nhập.");
      err.status = 400;
      throw err;
    }


    const [existBookings] = await conn.query(
      `
      SELECT id
      FROM dat_phong
      WHERE nguoi_dung_id = ?
        AND trang_thai IN ('cho_duyet','da_duyet')
      LIMIT 1
      `,
      [userIdFromToken]
    );

    if (existBookings.length) {
      const err = new Error("Bạn đã có một đơn đang hoạt động. Không thể đặt thêm phòng.");
      err.status = 409;
      throw err;
    }


    const [rooms] = await conn.query(
      `
      SELECT id, gia_tien, suc_chua, so_nguoi_dang_o, trang_thai
      FROM phong
      WHERE id = ?
      FOR UPDATE
      `,
      [phong_id]
    );

    if (!rooms.length) {
      const err = new Error("Phòng không tồn tại.");
      err.status = 404;
      throw err;
    }

    const room = rooms[0];


    if (room.trang_thai !== "con_trong") {
      const err = new Error("Phòng không còn trống hoặc không thể đặt.");
      err.status = 409;
      throw err;
    }


    if (Number(room.so_nguoi_dang_o) >= Number(room.suc_chua)) {
      const err = new Error("Phòng đã đủ sức chứa.");
      err.status = 409;
      throw err;
    }

    const months = Number(thoi_gian_cu_tru);
    const { deposit, total } = calcTotal({ giaThang: room.gia_tien, months });

    const dat_phong_id = crypto.randomUUID();


    await conn.query(
      `
      INSERT INTO dat_phong
        (id, nguoi_dung_id, phong_id, ngay_dat, trang_thai, ngay_nhan_phong, thoi_gian_cu_tru)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        dat_phong_id,
        userIdFromToken,
        phong_id,
        dayjs().format("YYYY-MM-DD"),
        "cho_duyet",
        ngay_nhan_phong,
        months,
      ]
    );


    const newCount = Number(room.so_nguoi_dang_o) + 1;
    const isFull = newCount >= Number(room.suc_chua);

    await conn.query(
      `
      UPDATE phong
      SET so_nguoi_dang_o = ?,
          trang_thai = ?
      WHERE id = ?
      `,
      [newCount, isFull ? "da_dat" : "con_trong", phong_id]
    );

    
    const thanh_toan_id = crypto.randomUUID();
    await conn.query(
      `
      INSERT INTO thanh_toan
        (id, dat_phong_id, so_tien, ngay_thanh_toan, phuong_thuc, trang_thai)
      VALUES (?, ?, ?, NULL, ?, 'chua_thanh_toan')
      `,
      [thanh_toan_id, dat_phong_id, deposit, "chuyen_khoan"]
    );

    await conn.commit();

    return {
      dat_phong_id,
      thanh_toan_id,
      prices: {
        gia_thang: Number(room.gia_tien),
        months,
        deposit,
        total,
      },
    };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// Đánh dấu đã thanh toán cọc
export async function markDepositPaid(dat_phong_id) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT id FROM thanh_toan WHERE dat_phong_id = ? LIMIT 1 FOR UPDATE",
      [dat_phong_id]
    );
    if (!rows.length) {
      const err = new Error("Không tìm thấy giao dịch cọc.");
      err.status = 404;
      throw err;
    }

    await conn.query(
      `
      UPDATE thanh_toan
      SET trang_thai = 'da_thanh_toan', ngay_thanh_toan = NOW()
      WHERE id = ?
      `,
      [rows[0].id]
    );

    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// Payment
export async function getBookingSummary(dat_phong_id) {
  const [rows] = await pool.query(
    `SELECT
        DP.id,
        DP.ngay_nhan_phong,
        DP.thoi_gian_cu_tru,
        DP.trang_thai AS trang_thai_dat_phong,
        P.id AS phong_id,
        P.gia_tien,
        P.so_phong,
        T.ten_toa,
        T.dia_chi,
        TT.trang_thai AS trang_thai_thanh_toan
     FROM dat_phong DP
     JOIN phong   P  ON P.id = DP.phong_id
     JOIN toa_nha T  ON T.id = P.toa_nha_id
     LEFT JOIN thanh_toan TT ON TT.dat_phong_id = DP.id
     WHERE DP.id = ?
     LIMIT 1`,
    [dat_phong_id]
  );
  if (!rows.length) {
    const err = new Error("Không tìm thấy đơn đặt phòng.");
    err.status = 404;
    throw err;
  }
  return rows[0];
}

// biên lai
export async function getBookingReceipt(dat_phong_id) {
  const [rows] = await pool.query(
    `
    SELECT
      DP.id,
      DP.ngay_nhan_phong,
      DP.thoi_gian_cu_tru,
      DP.trang_thai AS trang_thai_dat_phong,

      ND.ho_ten        AS nguoi_dat,
      ND.email         AS email,
      ND.so_dien_thoai AS so_dien_thoai,

      TDH.ten_truong   AS truong_dai_hoc,

      P.id             AS phong_id,
      P.so_phong,
      P.suc_chua       AS so_nguoi,
      P.gia_tien,

      T.ten_toa,
      T.dia_chi,

      TT.so_tien,
      TT.phuong_thuc,
      TT.trang_thai,
      TT.ngay_thanh_toan

    FROM dat_phong DP
    JOIN nguoi_dung ND  ON ND.id  = DP.nguoi_dung_id
    JOIN phong P        ON P.id   = DP.phong_id
    JOIN toa_nha T      ON T.id   = P.toa_nha_id
    LEFT JOIN thanh_toan TT ON TT.dat_phong_id = DP.id
    LEFT JOIN truong_dai_hoc TDH ON TDH.id = ND.truong_dai_hoc_id
    WHERE DP.id = ?
    LIMIT 1
    `,
    [dat_phong_id]
  );

  if (!rows.length) throw new Error("Không tìm thấy đơn đặt phòng.");

  const r = rows[0];
  const ref = "REF" + r.id.replace(/-/g, "").slice(-6).toUpperCase();

  return {
    ...r,
    ref,
    ngay_nhan_phong: r.ngay_nhan_phong
      ? dayjs(r.ngay_nhan_phong).format("YYYY-MM-DD")
      : null,
    ngay_thanh_toan: r.ngay_thanh_toan
      ? dayjs(r.ngay_thanh_toan).toISOString()
      : null,
  };
}

export async function getMyBookings(userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 
        dp.id,
        dp.ngay_dat,
        dp.ngay_nhan_phong,
        dp.thoi_gian_cu_tru,
        dp.trang_thai,
        p.id AS phong_id,
        p.so_phong,
        p.tang,
        p.suc_chua,
        p.gia_tien,
        tn.ten_toa,
        tn.dia_chi
      FROM dat_phong dp
      JOIN phong p ON p.id = dp.phong_id
      JOIN toa_nha tn ON tn.id = p.toa_nha_id
      WHERE dp.nguoi_dung_id = ?
      ORDER BY dp.ngay_dat DESC
      `,
      [userId]
    );
    return rows;
  } finally {
    conn.release();
  }
}
