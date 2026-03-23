import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, saveAuth } from "../services/auth.service";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [mat_khau, setMatKhau] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      const data = await loginAdmin({ email, mat_khau });
      saveAuth(data);
      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800">Đăng nhập Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chỉ tài khoản <b>Quản trị viên</b> mới đăng nhập được.
        </p>

        {err && (
          <div className="mt-4 text-sm bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="a@gmail.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
              value={mat_khau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder="123456"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg py-2.5 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
