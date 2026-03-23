import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";

const TABLE = "nguoi_dung";

// Đăng ký
export async function register({
  ho_ten,
  email,
  mat_khau,
  so_dien_thoai,
  vai_tro_id = "VT01",
}) {
  const [exist] = await pool.execute(
    `SELECT id FROM ${TABLE} WHERE email=? LIMIT 1`,
    [email]
  );
  if (exist.length) {
    const err = new Error("Email đã tồn tại");
    err.status = 409;
    throw err;
  }

  const id = uuidv4();
  await pool.execute(
    `INSERT INTO ${TABLE}(id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id)
     VALUES (?,?,?,?,?,?)`,
    [id, ho_ten, email, mat_khau, so_dien_thoai, vai_tro_id]
  );

  return { id, email };
}

// Đăng nhập
export async function login({ email, mat_khau }) {
  const [rows] = await pool.execute(
    `SELECT id, ho_ten, email, mat_khau, vai_tro_id
     FROM ${TABLE}
     WHERE email=? LIMIT 1`,
    [email]
  );

  const user = rows[0];
  if (!user || user.mat_khau !== mat_khau) {
    const err = new Error("Sai email hoặc mật khẩu");
    err.status = 401;
    throw err;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("Thiếu JWT_SECRET trong .env");
    err.status = 500;
    throw err;
  }

  const expiresIn = process.env.JWT_EXPIRES || "7d";

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.vai_tro_id },
    secret,
    { expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      ho_ten: user.ho_ten,
      email: user.email,
      role: user.vai_tro_id,
    },
  };
}
