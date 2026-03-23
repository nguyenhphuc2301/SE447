import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
});

// lấy danh sách
export async function fetchUsers(params = {}) {
  const { data } = await api.get("/users", { params });
  return data.data;
}
// lấy chi tiết
export async function fetchUser(id) {
  const { data } = await api.get(`/users/${id}`);
  return data.data;
}
// tạo
export async function createUser(payload) {
  const { data } = await api.post("/users", payload);
  return data.data;
}
// sửa
export async function updateUser(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data.data;
}
// xóa
export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`);
  return data.data;
}
// lọc danh sác
export async function fetchUserRoles() {
  const { data } = await api.get("/users/roles");
  return data.data;
}
export async function fetchUniversities() {
  const { data } = await api.get("/users/universities");
  return data.data;
}
