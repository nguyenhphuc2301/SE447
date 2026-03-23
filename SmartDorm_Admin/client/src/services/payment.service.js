// client/src/services/payment.service.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}

export async function fetchPayments() {
  const res = await fetch(`${API_URL}/payments`);
  return handleResponse(res);
}

export async function fetchPayment(id) {
  const res = await fetch(`${API_URL}/payments/${id}`);
  return handleResponse(res);
}

export async function createPayment(data) {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updatePayment(id, data) {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deletePayment(id) {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
