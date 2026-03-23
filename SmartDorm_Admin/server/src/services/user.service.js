import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
//lọc
function buildWhere({ q, roleId, universityId }) {
  const where = ["1=1"];
  const params = [];
  if (q) {
    where.push("(ND.ho_ten LIKE ? OR ND.email LIKE ? OR ND.so_dien_thoai LIKE ?)");
    const s = `%${q}%`;
    params.push(s, s, s);
  }
  if (roleId) {
    where.push("ND.vai_tro_id = ?");
    params.push(roleId);
  }
  if (universityId) {
    where.push("ND.truong_dai_hoc_id = ?");
    params.push(universityId);
  }
  return { where: where.join(" AND "), params };
}
//list
export async function listUsers({ q, roleId, universityId, page = 1, limit = 10 }) {
  const off = (Number(page) - 1) * Number(limit);
  const { where, params } = buildWhere({ q, roleId, universityId });

  const [rows] = await pool.query(
    `
    SELECT 
      ND.id, ND.ho_ten, ND.email, ND.so_dien_thoai, ND.gioi_tinh,
      VT.ten_vai_tro,
      TDH.ten_truong, TDH.dia_chi
    FROM nguoi_dung ND
    LEFT JOIN vai_tro VT ON VT.id = ND.vai_tro_id
    LEFT JOIN truong_dai_hoc TDH ON TDH.id = ND.truong_dai_hoc_id
    WHERE ${where}
    ORDER BY ND.ho_ten ASC
    LIMIT ? OFFSET ?
    `,
    [...params, Number(limit), off]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM nguoi_dung ND WHERE ${where}`,
    params
  );

  return {
    items: rows,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.max(1, Math.ceil(total / Number(limit))),
  };
}
//chi tiết
export async function getUserById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      ND.*, VT.ten_vai_tro, TDH.ten_truong, TDH.dia_chi
    FROM nguoi_dung ND
    LEFT JOIN vai_tro VT ON VT.id = ND.vai_tro_id
    LEFT JOIN truong_dai_hoc TDH ON TDH.id = ND.truong_dai_hoc_id
    WHERE ND.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}
//thêm 
export async function createUser(payload) {
  const id = uuidv4();
  await pool.query(
    `
    INSERT INTO nguoi_dung
    (id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id, gioi_tinh, can_cuoc, truong_dai_hoc_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      payload.ho_ten,
      payload.email,
      payload.mat_khau || "",
      payload.so_dien_thoai || "",
      payload.vai_tro_id || null,
      payload.gioi_tinh || "khac",
      payload.can_cuoc || "",
      payload.truong_dai_hoc_id || null,
    ]
  );
  return { id };
}
//sửa
export async function updateUser(id, payload) {
  await pool.query(
    `
    UPDATE nguoi_dung
    SET ho_ten=?, email=?, so_dien_thoai=?, vai_tro_id=?, gioi_tinh=?, can_cuoc=?, truong_dai_hoc_id=?
    WHERE id=?
    `,
    [
      payload.ho_ten,
      payload.email,
      payload.so_dien_thoai || "",
      payload.vai_tro_id || null,
      payload.gioi_tinh || "khac",
      payload.can_cuoc || "",
      payload.truong_dai_hoc_id || null,
      id,
    ]
  );
  return { id };
}
//xóa
export async function deleteUser(id) {
  await pool.query("DELETE FROM nguoi_dung WHERE id=?", [id]);
  return { id };
}
//lọc
export async function listRoles() {
  const [rows] = await pool.query(`SELECT id, ten_vai_tro FROM vai_tro ORDER BY ten_vai_tro`);
  return rows;
}
export async function listUniversities() {
  const [rows] = await pool.query(`SELECT id, ten_truong FROM truong_dai_hoc ORDER BY ten_truong`);
  return rows;
}
