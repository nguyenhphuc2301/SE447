import express from "express";
import { getDashboardData } from "../services/dashboard.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getDashboardData();
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

export default router;
