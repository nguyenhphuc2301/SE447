import express from "express";
import {
  listBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  listBuildingsForFilter,
} from "../services/booking.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await listBookings(req.query);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/buildings", async (req, res, next) => {
  try {
    const data = await listBuildingsForFilter();
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await getBookingById(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = await createBooking(req.body);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await updateBooking(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await cancelBooking(req.params.id);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

export default router;
