import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function setAuthToken(token) {
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete axios.defaults.headers.common.Authorization;
}

export async function loginAdmin({ email, mat_khau }) {
  const { data } = await axios.post(`${API}/auth/login`, { email, mat_khau });
  return data;
}

export function saveAuth(data) {
  localStorage.setItem("admin_auth", JSON.stringify(data));
  setAuthToken(data?.token);
}

export function getAuth() {
  const raw = localStorage.getItem("admin_auth");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem("admin_auth");
  setAuthToken(null);
}
