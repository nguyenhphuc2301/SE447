import express from "express";
import { listDorms, getDormDetail } from "../services/dorm.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await listDorms(req.query);
    res.json(data);
  } catch (err) {
    console.error("Lỗi listDorms:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách ký túc xá" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const dorm = await getDormDetail(req.params.id);
    if (!dorm) return res.status(404).json({ error: "Không tìm thấy ký túc xá" });
    res.json(dorm);
  } catch (err) {
    console.error("Lỗi getDormDetail:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết ký túc xá" });
  }
});

export default router;
