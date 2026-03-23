import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createReview,
  fetchReview,
  updateReview,
} from "../services/review.service";
import { ArrowLeft } from "lucide-react";

export default function ReviewForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nguoi_dung_id: "",
    phong_id: "",
    so_sao: 5,
    noi_dung: "",
    phan_hoi: "",
    trang_thai: "da_duyet",
  });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const r = await fetchReview(id);
      setForm({
        nguoi_dung_id: r.nguoi_dung_id,
        phong_id: r.phong_id,
        so_sao: r.so_sao,
        noi_dung: r.noi_dung,
        phan_hoi: r.phan_hoi || "",
        trang_thai: r.trang_thai,
      });
    })();
  }, [id, isEdit]);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await updateReview(id, form);
      else await createReview(form);
      navigate("/reviews");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white border rounded-2xl shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-xl font-semibold">
            {isEdit ? "Edit Review" : "Add Review"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          {/* User ID */}
          <div>
            <label className="block text-sm mb-1">User ID</label>
            <input
              name="nguoi_dung_id"
              value={form.nguoi_dung_id}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Room ID */}
          <div>
            <label className="block text-sm mb-1">Room ID</label>
            <input
              name="phong_id"
              value={form.phong_id}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm mb-1">Rating</label>
            <select
              name="so_sao"
              value={form.so_sao}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="trang_thai"
              value={form.trang_thai}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="da_duyet">Approved</option>
              <option value="cho_duyet">Pending</option>
              <option value="bi_choi">Rejected</option>
            </select>
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Content</label>
            <textarea
              name="noi_dung"
              rows={5}
              value={form.noi_dung}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Response (optional) */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Response (optional)</label>
            <textarea
              name="phan_hoi"
              rows={3}
              value={form.phan_hoi}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Review"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reviews")}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
