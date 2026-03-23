import { randomUUID } from "crypto";
import pool from "../config/db.js";

export async function getPayments() {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id,
      t.dat_phong_id,
      t.so_tien,
      t.ngay_thanh_toan,
      t.phuong_thuc,
      t.trang_thai,
      nd.ho_ten AS ten_sinh_vien,
      nd.email,
      p.so_phong,
      tn.ten_toa AS ten_toa
    FROM thanh_toan t
    JOIN dat_phong dp ON t.dat_phong_id = dp.id
    JOIN nguoi_dung nd ON dp.nguoi_dung_id = nd.id
    JOIN phong p ON dp.phong_id = p.id
    JOIN toa_nha tn ON p.toa_nha_id = tn.id
    ORDER BY t.ngay_thanh_toan DESC
    `
  );
  return rows;
}

export async function getPaymentById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id,
      t.dat_phong_id,
      t.so_tien,
      t.ngay_thanh_toan,
      t.phuong_thuc,
      t.trang_thai,
      nd.ho_ten AS ten_sinh_vien,
      nd.email,
      p.so_phong,
      tn.ten_toa AS ten_toa
    FROM thanh_toan t
    JOIN dat_phong dp ON t.dat_phong_id = dp.id
    JOIN nguoi_dung nd ON dp.nguoi_dung_id = nd.id
    JOIN phong p ON dp.phong_id = p.id
    JOIN toa_nha tn ON p.toa_nha_id = tn.id
    WHERE t.id = ?
    `,
    [id]
  );

  return rows[0] || null;
}

export async function createPayment(data) {
  const {
    dat_phong_id,
    so_tien,
    ngay_thanh_toan,
    phuong_thuc,
    trang_thai,
  } = data;

  const id = randomUUID();

  await pool.query(
    `
    INSERT INTO thanh_toan (
      id,
      dat_phong_id,
      so_tien,
      ngay_thanh_toan,
      phuong_thuc,
      trang_thai
    ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      dat_phong_id,
      so_tien,
      ngay_thanh_toan || new Date(),
      phuong_thuc,
      trang_thai,
    ]
  );

  return getPaymentById(id);
}

export async function updatePayment(id, data) {
  const {
    dat_phong_id,
    so_tien,
    ngay_thanh_toan,
    phuong_thuc,
    trang_thai,
  } = data;

  await pool.query(
    `
    UPDATE thanh_toan
    SET
      dat_phong_id = ?,
      so_tien = ?,
      ngay_thanh_toan = ?,
      phuong_thuc = ?,
      trang_thai = ?
    WHERE id = ?
    `,
    [
      dat_phong_id,
      so_tien,
      ngay_thanh_toan || new Date(),
      phuong_thuc,
      trang_thai,
      id,
    ]
  );

  return getPaymentById(id);
}

export async function deletePayment(id) {
  const [result] = await pool.query(
    "DELETE FROM thanh_toan WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}
