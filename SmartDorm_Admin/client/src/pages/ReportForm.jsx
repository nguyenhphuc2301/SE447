import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchReport,
  createReport,
  updateReport,
} from "../services/report.service";
import { ArrowLeft } from "lucide-react";

export default function ReportForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nguoi_gui_id: "",
    phong_id: "",
    noi_dung: "",
    status: "unresolved",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const r = await fetchReport(id);
      setForm({
        nguoi_gui_id: r.nguoi_gui_id,
        phong_id: r.phong_id,
        noi_dung: r.noi_dung || "",
        status:
          r.trang_thai === "da_xu_ly"
            ? "resolved"
            : r.trang_thai === "dang_xu_ly"
            ? "in_progress"
            : "unresolved",
      });
    })();
  }, [id, isEdit]);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await updateReport(id, form);
      else await createReport(form);
      navigate("/reports");
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
            {isEdit ? "Edit Report" : "Create Report"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Sender ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sender ID
              </label>
              <input
                name="nguoi_gui_id"
                value={form.nguoi_gui_id}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="User ID"
                required
              />
            </div>

            {/* Room ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Room ID
              </label>
              <input
                name="phong_id"
                value={form.phong_id}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Room ID"
                required
              />
            </div>
          </div>

          {/* Report content */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Report Content
            </label>
            <textarea
              name="noi_dung"
              value={form.noi_dung}
              onChange={onChange}
              rows={6}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="First line is the title, the following lines are detailed description..."
              required
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="unresolved">Unresolved</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Report"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
