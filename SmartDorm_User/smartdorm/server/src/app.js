import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dormRoutes from "./routes/dorm.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import path from "path";
import { fileURLToPath } from "url";
console.log("JWT_SECRET =", process.env.JWT_SECRET);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// uploads ảnh
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dorms", dormRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// /ERROR JSON 
app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Lỗi máy chủ";
  res.status(status).json({ ok: false, message });
});

// /start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});
