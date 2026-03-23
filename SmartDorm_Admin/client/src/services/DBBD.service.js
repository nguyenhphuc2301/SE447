import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
  withCredentials: false,
});
// Dashboard
export async function fetchDashboard() {
  const { data } = await api.get("/dashboard");
  return data.data;
}
// lấy Buildings
export async function fetchBuildings() {
  const { data } = await api.get("/buildings");
  return data.data;
}
//Tạo build
export async function createBuilding(payload) {
  const { data } = await api.post("/buildings", payload);
  return data.data;
}
//sửa build
export async function updateBuilding(id, payload) {
  const { data } = await api.put(`/buildings/${id}`, payload);
  return data.data;
}
//xóa build
export async function deleteBuilding(id) {
  const { data } = await api.delete(`/buildings/${id}`);
  return data.data;
}

export default api;
