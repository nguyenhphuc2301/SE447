import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

function buildWhere({ q, rating, buildingId, order = "newest" }) {
  const where = ["1=1"];
  const params = [];

  if (q) {
    where.push(
      "(DG.noi_dung LIKE ? OR ND.ho_ten LIKE ? OR P.so_phong LIKE ? OR T.ten_toa LIKE ?)"
    );
    const s = `%${q}%`;
    params.push(s, s, s, s);
  }
  if (rating) {
    where.push("DG.so_sao = ?");
    params.push(Number(rating));
  }
  if (buildingId) {
    where.push("T.id = ?");
    params.push(buildingId);
  }

  const orderBy =
    order === "oldest"
      ? "DG.ngay_danh_gia ASC"
      : order === "highest"
      ? "DG.so_sao DESC, DG.ngay_danh_gia DESC"
      : order === "lowest"
      ? "DG.so_sao ASC, DG.ngay_danh_gia DESC"
      : "DG.ngay_danh_gia DESC";

  return { where: where.join(" AND "), params, orderBy };
}
//list
export async function listReviews(filters = {}) {
  const { where, params, orderBy } = buildWhere(filters);

  const [rows] = await pool.query(
    `
    SELECT
      DG.id, DG.noi_dung, DG.so_sao, DG.phan_hoi, DG.ngay_danh_gia, DG.trang_thai,
      ND.id AS nguoi_id, ND.ho_ten, ND.email,
      P.id AS phong_id, P.so_phong,
      T.id AS toa_id, T.ten_toa
    FROM danh_gia DG
    JOIN nguoi_dung ND ON ND.id = DG.nguoi_dung_id
    JOIN phong P ON P.id = DG.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE ${where}
    ORDER BY ${orderBy}
    `,
    params
  );
  return rows;
}
//tìm theo đánh giá
export async function getReviewStats(filters = {}) {
  const { where, params } = buildWhere(filters);

  const [[sumCount]] = await pool.query(
    `
    SELECT AVG(DG.so_sao) AS avg_star, COUNT(*) AS total
    FROM danh_gia DG
    JOIN phong P ON P.id = DG.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    JOIN nguoi_dung ND ON ND.id = DG.nguoi_dung_id
    WHERE ${where}
    `,
    params
  );

  const dist = {};
  for (let s = 1; s <= 5; s++) dist[s] = 0;

  const [rows] = await pool.query(
    `
    SELECT DG.so_sao AS star, COUNT(*) AS cnt
    FROM danh_gia DG
    JOIN phong P ON P.id = DG.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    JOIN nguoi_dung ND ON ND.id = DG.nguoi_dung_id
    WHERE ${where}
    GROUP BY DG.so_sao
    `,
    params
  );
  rows.forEach((r) => {
    if (r.star >= 1 && r.star <= 5) dist[r.star] = r.cnt;
  });

  return {
    average: Number(sumCount.avg_star || 0).toFixed(1),
    total: sumCount.total || 0,
    distribution: dist,
  };
}
//tìm review
export async function getReviewById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      DG.*, ND.ho_ten, ND.email, P.so_phong, T.ten_toa
    FROM danh_gia DG
    JOIN nguoi_dung ND ON ND.id = DG.nguoi_dung_id
    JOIN phong P ON P.id = DG.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE DG.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}
//tạo
export async function createReview(payload) {
  const id = uuidv4();
  await pool.query(
    `
    INSERT INTO danh_gia
      (id, nguoi_dung_id, phong_id, noi_dung, so_sao, phan_hoi, ngay_danh_gia, trang_thai)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
    [
      id,
      payload.nguoi_dung_id,
      payload.phong_id,
      payload.noi_dung || "",
      Number(payload.so_sao) || 5,
      payload.phan_hoi || null,
      payload.trang_thai || "da_duyet",
    ]
  );
  return { id };
}
//sửa
export async function updateReview(id, payload) {
  await pool.query(
    `
    UPDATE danh_gia
    SET noi_dung=?, so_sao=?, phan_hoi=?, trang_thai=?, phong_id=?, nguoi_dung_id=?
    WHERE id=?
    `,
    [
      payload.noi_dung || "",
      Number(payload.so_sao) || 5,
      payload.phan_hoi || null,
      payload.trang_thai || "da_duyet",
      payload.phong_id,
      payload.nguoi_dung_id,
      id,
    ]
  );
  return { id };
}
//xóa
export async function deleteReview(id) {
  await pool.query(`DELETE FROM danh_gia WHERE id=?`, [id]);
  return { id };
}

// lọc
export async function listBuildings() {
  const [rows] = await pool.query(
    `SELECT id, ten_toa FROM toa_nha ORDER BY ten_toa`
  );
  return rows;
}
export async function replyReview(id, phan_hoi) {
  await pool.query(
    `UPDATE danh_gia SET phan_hoi=? WHERE id=?`,
    [phan_hoi || null, id]
  );
  return { id };
}