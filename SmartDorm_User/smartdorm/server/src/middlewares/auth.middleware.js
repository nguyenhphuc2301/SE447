import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      const err = new Error("Bạn chưa đăng nhập");
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error("Thiếu JWT_SECRET trong .env");
      err.status = 500;
      throw err;
    }

    const payload = jwt.verify(token, secret);
    req.user = payload; 
    next();
  } catch (e) {
    e.status = e.status || 401;
    next(e);
  }
}
