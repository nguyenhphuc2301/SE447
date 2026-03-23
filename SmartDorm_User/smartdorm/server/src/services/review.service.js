import pool from "../config/db.js";

// GET /api/reviews/rooms/:roomId?limit=&page=
export async function listReviewsByRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.max(parseInt(req.query.limit || "5"), 1);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `
      SELECT dg.id, dg.noi_dung, dg.so_sao, dg.ngay_danh_gia, dg.phan_hoi, dg.trang_thai,
             nd.ho_ten AS user_name
      FROM danh_gia dg
      JOIN nguoi_dung nd ON nd.id = dg.nguoi_dung_id
      WHERE dg.phong_id = ? AND dg.trang_thai = 'da_duyet'
      ORDER BY dg.ngay_danh_gia DESC
      LIMIT ? OFFSET ?
      `,
      [roomId, limit, offset]
    );

    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM danh_gia
       WHERE phong_id = ? AND trang_thai = 'da_duyet'`,
      [roomId]
    );

    res.json({ items: rows, page, limit, total: countRow.total });
  } catch (e) {
    next(e);
  }
}

// GET /api/reviews/rooms/:roomId/summary
export async function getReviewSummaryByRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const [rows] = await pool.query(
      `
      SELECT
        COALESCE(ROUND(AVG(so_sao), 1), 0) AS avg,
        COUNT(*)                          AS count,
        COALESCE(SUM(so_sao=5), 0)        AS star5,
        COALESCE(SUM(so_sao=4), 0)        AS star4,
        COALESCE(SUM(so_sao=3), 0)        AS star3,
        COALESCE(SUM(so_sao=2), 0)        AS star2,
        COALESCE(SUM(so_sao=1), 0)        AS star1
      FROM danh_gia
      WHERE phong_id = ? AND trang_thai = 'da_duyet'
      `,
      [roomId]
    );

    res.json(
      rows[0] || { avg: 0, count: 0, star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 }
    );
  } catch (e) {
    next(e);
  }
}

// POST /api/reviews  (requireAuth)
export async function createReview(req, res, next) {
  try {
    const { phong_id, noi_dung, so_sao } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Bạn cần đăng nhập" });

    if (!phong_id || !noi_dung || so_sao == null) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    const star = Number(so_sao);
    if (!Number.isFinite(star) || star < 1 || star > 5) {
      return res.status(400).json({ error: "Số sao phải từ 1 đến 5" });
    }

    await pool.query(
      `
      INSERT INTO danh_gia
        (id, phong_id, nguoi_dung_id, noi_dung, so_sao, ngay_danh_gia, trang_thai)
      VALUES (UUID(), ?, ?, ?, ?, NOW(), 'cho_duyet')
      `,
      [phong_id, userId, noi_dung.trim(), star]
    );

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
