import express from "express";
import {
  listReports,
  getReportById,
  createReport,
  updateReport,
  changeStatus,
  deleteReport,
  listBuildings,
  listUnresolvedReports,
} from "../services/report.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listReports(req.query) });
  } catch (e) {
    next(e);
  }
});

router.get("/buildings", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listBuildings() });
  } catch (e) {
    next(e);
  }
});

router.get("/unresolved", async (req, res, next) => {
  try {
    const limit = req.query.limit || 5;
    res.json({ ok: true, data: await listUnresolvedReports(limit) });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getReportById(req.params.id) });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await createReport(req.body) });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await updateReport(req.params.id, req.body) });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/status", async (req, res, next) => {
  try {
    res.json({
      ok: true,
      data: await changeStatus(req.params.id, req.body.status),
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await deleteReport(req.params.id) });
  } catch (e) {
    next(e);
  }
});

export default router;
