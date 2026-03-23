// client/src/pages/PaymentForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPayment,
  fetchPayment,
  updatePayment,
} from "../services/payment.service";
import { ArrowLeft } from "lucide-react";

export default function PaymentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    dat_phong_id: "",
    so_tien: "",
    ngay_thanh_toan: "",
    phuong_thuc: "tien_mat",
    trang_thai: "chua_thanh_toan",
  });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await fetchPayment(id);
        setForm({
          dat_phong_id: data.dat_phong_id,
          so_tien: data.so_tien,
          ngay_thanh_toan: data.ngay_thanh_toan
            ? new Date(data.ngay_thanh_toan).toISOString().slice(0, 16)
            : "",
          phuong_thuc: data.phuong_thuc,
          trang_thai: data.trang_thai,
        });
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu thanh toán");
      }
    })();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        so_tien: Number(form.so_tien),
        ngay_thanh_toan: form.ngay_thanh_toan
          ? new Date(form.ngay_thanh_toan)
          : null,
      };

      if (isEdit) {
        await updatePayment(id, payload);
      } else {
        await createPayment(payload);
      }

      navigate("/payments");
    } catch (err) {
      console.error(err);
      alert("Lưu thanh toán không thành công");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-600 mb-4 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Payment" : "Add Payment"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Booking ID (dat_phong_id)
          </label>
          <input
            type="text"
            name="dat_phong_id"
            value={form.dat_phong_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Amount (VND)
          </label>
          <input
            type="number"
            name="so_tien"
            value={form.so_tien}
            onChange={handleChange}
            required
            min={0}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Paid at
          </label>
          <input
            type="datetime-local"
            name="ngay_thanh_toan"
            value={form.ngay_thanh_toan}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Method
            </label>
            <select
              name="phuong_thuc"
              value={form.phuong_thuc}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tien_mat">Tiền mặt</option>
              <option value="chuyen_khoan">Chuyển khoản</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              name="trang_thai"
              value={form.trang_thai}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="chua_thanh_toan">Chưa thanh toán</option>
              <option value="da_thanh_toan">Đã thanh toán</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
