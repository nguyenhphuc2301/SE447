import express from "express";
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../services/building.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getAllBuildings();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await getBuildingById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy tòa nhà" });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = await createBuilding(req.body);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await updateBuilding(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteBuilding(req.params.id);
    res.json({ ok: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
