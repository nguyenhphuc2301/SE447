import express from "express";
import { login, register } from "../services/auth.service.js";

const router = express.Router();
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post(
  "/register",
  asyncH(async (req, res) => {
    const data = await register(req.body);
    res.status(201).json({ ok: true, data });
  })
);

router.post(
  "/login",
  asyncH(async (req, res) => {
    const data = await login(req.body);
    res.json({ ok: true, ...data }); 
  })
);

export default router;
