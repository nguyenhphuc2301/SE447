import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../services/DBBD.service";
import {
  Building2,
  Bed,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchDashboard();
        setData(res);
      } catch (e) {
        console.error("Lỗi tải dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;
  if (!data)
    return <div className="p-6 text-red-500">Không thể tải dữ liệu.</div>;

  const {
    totalBuildings,
    availableRooms,
    totalRooms,
    occupancyRate,
    pendingBookings,
    maintenanceReports,
    roomStatus,
    recentBookings,
  } = data;

  const occupancyText = `${occupancyRate ?? 0}% occupancy`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          color="blue"
          title="Total Buildings"
          value={totalBuildings}
          sub="+2 new"
          Icon={Building2}
        />
        <KpiCard
          color="green"
          title="Available Rooms"
          value={`${availableRooms} / ${totalRooms} total`}
          progress={(availableRooms / Math.max(1, totalRooms)) * 100}
          Icon={Bed}
        />
        <KpiCard
          color="purple"
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          progress={occupancyRate}
          Icon={Percent}
        />
        <KpiCard
          color="orange"
          title="Pending Bookings"
          value={pendingBookings}
          right={
          <Link
             to="/bookings"
            className="text-orange-600 text-sm font-medium hover:underline"
            >
            Review Requests →
            </Link>
          }
          Icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Reports */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 text-lg">
              Recent Maintenance Reports
            </h2>
            <Link to="/reports" className="text-sky-600 text-sm hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {maintenanceReports?.length ? (
              maintenanceReports.map((r) => <ReportRow key={r.id} r={r} />)
            ) : (
              <p className="text-gray-400 text-sm">Không có báo cáo nào.</p>
            )}
          </div>
        </div>

        {/* Room Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 text-lg">Rooms Status</h2>

            <Link to="/rooms" className="text-sky-600 text-sm hover:underline">
              Manage Rooms
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <RoomBox
              label="Available"
              value={roomStatus.available}
              color="green"
              desc="Ready to book"
            />
            <RoomBox
              label="Occupied"
              value={roomStatus.occupied}
              color="blue"
              desc={occupancyText}
            />
            <RoomBox
              label="Maintenance"
              value={roomStatus.maintenance}
              color="yellow"
              desc="Under repair"
            />
            <RoomBox
              label="Issues"
              value={roomStatus.issues}
              color="red"
              desc="Need attention"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Occupancy Status</p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-sky-600 rounded-full"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-right text-gray-400 mt-1">
              {occupancyRate}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800 text-lg">
            Recent Bookings
          </h2>
          <Link
            to="/bookings"
            className="text-sky-600 text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-2 px-3 font-medium">STUDENT</th>
                <th className="text-left py-2 px-3 font-medium">ROOM</th>
                <th className="text-left py-2 px-3 font-medium">BUILDING</th>
                <th className="text-left py-2 px-3 font-medium">BOOKING DATE</th>
                <th className="text-left py-2 px-3 font-medium">CHECK-IN</th>
                <th className="text-left py-2 px-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                      {(b.student?.name?.[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {b.student?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.student?.email || "noemail@example.com"}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-3">{b.room}</td>
                  <td className="py-2 px-3">{b.building}</td>
                  <td className="py-2 px-3">{b.bookingDate}</td>
                  <td className="py-2 px-3">{b.checkIn}</td>
                  <td className="py-2 px-3">
                    <Badge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ color, title, value, sub, Icon, right, progress }) {
  const colorMap = {
    blue: "bg-blue-500 text-blue-600",
    green: "bg-green-500 text-green-600",
    purple: "bg-purple-500 text-purple-600",
    orange: "bg-orange-500 text-orange-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          colorMap[color].split(" ")[0]
        }`}
      ></div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
          {sub && <p className="text-xs text-green-600 mt-1">{sub}</p>}
          {progress !== undefined && (
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full">
              <div
                className={`${colorMap[color].split(" ")[0]} h-1.5 rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <Icon className={`${colorMap[color].split(" ")[1]}`} size={20} />
        </div>
      </div>
      {right && <div className="mt-2">{right}</div>}
    </div>
  );
}

function ReportRow({ r }) {
  const Icon =
    r.status === "resolved" ? (
      <CheckCircle className="text-green-500 mt-1" size={20} />
    ) : r.status === "in_progress" ? (
      <Wrench className="text-yellow-500 mt-1" size={20} />
    ) : (
      <XCircle className="text-red-500 mt-1" size={20} />
    );

  return (
    <div className="flex items-start justify-between bg-gray-50 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        {Icon}
        <div>
          <p className="text-gray-800 font-medium">{r.title}</p>
          <p className="text-sm text-gray-500">
            Reported on {r.date} — Room {r.room}, Building {r.building}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge status={r.status} />
        <Link
          to={`/reports/edit/${r.id}`}  
          className="text-sky-600 text-sm font-medium hover:underline"
        >
          Respond
        </Link>
      </div>
    </div>
  );
}

function RoomBox({ label, value, color, desc }) {
  const bgMap = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };
  const dot = {
    green: "bg-green-200",
    blue: "bg-blue-200",
    yellow: "bg-yellow-200",
    red: "bg-red-200",
  };
  return (
    <div
      className={`rounded-xl p-4 ${bgMap[color]} flex justify-between items-center`}
    >
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
      <div className={`h-6 w-6 rounded-full ${dot[color]}`}></div>
    </div>
  );
}

function Badge({ status }) {
  const colorMap = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    resolved: "bg-green-100 text-green-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    unresolved: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colorMap[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
