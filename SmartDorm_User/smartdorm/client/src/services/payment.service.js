const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
//Lấy thanh toán theo mã đặt phòng.
export async function fetchPaymentSummary(dat_phong_id) {
  const res = await fetch(`${API}/payments/summary/${dat_phong_id}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Lỗi lấy tóm tắt thanh toán");
  return json.data;
}

//Tạo mới giao dịch thanh toán
export async function createPayment(payload) {
  const res = await fetch(`${API}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Lỗi tạo thanh toán");
  return json.payment;
}

//Xác nhận thanh toán
export async function confirmPayment(payment_id) {
  const res = await fetch(`${API}/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment_id }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message || "Lỗi xác nhận thanh toán");
  return json;
}
