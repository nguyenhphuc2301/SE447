import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * POST /auth/login
 * body: { email, mat_khau }
 * Chỉ cho phép vai_tro = 'Quản trị viên' (VT02) đăng nhập admin
 */
router.post("/login", async (req, res) => {
  const { email, mat_khau } = req.body || {};
  if (!email || !mat_khau) {
    return res.status(400).json({ message: "Missing email/password" });
  }

  try {
    const conn = await pool.getConnection();

    // join role để lấy ten_vai_tro
    const [rows] = await conn.query(
      `SELECT nd.id, nd.ho_ten, nd.email, nd.mat_khau, nd.vai_tro_id,
              vt.ten_vai_tro
       FROM nguoi_dung nd
       LEFT JOIN vai_tro vt ON vt.id = nd.vai_tro_id
       WHERE nd.email = ?
       LIMIT 1`,
      [email]
    );

    conn.release();

    if (!rows.length) return res.status(401).json({ message: "Sai tài khoản" });

    const u = rows[0];
    if (u.mat_khau !== mat_khau) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }
    if (!(u.vai_tro_id === "VT02" || u.ten_vai_tro === "Quản trị viên")) {
      return res.status(403).json({ message: "Chỉ quản trị viên mới được đăng nhập" });
    }

    const token = jwt.sign(
      {
        id: u.id,
        ho_ten: u.ho_ten,
        email: u.email,
        vai_tro_id: u.vai_tro_id,
        ten_vai_tro: u.ten_vai_tro,
      },
      process.env.JWT_SECRET || "smartdorm_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: u.id,
        ho_ten: u.ho_ten,
        email: u.email,
        vai_tro_id: u.vai_tro_id,
        ten_vai_tro: u.ten_vai_tro,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
