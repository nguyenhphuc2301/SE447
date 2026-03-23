import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const STATUS = {
  unresolved: "chua_xu_ly",
  in_progress: "dang_xu_ly",
  resolved: "da_xu_ly",
};

function buildWhere({ q, status, buildingId }) {
  const where = ["1=1"];
  const params = [];
  if (q) {
    where.push("(BC.noi_dung LIKE ? OR ND.ho_ten LIKE ? OR P.so_phong LIKE ? OR T.ten_toa LIKE ?)");
    const s = `%${q}%`;
    params.push(s, s, s, s);
  }
  if (status) {
    where.push("BC.trang_thai = ?");
    params.push(STATUS[status] || status);
  }
  if (buildingId) {
    where.push("T.id = ?");
    params.push(buildingId);
  }
  return { where: where.join(" AND "), params };
}

export async function listReports({ q, status, buildingId }) {
  const { where, params } = buildWhere({ q, status, buildingId });

  const [rows] = await pool.query(
    `
    SELECT
      BC.id, BC.noi_dung, BC.ngay_bao_cao, BC.trang_thai,
      ND.id  AS nguoi_id, ND.ho_ten AS ten_sinh_vien, ND.so_dien_thoai, ND.email,
      P.id   AS phong_id, P.so_phong,
      T.id   AS toa_id, T.ten_toa
    FROM bao_cao BC
    JOIN nguoi_dung ND ON ND.id = BC.nguoi_gui_id
    JOIN phong P ON P.id = BC.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE ${where}
    ORDER BY BC.ngay_bao_cao DESC
    `,
    params
  );

  // counters
  const total = rows.length;
  const unresolved = rows.filter(r => r.trang_thai === "chua_xu_ly").length;
  const in_progress = rows.filter(r => r.trang_thai === "dang_xu_ly").length;
  const resolved = rows.filter(r => r.trang_thai === "da_xu_ly").length;

  return { items: rows, counters: { total, unresolved, in_progress, resolved } };
}

export async function getReportById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      BC.*, ND.ho_ten AS ten_sinh_vien, ND.email, ND.so_dien_thoai,
      P.so_phong, T.ten_toa
    FROM bao_cao BC
    JOIN nguoi_dung ND ON ND.id = BC.nguoi_gui_id
    JOIN phong P ON P.id = BC.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE BC.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}

export async function createReport(payload) {
  const id = uuidv4();
  await pool.query(
    `
    INSERT INTO bao_cao
      (id, nguoi_gui_id, phong_id, noi_dung, ngay_bao_cao, trang_thai)
    VALUES (?, ?, ?, ?, NOW(), ?)
    `,
    [
      id,
      payload.nguoi_gui_id,
      payload.phong_id,
      payload.noi_dung || "",
      STATUS[payload.status] || "chua_xu_ly",
    ]
  );
  return { id };
}

export async function updateReport(id, payload) {
  await pool.query(
    `
    UPDATE bao_cao
    SET nguoi_gui_id=?, phong_id=?, noi_dung=?, trang_thai=?
    WHERE id=?
    `,
    [
      payload.nguoi_gui_id,
      payload.phong_id,
      payload.noi_dung || "",
      STATUS[payload.status] || payload.trang_thai || "chua_xu_ly",
      id,
    ]
  );
  return { id };
}

export async function changeStatus(id, uiStatus) {
  await pool.query(`UPDATE bao_cao SET trang_thai=? WHERE id=?`, [STATUS[uiStatus], id]);
  return { id, status: uiStatus };
}

export async function deleteReport(id) {
  await pool.query(`DELETE FROM bao_cao WHERE id=?`, [id]);
  return { id };
}

// filter helpers
export async function listBuildings() {
  const [rows] = await pool.query(`SELECT id, ten_toa FROM toa_nha ORDER BY ten_toa`);
  return rows;
}
export async function listUnresolvedReports(limit = 5) {
  const [rows] = await pool.query(
    `
    SELECT
      BC.id, BC.noi_dung, BC.ngay_bao_cao, BC.trang_thai,
      P.so_phong, T.ten_toa
    FROM bao_cao BC
    JOIN phong P ON P.id = BC.phong_id
    JOIN toa_nha T ON T.id = P.toa_nha_id
    WHERE BC.trang_thai = ?
    ORDER BY BC.ngay_bao_cao DESC
    LIMIT ?
    `,
    ["chua_xu_ly", Number(limit)]
  );

  return rows;
}

