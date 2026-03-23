import React, { useEffect, useState } from "react";
import {
  fetchBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../services/DBBD.service";
import { Edit, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    ten_toa: "",
    dia_chi: "",
    mo_ta: "",
    so_tang: "",
    anh_toa_nha: "",
  });

  useEffect(() => {
    fetchBuildings().then(setBuildings);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ten_toa.trim()) return alert("Building name is required!");

    try {
      if (editing) {
        await updateBuilding(editing.id, form);
        alert("Building updated successfully!");
      } else {
        await createBuilding(form);
        alert("New building added successfully!");
      }

      const updated = await fetchBuildings();
      setBuildings(updated);

      setShowForm(false);
      setEditing(null);
      setForm({
        ten_toa: "",
        dia_chi: "",
        mo_ta: "",
        so_tang: "",
        anh_toa_nha: "",
      });
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  };

  const handleEdit = (b) => {
    setEditing(b);
    setForm({
      ten_toa: b.ten_toa,
      dia_chi: b.dia_chi,
      mo_ta: b.mo_ta,
      so_tang: b.so_tang,
      anh_toa_nha: b.anh_toa_nha,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this building?")) return;
    await deleteBuilding(id);
    setBuildings(buildings.filter((b) => b.id !== id));
  };

  const filtered = buildings.filter((b) =>
    b.ten_toa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Buildings</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({
              ten_toa: "",
              dia_chi: "",
              mo_ta: "",
              so_tang: "",
              anh_toa_nha: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Building
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search buildings..."
        className="border rounded-lg px-3 py-2 w-1/3 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      <div className="grid grid-cols-2 gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-lg shadow hover:shadow-lg border overflow-hidden p-4"
          >
            {b.anh_toa_nha ? (
              <img
                src={`http://localhost:4000/${
                  b.anh_toa_nha.startsWith("uploads/")
                    ? b.anh_toa_nha
                    : "uploads/" + b.anh_toa_nha
                }`}
                alt={b.ten_toa}
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 mb-3 rounded">
                No image
              </div>
            )}

            <h2 className="text-lg font-semibold mb-1">{b.ten_toa}</h2>
            <p className="text-gray-600 text-sm">{b.dia_chi}</p>
            <p className="text-gray-500 text-sm mb-2">{b.so_tang} Floors</p>
            <p className="text-gray-500 text-sm mb-3">{b.mo_ta}</p>

            <div className="flex justify-between items-center">
              <Link
                to={`/buildings/${b.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
              <div className="flex gap-3">
                <Edit
                  size={18}
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleEdit(b)}
                />
                <Trash2
                  size={18}
                  className="text-gray-500 hover:text-red-600 cursor-pointer"
                  onClick={() => handleDelete(b.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 mt-6">No buildings found.</p>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[400px] p-6 shadow-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Building" : "Add Building"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="ten_toa"
                value={form.ten_toa}
                onChange={handleChange}
                placeholder="Building Name"
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <input
                name="dia_chi"
                value={form.dia_chi}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="so_tang"
                value={form.so_tang}
                onChange={handleChange}
                placeholder="Floors"
                type="number"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="anh_toa_nha"
                value={form.anh_toa_nha}
                onChange={handleChange}
                placeholder="Building Image (URL)"
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="mo_ta"
                value={form.mo_ta}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded-lg px-3 py-2"
                rows="3"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
              >
                {editing ? "Save Changes" : "Add Building"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
