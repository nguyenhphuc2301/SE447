import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createUser,
  fetchUser,
  updateUser,
  fetchUserRoles,
  fetchUniversities,
} from "../services/user.service";
import { ArrowLeft } from "lucide-react";

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    gioi_tinh: "khac",
    can_cuoc: "",
    vai_tro_id: "",
    truong_dai_hoc_id: "",
    mat_khau: "",
  });

  const [roles, setRoles] = useState([]);
  const [unis, setUnis] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setRoles(await fetchUserRoles());
      setUnis(await fetchUniversities());

      if (isEdit) {
        const u = await fetchUser(id);
        setForm({
          ho_ten: u.ho_ten || "",
          email: u.email || "",
          so_dien_thoai: u.so_dien_thoai || "",
          gioi_tinh: u.gioi_tinh || "khac",
          can_cuoc: u.can_cuoc || "",
          vai_tro_id: u.vai_tro_id || "",
          truong_dai_hoc_id: u.truong_dai_hoc_id || "",
          mat_khau: "",
        });
      }
    })();
  }, [id, isEdit]);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await updateUser(id, form);
      else await createUser(form);
      navigate("/users");
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
            {isEdit ? "Edit User" : "Add User"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="ho_ten"
              value={form.ho_ten}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="so_dien_thoai"
              value={form.so_dien_thoai}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <select
              name="gioi_tinh"
              value={form.gioi_tinh}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="nam">Male</option>
              <option value="nu">Female</option>
              <option value="khac">Other</option>
            </select>
          </div>

          {/* Password (only when create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="mat_khau"
                value={form.mat_khau}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* National ID */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              National ID
            </label>
            <input
              name="can_cuoc"
              value={form.can_cuoc}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              name="vai_tro_id"
              value={form.vai_tro_id}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.ten_vai_tro}
                </option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              University
            </label>
            <select
              name="truong_dai_hoc_id"
              value={form.truong_dai_hoc_id}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select university</option>
              {unis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.ten_truong}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/users")}
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
