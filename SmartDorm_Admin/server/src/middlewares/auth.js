import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "smartdorm_secret");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/Expired token" });
  }
}

export function requireAdmin(req, res, next) {
  // bạn có thể check roleName hoặc roleId
  const roleId = req.user?.vai_tro_id;
  const roleName = req.user?.ten_vai_tro;

  if (roleId === "VT02" || roleName === "Quản trị viên") return next();
  return res.status(403).json({ message: "Admin only" });
}
