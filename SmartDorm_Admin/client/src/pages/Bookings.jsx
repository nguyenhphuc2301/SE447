import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  fetchBookings,
  fetchBookingBuildings,
  cancelBooking,
} from "../services/booking.service";
import { Eye, Edit, Trash2, Search, Calendar, Plus } from "lucide-react";

const STATUS_STYLE = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [building, setBuilding] = useState("");

  const params = useMemo(
    () => ({ q, status, buildingId: building }),
    [q, status, building]
  );

  async function load() {
    setLoading(true);
    const data = await fetchBookings(params);
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [status, building]);

  useEffect(() => {
    (async () => {
      const b = await fetchBookingBuildings();
      setBuildings(b);
    })();
  }, []);

  async function onCancel(id) {
    if (!confirm("Bạn có chắc muốn huỷ đơn đặt phòng này không?")) return;
    await cancelBooking(id);
    load();
  }

  const avatar = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Bookings</h1>
          <p className="text-sm text-gray-500">
          </p>
        </div>
        <Link
          to="/bookings/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Add Booking
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white border rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center border rounded-lg px-3 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-2 text-sm outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm text-gray-700"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="da_duyet">Approved</option>
          <option value="cho_duyet">Pending</option>
          <option value="da_huy">Rejected</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 text-sm text-gray-700"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        >
          <option value="">All Buildings</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.ten_toa}
            </option>
          ))}
        </select>
        <button className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <Calendar size={14} /> Filter by Date
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">STUDENT</th>
              <th className="px-4 py-3 text-left">ROOM</th>
              <th className="px-4 py-3 text-left">BUILDING</th>
              <th className="px-4 py-3 text-left">CHECK-IN</th>
              <th className="px-4 py-3 text-left">CHECK-OUT</th>
              <th className="px-4 py-3 text-left">STATUS</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading &&
              bookings.map((b, i) => {
                const status =
                  b.trang_thai === "da_duyet"
                    ? "approved"
                    : b.trang_thai === "cho_duyet"
                    ? "pending"
                    : "rejected";
                return (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">#{i + 1}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                        {avatar(b.ten_sinh_vien)}
                      </div>
                      <div>
                        <div className="font-medium">{b.ten_sinh_vien}</div>
                        <div className="text-xs text-gray-500">
                          {b.email_sinh_vien}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{b.so_phong}</td>
                    <td className="px-4 py-3">{b.ten_toa}</td>
                    <td className="px-4 py-3">
                      {new Date(b.ngay_nhan_phong).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(b.ngay_tra_phong).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/bookings/${b.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/bookings/edit/${b.id}`}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onCancel(b.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
