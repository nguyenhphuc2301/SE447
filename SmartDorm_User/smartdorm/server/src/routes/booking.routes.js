import express from "express";
import {
  createBooking,
  markDepositPaid,
  getBookingSummary,
  getBookingReceipt,
  getMyBookings,
} from "../services/booking.service.js";

import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/my",
  requireAuth,
  asyncH(async (req, res) => {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, message: "Token thiếu id user" });
    }
    const data = await getMyBookings(userId);
    res.json({ ok: true, data });
  })
);

router.post(
  "/",
  requireAuth,
  asyncH(async (req, res) => {
    const created = await createBooking(req.body, req.user);
    res.status(201).json({ ok: true, data: created });
  })
);

router.post(
  "/:id/pay",
  requireAuth,
  asyncH(async (req, res) => {
    await markDepositPaid(req.params.id);
    res.json({ ok: true });
  })
);

router.get(
  "/:id/receipt",
  requireAuth,
  asyncH(async (req, res) => {
    const data = await getBookingReceipt(req.params.id);
    res.json({ ok: true, data });
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncH(async (req, res) => {
    const data = await getBookingSummary(req.params.id);
    res.json({ ok: true, data });
  })
);

export default router;
