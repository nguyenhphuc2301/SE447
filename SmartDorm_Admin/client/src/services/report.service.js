import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
});
// lấy reports
export async function fetchReports(params = {}) {
  const { data } = await api.get("/reports", { params });
  return data.data;
}
export async function fetchReport(id) {
  const { data } = await api.get(`/reports/${id}`);
  return data.data;
}

// lấy building
export async function fetchReportBuildings() {
  const { data } = await api.get("/reports/buildings");
  return data.data;
}

// tạo reports
export async function createReport(payload) {
  const { data } = await api.post("/reports", payload);
  return data.data;
}
// sửa reports
export async function updateReport(id, payload) {
  const { data } = await api.put(`/reports/${id}`, payload);
  return data.data;
}
export async function setReportStatus(id, status) {
  const { data } = await api.post(`/reports/${id}/status`, { status });
  return data.data;
}
// xóa reports
export async function deleteReport(id) {
  const { data } = await api.delete(`/reports/${id}`);
  return data.data;
}
// lấy reports chưa giải quyết (chua_xu_ly)
export async function fetchUnresolvedReports(limit = 5) {
  const { data } = await api.get("/reports/unresolved", { params: { limit } });
  return data.data;
}
