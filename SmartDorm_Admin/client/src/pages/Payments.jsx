import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPayments,
  deletePayment,
} from "../services/payment.service";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

function formatCurrency(value) {
  if (value == null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN");
}

function renderMethod(m) {
  if (m === "tien_mat") return "Tiền mặt";
  if (m === "chuyen_khoan") return "Chuyển khoản";
  return m;
}

function renderStatus(s) {
  if (s === "da_thanh_toan") return "paid";
  if (s === "chua_thanh_toan") return "unpaid";
  return s;
}

export default function Payments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      const data = await fetchPayments();
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa thanh toán này?")) return;
    try {
      await deletePayment(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Xóa không thành công");
    }
  }

  const filtered = items.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.ten_sinh_vien?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.so_phong?.toString().includes(q) ||
      p.ten_toa?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <button
          onClick={() => navigate("/payments/new")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by student, room, building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            No payments found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">STUDENT</th>
                <th className="py-2 px-3">ROOM</th>
                <th className="py-2 px-3">BUILDING</th>
                <th className="py-2 px-3">AMOUNT</th>
                <th className="py-2 px-3">METHOD</th>
                <th className="py-2 px-3">PAID AT</th>
                <th className="py-2 px-3">STATUS</th>
                <th className="py-2 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-3">#{idx + 1}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                        {p.ten_sinh_vien?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {p.ten_sinh_vien}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">{p.so_phong}</td>
                  <td className="py-2 px-3">{p.ten_toa}</td>
                  <td className="py-2 px-3">
                    {formatCurrency(p.so_tien)}
                  </td>
                  <td className="py-2 px-3">{renderMethod(p.phuong_thuc)}</td>
                  <td className="py-2 px-3">
                    {formatDate(p.ngay_thanh_toan)}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.trang_thai === "da_thanh_toan"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {renderStatus(p.trang_thai)}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/payments/${p.id}`)}
                        className="p-1 rounded hover:bg-gray-100"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigate(`/payments/${p.id}/edit`)}
                        className="p-1 rounded hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
