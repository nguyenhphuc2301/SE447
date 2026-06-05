import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dashboardRouter from "./routes/dashboard.routes.js";
import buildingRouter from "./routes/building.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js"; 
import reportRoutes from "./routes/report.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors());
app.use(express.json());  

app.get("/", (req, res) => {
  res.send(" SmartDormAdmin backend đang chạy!");
});

app.use("/api/dashboard", dashboardRouter);
app.use("/api/buildings", buildingRouter);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/auth", authRoutes);


app.use((err, req, res, next) => {
  console.error("Lỗi:", err);
  res.status(500).json({ ok: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
