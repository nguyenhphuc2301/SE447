import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
  withCredentials: false,
});

// Danh sách + lọc
export async function fetchBookings(params = {}) {
  const { data } = await api.get("/bookings", { params });
  return data.data;
}

// Chi tiết
export async function fetchBooking(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data.data;
}

//lọc tòa nhà
export async function fetchBookingBuildings() {
  const { data } = await api.get("/bookings/buildings");
  return data.data;
}

// Tạo mới
export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data.data;
}

// Sửa
export async function updateBooking(id, payload) {
  const { data } = await api.put(`/bookings/${id}`, payload);
  return data.data;
}

// Huỷ
export async function cancelBooking(id) {
  const { data } = await api.delete(`/bookings/${id}`);
  return data.data;
}
