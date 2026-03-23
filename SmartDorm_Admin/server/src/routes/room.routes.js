import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/room.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getAllRooms(req.query);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await getRoomById(req.params.id);
    if (!data)
      return res.status(404).json({ ok: false, message: "Room not found" });
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = await createRoom(req.body);
    res.json({ ok: true, message: "Created", data });
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({
        ok: false,
        message: e.message,
      });
    }
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await updateRoom(req.params.id, req.body);
    res.json({ ok: true, message: "Updated", data });
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({
        ok: false,
        message: e.message,
      });
    }
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteRoom(req.params.id);
    res.json({ ok: true, message: "Deleted" });
  } catch (e) {
    next(e);
  }
});

export default router;
