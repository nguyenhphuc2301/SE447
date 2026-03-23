import express from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  listRoles,
  listUniversities,
} from "../services/user.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
});

router.get("/roles", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listRoles() });
  } catch (e) {
    next(e);
  }
});

router.get("/universities", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await listUniversities() });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await getUserById(req.params.id) });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await createUser(req.body) });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await updateUser(req.params.id, req.body) });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res.json({ ok: true, data: await deleteUser(req.params.id) });
  } catch (e) {
    next(e);
  }
});

export default router;
