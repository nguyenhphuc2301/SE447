import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchRooms, removeRoom } from "../services/room.service.js";
import { fetchBuildings } from "../services/DBBD.service.js";

export default function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [gender, setGender] = useState("all");
  const [building, setBuilding] = useState("all");

  const load = async () => {
    try {
      const [rs, bs] = await Promise.all([
        fetchRooms({ search, status, gender, building }),
        fetchBuildings(),
      ]);
      setRooms(rs || []);
      setBuildings(bs || []);
    } catch (err) {
      console.error("Error loading rooms:", err);
    }
  };

  useEffect(() => {
    load();
  }, [search, status, gender, building]);

  const onDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    await removeRoom(id);
    await load();
  };

  const badge = (type, text) => {
    const map = {
      success: "bg-green-100 text-green-700",
      info: "bg-blue-100 text-blue-700",
      warn: "bg-yellow-100 text-yellow-700",
      gray: "bg-gray-100 text-gray-700",
      pink: "bg-pink-100 text-pink-700",
      danger: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${map[type]}`}>
        {text}
      </span>
    );
  };

  const genderBadge = (g) =>
    g === "nam"
      ? badge("info", "male")
      : g === "nu"
      ? badge("pink", "female")
      : badge("gray", "any");

  const statusBadge = (s) =>
    s === "con_trong"
      ? badge("success", "available")
      : s === "da_dat"
      ? badge("info", "occupied")
      : s === "dang_bao_tri"
      ? badge("warn", "maintenance")
      : s === "co_van_de"
      ? badge("danger", "issue")
      : badge("gray", "unknown");

  const bookedRooms = rooms.filter((r) => r.status === "da_dat");
  const totalBookedRooms = bookedRooms.length;
  const totalBookedAmount = bookedRooms.reduce(
    (sum, r) => sum + Number(r.price ?? 0),
    0
  );

  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v || 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Rooms</h1>
        <button
          onClick={() => navigate("/rooms/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <div className="bg-white shadow-md rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 w-full">
          {/* Tìm kiếm */}
          <div className="relative flex-grow">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Lọc trạng thái */}
          <select
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 min-w-[180px] focus:ring-2 focus:ring-blue-400 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="con_trong">Available</option>
            <option value="da_dat">Occupied</option>
            <option value="dang_bao_tri">Maintenance</option>
            <option value="co_van_de">Issue</option>
          </select>

          {/* Lọc giới tính */}
          <select
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 min-w-[180px] focus:ring-2 focus:ring-blue-400 outline-none"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="all">All Genders</option>
            <option value="nam">Male</option>
            <option value="nu">Female</option>
            <option value="khac">Any</option>
          </select>

          {/* Lọc tòa nhà */}
          <select
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 min-w-[200px] focus:ring-2 focus:ring-blue-400 outline-none"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
          >
            <option value="all">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.ten_toa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng hiển thị rooms */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Room
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Building
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Floor
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Capacity
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Gender
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Price
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                Status
              </th>
              <th className="p-3 text-gray-600 font-medium text-sm uppercase tracking-wide text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium text-gray-800">
                  Room {r.room_number}
                </td>
                <td className="p-3 text-gray-700">{r.building_name}</td>
                <td className="p-3 text-gray-700">{r.floor}</td>
                <td className="p-3 text-gray-700">{r.capacity} persons</td>
                <td className="p-3">{genderBadge(r.gender)}</td>
                <td className="p-3 text-gray-700">{r.price}VND/month</td>
                <td className="p-3">{statusBadge(r.status)}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <Link
                    to={`/rooms/${r.id}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/rooms/edit/${r.id}`}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-4 text-center text-gray-500 text-sm"
                >
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Total amount of booked rooms
        </h2>

        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-3 text-gray-600 font-medium text-xs uppercase tracking-wide">
                Booked rooms
              </th>
              <th className="p-3 text-gray-600 font-medium text-xs uppercase tracking-wide">
                Total price (per month)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-gray-800 font-semibold">
                {totalBookedRooms}
              </td>
              <td className="p-4 text-blue-700 font-semibold">
                {formatCurrency(totalBookedAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
