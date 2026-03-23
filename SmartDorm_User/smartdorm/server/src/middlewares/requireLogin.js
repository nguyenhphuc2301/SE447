export function requireLogin(req, res, next) {
  const user =
    req.user || 
    req.session?.user || 
    req.session?.auth || 
    null;

  if (!user) {
    return res.status(401).json({ ok: false, message: "Bạn chưa đăng nhập" });
  }

  req.authUser = user;
  next();
}
