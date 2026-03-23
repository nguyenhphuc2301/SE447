import { getToken } from "./authService";

const API = "http://localhost:8080/api/reviews";

export async function getReviewSummary(roomId) {
  const res = await fetch(`${API}/rooms/${roomId}/summary`);
  return res.json();
}

export async function getReviews(roomId, page = 1, limit = 5) {
  const res = await fetch(`${API}/rooms/${roomId}?page=${page}&limit=${limit}`);
  return res.json();
}

export async function postReview({ phong_id, so_sao, noi_dung }) {
  const token = getToken();
  if (!token) throw new Error("Bạn cần đăng nhập để đánh giá");

  const res = await fetch(`${API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({ phong_id, so_sao, noi_dung }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Không thể gửi đánh giá");

  return data;
}
