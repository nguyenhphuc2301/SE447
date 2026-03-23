import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createRoom, fetchRoom, updateRoom } from "../services/room.service";
import { fetchBuildings } from "../services/DBBD.service";
import { ArrowLeft } from "lucide-react";

const empty = {
  toa_nha_id: "",
  so_phong: "",
  tang: 1,
  suc_chua: 1,
  so_nguoi_dang_o: 0,
  gioi_tinh: "khac",
  gia_tien: 0,
  trang_thai: "con_trong",
};

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  useEffect(() => {
    (async () => {
      try {
        setBuildings(await fetchBuildings().catch(() => []));
        if (isEdit) {
          setLoading(true);
          const r = await fetchRoom(id);
          setForm({
            toa_nha_id: r.toa_nha_id,
            so_phong: r.so_phong,
            tang: r.tang,
            suc_chua: r.suc_chua,
            so_nguoi_dang_o: r.so_nguoi_dang_o ?? 0,
            gioi_tinh: r.gioi_tinh,
            gia_tien: r.gia_tien,
            trang_thai: r.trang_thai,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    // clear error khi user sửa lại
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const capacity = Number(form.suc_chua ?? 0);
    const occupied = Number(form.so_nguoi_dang_o ?? 0);

    if (occupied > capacity) {
      setError("Current occupants must be less than or equal to capacity.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) await updateRoom(id, form);
      else await createRoom(form);
      navigate("/rooms");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "An error occurred while saving the room.";
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Room" : "Add New Room"}
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-gray-500">Loading data...</div>
          ) : (
            <>
              {/* Building */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Building
                </label>
                <select
                  name="toa_nha_id"
                  value={form.toa_nha_id}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.ten_toa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room number */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Room Number
                </label>
                <input
                  name="so_phong"
                  value={form.so_phong}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="E.g., 101"
                  required
                />
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  name="tang"
                  value={form.tang}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min={1}
                  required
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="suc_chua"
                  value={form.suc_chua}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min={1}
                  required
                />
              </div>

              {/* Current occupants */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Current Occupants
                </label>
                <input
                  type="number"
                  name="so_nguoi_dang_o"
                  value={form.so_nguoi_dang_o}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min={0}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Gender
                </label>
                <select
                  name="gioi_tinh"
                  value={form.gioi_tinh}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="nam">Male</option>
                  <option value="nu">Female</option>
                  <option value="khac">Any</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price (VND / month)
                </label>
                <input
                  type="number"
                  name="gia_tien"
                  value={form.gia_tien}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min={0}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="trang_thai"
                  value={form.trang_thai}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="con_trong">Available</option>
                  <option value="da_dat">Occupied</option>
                  <option value="dang_bao_tri">Maintenance</option>
                  <option value="co_van_de">Issue</option>
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
                    : "Create Room"}
                </button>
                <Link
                  to="/rooms"
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
