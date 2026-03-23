import { getToken } from "./authService";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function readSafe(res) {
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {}
  return { data, raw };
}

function withAuthHeaders(extra = {}) {
  const token = getToken();
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

function pickErrorMessage(data, raw, fallback) {
  return (
    data?.message ||
    data?.error ||
    (typeof raw === "string" && raw.trim() ? raw : null) ||
    fallback
  );
}

// Đơn đặt phòng của tôi
export async function getMyBookings() {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${API}/bookings/my`, {
    method: "GET",
    headers: withAuthHeaders(),
    credentials: "include",
  });

  const { data, raw } = await readSafe(res);

  if (!res.ok || data?.ok === false) {
    throw new Error(pickErrorMessage(data, raw, "Không lấy được danh sách đơn"));
  }

  return data?.data ?? data;
}

// Tạo booking
export async function createBooking(payload) {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: withAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const { data, raw } = await readSafe(res);

  if (!res.ok || data?.ok === false) {
    throw new Error(pickErrorMessage(data, raw, "Tạo đơn thất bại"));
  }

  return data?.data ?? data;
}

//  Đặt cọc
export async function payDeposit(dat_phong_id) {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${API}/bookings/${dat_phong_id}/pay`, {
    method: "POST",
    headers: withAuthHeaders(),
    credentials: "include",
  });

  const { data, raw } = await readSafe(res);

  if (!res.ok || data?.ok === false) {
    throw new Error(pickErrorMessage(data, raw, "Thanh toán thất bại"));
  }

  return data?.data ?? data;
}

// Lấy chi tiết đơn
export async function getBooking(dat_phong_id) {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${API}/bookings/${dat_phong_id}`, {
    method: "GET",
    headers: withAuthHeaders(),
    credentials: "include",
  });

  const { data, raw } = await readSafe(res);

  if (!res.ok || data?.ok === false) {
    throw new Error(pickErrorMessage(data, raw, "Không lấy được đơn"));
  }

  return data?.data ?? data;
}

// Biên lai
export async function getReceipt(dat_phong_id) {
  const token = getToken();
  if (!token) throw new Error("Bạn chưa đăng nhập");

  const res = await fetch(`${API}/bookings/${dat_phong_id}/receipt`, {
    method: "GET",
    headers: withAuthHeaders(),
    credentials: "include",
  });

  const { data, raw } = await readSafe(res);

  if (!res.ok || data?.ok === false) {
    throw new Error(pickErrorMessage(data, raw, "Không lấy được biên nhận"));
  }

  return data?.data ?? data;
}
