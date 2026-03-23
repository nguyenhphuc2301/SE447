import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Danh sách booking
export async function listBookings({ q, status, buildingId }) {
  let where = "WHERE 1=1";
  const params = [];

  if (q) {
    where += ` AND (ND.ho_ten LIKE ? OR ND.email LIKE ? OR P.so_phong LIKE ? OR T.ten_toa LIKE ?)`;
    const s = `%${q}%`;
    params.push(s, s, s, s);
  }
  if (status) {
    where += ` AND D.trang_thai = ?`;
    params.push(status);
  }
  if (buildingId) {
    where += ` AND T.id = ?`;
    params.push(buildingId);
  }

  const [rows] = await pool.query(
    `
    SELECT 
      D.id, D.ngay_dat, D.ngay_nhan_phong, D.thoi_gian_cu_tru, D.trang_thai,
      ND.ho_ten AS ten_sinh_vien, ND.email AS email_sinh_vien,
      P.so_phong, T.ten_toa,
      DATE_ADD(D.ngay_nhan_phong, INTERVAL D.thoi_gian_cu_tru DAY) AS ngay_tra_phong
    FROM dat_phong D
    JOIN nguoi_dung ND ON ND.id = D.nguoi_dung_id
    JOIN phong P ON P.id = D.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    ${where}
    ORDER BY D.ngay_dat DESC
    `,
    params
  );
  return rows;
}

// Xem chi tiết
export async function getBookingById(id) {
  const [rows] = await pool.query(
    `
    SELECT D.*, ND.ho_ten, ND.email, P.so_phong, T.ten_toa,
    DATE_ADD(D.ngay_nhan_phong, INTERVAL D.thoi_gian_cu_tru DAY) AS ngay_tra_phong
    FROM dat_phong D
    JOIN nguoi_dung ND ON ND.id = D.nguoi_dung_id
    JOIN phong P ON P.id = D.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE D.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}

// Tạo booking mới
export async function createBooking(payload) {
  const id = uuidv4();
  await pool.query(
    `
    INSERT INTO dat_phong
      (id, nguoi_dung_id, phong_id, ngay_dat, ngay_nhan_phong, thoi_gian_cu_tru, trang_thai)
    VALUES (?, ?, ?, CURDATE(), ?, ?, ?)
    `,
    [
      id,
      payload.nguoi_dung_id,
      payload.phong_id,
      payload.ngay_nhan_phong,
      payload.thoi_gian_cu_tru ?? 0,
      payload.trang_thai || "cho_duyet",
    ]
  );
  return { id };
}

//Cập nhật booking
export async function updateBooking(id, payload) {
  await pool.query(
    `
    UPDATE .dat_phong
    SET nguoi_dung_id=?, phong_id=?, ngay_nhan_phong=?, thoi_gian_cu_tru=?, trang_thai=?
    WHERE id = ?
    `,
    [
      payload.nguoi_dung_id,
      payload.phong_id,
      payload.ngay_nhan_phong,
      payload.thoi_gian_cu_tru ?? 0,
      payload.trang_thai || "cho_duyet",
      id,
    ]
  );
  return { id };
}

// hủy booking
export async function cancelBooking(id) {
  await pool.query(`UPDATE dat_phong SET trang_thai = 'da_huy' WHERE id = ?`, [
    id,
  ]);
  return { id, status: "da_huy" };
}

// Lấy danh sách toà nhà để lọc
export async function listBuildingsForFilter() {
  const [rows] = await pool.query(
    `SELECT id, ten_toa FROM toa_nha ORDER BY ten_toa`
  );
  return rows;
}
