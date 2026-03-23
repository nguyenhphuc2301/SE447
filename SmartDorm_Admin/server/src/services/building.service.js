import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Lấy danh sách tất cả tòa nhà
export async function getAllBuildings() {
  const [rows] = await pool.query(`
    SELECT 
      t.id,
      t.ten_toa,
      t.dia_chi,
      t.so_tang,
      t.mo_ta,
      t.anh_toa_nha,
      COUNT(p.id) AS total_rooms,
      SUM(CASE WHEN p.trang_thai = 'con_trong' THEN 1 ELSE 0 END) AS available
    FROM toa_nha t
    LEFT JOIN phong p ON p.toa_nha_id = t.id
    GROUP BY t.id
    ORDER BY t.ten_toa ASC
  `);
  return rows;
}

// Lấy chi tiết 1 tòa nhà
export async function getBuildingById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      t.id AS id,
      t.ten_toa,
      t.dia_chi,
      t.so_tang,
      t.mo_ta,
      t.anh_toa_nha,
      COUNT(p.id) AS total_rooms,
      SUM(CASE WHEN p.trang_thai = 'con_trong' THEN 1 ELSE 0 END) AS available
    FROM toa_nha t
    LEFT JOIN phong p ON p.toa_nha_id = t.id
    WHERE t.id = ?
    GROUP BY t.id
    `,
    [id]
  );

  const b = rows[0];
  if (!b) return null;

  b.occupied = (b.total_rooms || 0) - (b.available || 0);

  return b;
}

// Thêm mới tòa nhà
export async function createBuilding(data) {
  const id = uuidv4();
  const { ten_toa, mo_ta, dia_chi, so_tang, anh_toa_nha } = data;

  await pool.query(
    `INSERT INTO toa_nha (id, ten_toa, mo_ta, dia_chi, so_tang, anh_toa_nha)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, ten_toa, mo_ta, dia_chi, so_tang, anh_toa_nha]
  );

  return { id, ten_toa };
}

//  Cập nhật tòa nhà
export async function updateBuilding(id, data) {
  const { ten_toa, mo_ta, dia_chi, so_tang, anh_toa_nha } = data;

  await pool.query(
    `UPDATE toa_nha
     SET ten_toa=?, mo_ta=?, dia_chi=?, so_tang=?, anh_toa_nha=?
     WHERE id=?`,
    [ten_toa, mo_ta, dia_chi, so_tang, anh_toa_nha, id]
  );

  return { id, ten_toa };
}

// Xóa tòa nhà
export async function deleteBuilding(id) {
  await pool.query(`DELETE FROM toa_nha WHERE id=?`, [id]);
}

export async function getBuildingDetail(id) {
  return await getBuildingById(id);
}
