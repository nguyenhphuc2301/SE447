import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";


import {
  listReviewsByRoom,
  getReviewSummaryByRoom,
  createReview,
} from "../services/review.service.js";

const router = express.Router();

router.get("/rooms/:roomId", listReviewsByRoom);
router.get("/rooms/:roomId/summary", getReviewSummaryByRoom);


router.post("/", requireAuth, createReview);

export default router;
