import pool from "../config/db.js";

function validateOccupancy(suc_chua, so_nguoi_dang_o) {
  const capacity = Number(suc_chua ?? 0);
  const occupied = Number(so_nguoi_dang_o ?? 0);

  if (occupied > capacity) {
    const err = new Error(
      "Số người đang ở phải nhỏ hơn hoặc bằng sức chứa của phòng."
    );
    err.status = 400; 
    throw err;
  }
}

// lọc
function buildFilter({ search, status, gender, building }) {
  let where = " WHERE 1=1 ";
  const params = [];

  if (search) {
    where += ` AND (p.so_phong LIKE ? OR t.ten_toa LIKE ?) `;
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status && status !== "all") {
    where += ` AND p.trang_thai = ? `;
    params.push(status);
  }
  if (gender && gender !== "all") {
    where += ` AND p.gioi_tinh = ? `;
    params.push(gender);
  }
  if (building && building !== "all") {
    where += ` AND t.id = ? `;
    params.push(building);
  }
  return { where, params };
}

// list
export async function getAllRooms(filters = {}) {
  const { where, params } = buildFilter(filters);

  const sql = `
    SELECT 
      p.id,
      p.toa_nha_id,
      p.so_phong     AS room_number,
      p.tang         AS floor,
      p.suc_chua     AS capacity,
      p.so_nguoi_dang_o,
      p.gioi_tinh    AS gender,
      p.gia_tien     AS price,
      p.trang_thai   AS status,
      t.ten_toa      AS building_name
    FROM phong p
    JOIN toa_nha t ON t.id = p.toa_nha_id
    ${where}
    ORDER BY t.ten_toa ASC, p.tang ASC, CAST(p.so_phong AS UNSIGNED) ASC, p.so_phong ASC
  `;
  const [rows] = await pool.query(sql, params);
  return rows;
}

// lọc phòng
export async function getRoomById(id) {
  const [[row]] = await pool.query(
    `
    SELECT 
      p.*,
      t.ten_toa AS building_name
    FROM phong p
    JOIN toa_nha t ON t.id = p.toa_nha_id
    WHERE p.id = ?
  `,
    [id]
  );
  return row ?? null;
}

// CREATE
export async function createRoom(data) {
  const {
    toa_nha_id,
    so_phong,
    tang,
    suc_chua,
    so_nguoi_dang_o = 0,
    gioi_tinh,
    gia_tien,
    trang_thai,
  } = data;

  // kiểm tra số người đang ở
  validateOccupancy(suc_chua, so_nguoi_dang_o);

  const [result] = await pool.query(
    `
    INSERT INTO phong 
      (id, toa_nha_id, so_phong, tang, suc_chua, so_nguoi_dang_o, gioi_tinh, gia_tien, trang_thai)
    VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      toa_nha_id,
      so_phong,
      Number(tang),
      Number(suc_chua),
      Number(so_nguoi_dang_o),
      gioi_tinh,
      Number(gia_tien),
      trang_thai,
    ]
  );

  const [[created]] = await pool.query(`SELECT * FROM phong WHERE id = ?`, [
    result.insertId ?? null,
  ]);

  if (!created) {
    const [[row]] = await pool.query(
      `SELECT * FROM phong WHERE toa_nha_id=? AND so_phong=? AND tang=? ORDER BY created_at DESC`,
      [toa_nha_id, so_phong, Number(tang)]
    );
    return row;
  }
  return created;
}

// UPDATE
export async function updateRoom(id, data) {
  const {
    toa_nha_id,
    so_phong,
    tang,
    suc_chua,
    so_nguoi_dang_o,
    gioi_tinh,
    gia_tien,
    trang_thai,
  } = data;

  // kiểm tra số người đang ở
  validateOccupancy(suc_chua, so_nguoi_dang_o);

  await pool.query(
    `
    UPDATE phong
       SET toa_nha_id = ?,
           so_phong = ?,
           tang = ?,
           suc_chua = ?,
           so_nguoi_dang_o = ?,
           gioi_tinh = ?,
           gia_tien = ?,
           trang_thai = ?
     WHERE id = ?
  `,
    [
      toa_nha_id,
      so_phong,
      Number(tang),
      Number(suc_chua),
      Number(so_nguoi_dang_o ?? 0),
      gioi_tinh,
      Number(gia_tien),
      trang_thai,
      id,
    ]
  );

  return getRoomById(id);
}

// DELETE
export async function deleteRoom(id) {
  await pool.query(`DELETE FROM phong WHERE id = ?`, [id]);
  return { id };
}
