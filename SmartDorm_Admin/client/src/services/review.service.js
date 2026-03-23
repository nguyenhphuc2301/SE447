import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
});
// lấy danh sách
export async function fetchReviews(params = {}) {
  const { data } = await api.get("/reviews", { params });
  return data.data;
}
export async function fetchReviewStats(params = {}) {
  const { data } = await api.get("/reviews/stats", { params });
  return data.data; 
}
// lấy chi tiết
export async function fetchReview(id) {
  const { data } = await api.get(`/reviews/${id}`);
  return data.data;
}
// tạo
export async function createReview(payload) {
  const { data } = await api.post("/reviews", payload);
  return data.data;
}
// sửa
export async function updateReview(id, payload) {
  const { data } = await api.put(`/reviews/${id}`, payload);
  return data.data;
}

// xóa
export async function deleteReview(id) {
  const { data } = await api.delete(`/reviews/${id}`);
  return data.data;
}
export async function fetchReviewBuildings() {
  const { data } = await api.get("/reviews/buildings");
  return data.data;
}

export async function replyReview(id, phan_hoi) {
  const res = await api.patch(`/reviews/${id}/reply`, { phan_hoi });
  return res.data;
}
