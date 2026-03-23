import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchReports,
  fetchReportBuildings,
  setReportStatus,
  deleteReport,
} from "../services/report.service";
import { Search, Plus, Eye, Edit, Check, RotateCcw } from "lucide-react";

const STATUS_PILL = {
  resolved: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-800",
  unresolved: "bg-red-100 text-red-700",
};

function mapDbStatus(s) {
  return s === "da_xu_ly"
    ? "resolved"
    : s === "dang_xu_ly"
    ? "in_progress"
    : "unresolved";
}

export default function Reports() {
  const [items, setItems] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unresolved: 0,
    in_progress: 0,
    resolved: 0,
  });

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [building, setBuilding] = useState("");

  const params = useMemo(
    () => ({ q, status, buildingId: building }),
    [q, status, building]
  );

  async function load() {
    setLoading(true);
    const { items, counters } = await fetchReports(params);
    setItems(items);
    setStats({
      total: counters.total,
      unresolved: counters.unresolved,
      in_progress: counters.in_progress,
      resolved: counters.resolved,
    });
    setLoading(false);
  }

  useEffect(() => {
    (async () => setBuildings(await fetchReportBuildings()))();
  }, []);
  useEffect(() => {
    load();
  }, [status, building]);

  async function doStatus(id, next) {
    await setReportStatus(id, next);
    load();
  }
  async function onDelete(id) {
    if (!confirm("Xóa báo cáo này?")) return;
    await deleteReport(id);
    load();
  }

  const primary = (s) => s.split("\n")[0]?.trim() || s;
  const secondary = (s) => s.split("\n").slice(1).join(" ").trim();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Maintenance</h1>
          <p className="text-sm text-gray-500">
          </p>
        </div>
        <Link
          to="/reports/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus size={16} /> Create Report
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Tổng số báo cáo */}
        <div className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="fa-solid fa-clipboard-list text-blue-600 text-lg"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">
              Total Reports
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {stats.total}
            </div>
          </div>
        </div>

        {/* Báo cáo chưa xử lý */}
        <div className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-red-600 text-lg"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Unresolved</div>
            <div className="text-2xl font-semibold text-red-600">
              {stats.unresolved}
            </div>
          </div>
        </div>

        {/* Báo cáo đang xử lý */}
        <div className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <i className="fa-solid fa-screwdriver-wrench text-yellow-600 text-lg"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="text-2xl font-semibold text-yellow-600">
              {stats.in_progress}
            </div>
          </div>
        </div>

        {/* Báo cáo đã xử lý */}
        <div className="flex items-center gap-4 bg-white border rounded-xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fa-solid fa-circle-check text-green-600 text-lg"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Resolved</div>
            <div className="text-2xl font-semibold text-green-600">
              {stats.resolved}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center border rounded-lg px-3 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="w-full py-2 px-2 text-sm outline-none"
            placeholder="Search reports..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="unresolved">Unresolved</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
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
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">REPORT</th>
              <th className="px-4 py-3 text-left">TYPE</th>
              <th className="px-4 py-3 text-left">STUDENT</th>
              <th className="px-4 py-3 text-left">ROOM/BUILDING</th>
              <th className="px-4 py-3 text-left">REPORTED</th>
              <th className="px-4 py-3 text-left">STATUS</th>
              <th className="px-4 py-3 text-left">PRIORITY</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading &&
              items.map((r) => {
                const s = mapDbStatus(r.trang_thai);
                return (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{primary(r.noi_dung)}</div>
                      <div className="text-xs text-gray-500">
                        {secondary(r.noi_dung)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                        Maintenance
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {r.ten_sinh_vien?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-medium">{r.ten_sinh_vien}</div>
                          <div className="text-xs text-gray-500">
                            {r.so_dien_thoai || r.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{`Room ${r.so_phong}`}</div>
                      <div className="text-xs text-gray-500">{r.ten_toa}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{new Date(r.ngay_bao_cao).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_PILL[s]}`}
                      >
                        {s}
                      </span>
                    </td>
                    <td className="px-4 py-3">Normal</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          className="text-blue-600 hover:text-blue-800"
                          to={`/reports/${r.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          className="text-yellow-500 hover:text-yellow-600"
                          to={`/reports/edit/${r.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {s !== "resolved" ? (
                          <button
                            className="text-green-600 hover:text-green-700"
                            onClick={() => doStatus(r.id, "resolved")}
                            title="Mark resolved"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="text-gray-600 hover:text-gray-700"
                            onClick={() => doStatus(r.id, "unresolved")}
                            title="Reopen"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onDelete(r.id)}
                          title="Delete"
                        >
                          ✖
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
