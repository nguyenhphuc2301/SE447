import express from "express";
import {
  listReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
  listBuildings,
  replyReview, // ✅ thêm
} from "../services/review.service.js";

const router = express.Router();

router.get("/buildings", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listBuildings() });
  } catch (e) {
    next(e);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getReviewStats(req.query) });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listReviews(req.query) });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getReviewById(req.params.id) });
  } catch (e) {
    next(e);
  }
});


router.patch("/:id/reply", async (req, res, next) => {
  try {
    const { phan_hoi } = req.body;
    res.json({ ok: true, data: await replyReview(req.params.id, phan_hoi) });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await createReview(req.body) });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await updateReview(req.params.id, req.body) });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await deleteReview(req.params.id) });
  } catch (e) {
    next(e);
  }
});

export default router;
