import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// lấy danh sách
export async function fetchRooms(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const { data } = await axios.get(`${API}/rooms?${params}`);
  return data.data;
}

// lấy chi tiết
export async function fetchRoom(id) {
  const { data } = await axios.get(`${API}/rooms/${id}`);
  return data.data;
}

// tạo
export async function createRoom(payload) {
  const { data } = await axios.post(`${API}/rooms`, payload);
  return data.data;
}

// sửa
export async function updateRoom(id, payload) {
  const { data } = await axios.put(`${API}/rooms/${id}`, payload);
  return data.data;
}

// xóa
export async function removeRoom(id) {
  await axios.delete(`${API}/rooms/${id}`);
  return true;
}
