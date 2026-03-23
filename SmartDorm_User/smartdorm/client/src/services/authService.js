import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";
const KEY = "smartdorm_auth";

// ===== API =====
export const login = async (data) =>
  axios.post(`${API_URL}/login`, data, { withCredentials: true });

export const register = async (data) =>
  axios.post(`${API_URL}/register`, data, { withCredentials: true });

// ===== LocalStorage =====
// payload: { token, user }
export function saveAuth(payload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getUser() {
  return getAuth()?.user || null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(KEY);
}
