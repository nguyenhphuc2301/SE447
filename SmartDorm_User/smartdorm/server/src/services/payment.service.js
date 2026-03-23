import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// thanh toán đơn đặt phòng
export async function getPaymentSummary(dat_phong_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      dp.id AS dat_phong_id,
      p.id AS phong_id,
      p.so_phong,
      p.gia_tien,
      p.gioi_tinh,
      t.id AS toa_id,
      t.ten_toa,
      t.dia_chi,
      nd.id AS nguoi_dung_id,
      nd.ho_ten,
      dp.ngay_nhan_phong,
      dp.thoi_gian_cu_tru
    FROM dat_phong dp
    JOIN phong p ON p.id = dp.phong_id
    JOIN toa_nha t ON t.id = p.toa_nha_id
    JOIN nguoi_dung nd ON nd.id = dp.nguoi_dung_id
    WHERE dp.id = ?
    `,
    [dat_phong_id]
  );

  if (rows.length === 0) throw new Error("Không tìm thấy đơn đặt phòng");

  const r = rows[0];
  const deposit = Number(r.gia_tien);
  const months = Number(r.thoi_gian_cu_tru || 1);
  const subtotal = Number(r.gia_tien) * months;
  const total = subtotal + deposit;

  return {
    dat_phong_id: r.dat_phong_id,
    ky_tuc_xa: r.ten_toa,
    loai_phong: `Phòng ${r.so_phong}`,
    dia_chi: r.dia_chi,
    nguoi_dat: r.ho_ten,
    ngay_nhan_phong: r.ngay_nhan_phong,
    thoi_han_thang: months,
    gia_thang: Number(r.gia_tien),
    tien_coc: deposit,
    tong_thanh_toan: total,
  };
}

//Tạo thanh toán

export async function createPayment({ dat_phong_id, so_tien, phuong_thuc }) {
  const id = uuidv4();
  const methodForDb =
    phuong_thuc === "tien_mat" ? "tien_mat" : "chuyen_khoan"; 

  await pool.query(
    `
    INSERT INTO thanh_toan (id, dat_phong_id, so_tien, ngay_thanh_toan, phuong_thuc, trang_thai)
    VALUES (?, ?, ?, NOW(), ?, 'chua_thanh_toan')
    `,
    [id, dat_phong_id, so_tien, methodForDb]
  );

  return { id, dat_phong_id, so_tien, phuong_thuc: methodForDb, trang_thai: "chua_thanh_toan" };
}

// Xác nhận đã thanh toán 
export async function confirmPayment({ payment_id }) {
  const [rows] = await pool.query(
    `SELECT id, dat_phong_id FROM thanh_toan WHERE id = ?`,
    [payment_id]
  );
  if (rows.length === 0) throw new Error("Không tìm thấy phiếu thanh toán");

  await pool.query(
    `UPDATE thanh_toan SET trang_thai = 'da_thanh_toan' WHERE id = ?`,
    [payment_id]
  );

  return { payment_id, message: "Xác nhận thanh toán thành công" };
}
