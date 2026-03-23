import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchBooking,
  createBooking,
  updateBooking,
} from "../services/booking.service";
import { ArrowLeft } from "lucide-react";

export default function BookingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nguoi_dung_id: "",
    phong_id: "",
    ngay_nhan_phong: "",
    thoi_gian_cu_tru: 30,
    trang_thai: "cho_duyet",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchBooking(id);
        setForm({
          nguoi_dung_id: data.nguoi_dung_id,
          phong_id: data.phong_id,
          ngay_nhan_phong: data.ngay_nhan_phong?.split("T")[0] || "",
          thoi_gian_cu_tru: data.thoi_gian_cu_tru ?? 30,
          trang_thai: data.trang_thai || "cho_duyet",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updateBooking(id, form);
        alert("Booking updated successfully!");
      } else {
        await createBooking(form);
        alert("Booking created successfully!");
      }
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving booking.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Booking" : "Add New Booking"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-4"
      >
        {loading ? (
          <div className="text-gray-500 text-sm">Loading data...</div>
        ) : (
          <>
            {/* User ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                User ID
              </label>
              <input
                className="border rounded-lg px-3 py-2 w-full text-sm"
                value={form.nguoi_dung_id}
                onChange={(e) =>
                  setForm({ ...form, nguoi_dung_id: e.target.value })
                }
                placeholder="E.g., U001"
                required
              />
            </div>

            {/* Room ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Room ID
              </label>
              <input
                className="border rounded-lg px-3 py-2 w-full text-sm"
                value={form.phong_id}
                onChange={(e) =>
                  setForm({ ...form, phong_id: e.target.value })
                }
                placeholder="E.g., R001"
                required
              />
            </div>

            {/* Check-in & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2 w-full text-sm"
                  value={form.ngay_nhan_phong}
                  onChange={(e) =>
                    setForm({ ...form, ngay_nhan_phong: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Duration of Stay (months)
                </label>
                <input
                  type="number"
                  min="1"
                  className="border rounded-lg px-3 py-2 w-full text-sm"
                  value={form.thoi_gian_cu_tru}
                  onChange={(e) =>
                    setForm({ ...form, thoi_gian_cu_tru: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Status
              </label>
              <select
                className="border rounded-lg px-3 py-2 w-full text-sm"
                value={form.trang_thai}
                onChange={(e) =>
                  setForm({ ...form, trang_thai: e.target.value })
                }
              >
                <option value="cho_duyet">Pending</option>
                <option value="da_duyet">Approved</option>
                <option value="da_huy">Rejected</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Booking"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
