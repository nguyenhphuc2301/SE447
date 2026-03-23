import { Router } from "express";
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../services/payment.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await getPayments();
    res.json(items);
  } catch (err) {
    console.error("getPayments error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await getPaymentById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("getPaymentById error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = await createPayment(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await updatePayment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("updatePayment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await deletePayment(req.params.id);
    if (!ok) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("deletePayment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
