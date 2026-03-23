import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBooking } from "../services/booking.service";
import { ArrowLeft } from "lucide-react";

const StatusPill = ({ value }) => {
  const map = {
    da_duyet: "bg-green-100 text-green-700",
    cho_duyet: "bg-yellow-100 text-yellow-700",
    da_huy: "bg-red-100 text-red-700",
  };
  const label = {
    da_duyet: "Approved",
    cho_duyet: "Pending",
    da_huy: "Rejected",
  };

  const cls = map[value] || "bg-gray-100 text-gray-700";
  const text = label[value] || "Unknown";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bk, setBk] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchBooking(id);
      setBk(data);
    })();
  }, [id]);

  if (!bk) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-xl font-semibold text-gray-800">
          Booking Details
        </h1>

        <Link
          to={`/bookings/edit/${bk.id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </Link>
      </div>

      {/* Content */}
      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Booking ID */}
          <div>
            <div className="text-xs text-gray-500">Booking ID</div>
            <div className="font-medium">#{bk.id.slice(0, 8)}</div>
          </div>

          {/* Status */}
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <StatusPill value={bk.trang_thai} />
          </div>

          {/* Student */}
          <div>
            <div className="text-xs text-gray-500">Student</div>
            <div className="font-medium">{bk.ho_ten}</div>
            <div className="text-xs text-gray-500">{bk.email}</div>
          </div>

          {/* Room */}
          <div>
            <div className="text-xs text-gray-500">Room</div>
            <div className="font-medium">
              {bk.so_phong} – {bk.ten_toa}
            </div>
          </div>

          {/* Booking Date */}
          <div>
            <div className="text-xs text-gray-500">Booking Date</div>
            <div className="font-medium">
              {bk.ngay_dat ? new Date(bk.ngay_dat).toLocaleDateString() : "-"}
            </div>
          </div>

          {/* Check-in */}
          <div>
            <div className="text-xs text-gray-500">Check-in</div>
            <div className="font-medium">
              {bk.ngay_nhan_phong
                ? new Date(bk.ngay_nhan_phong).toLocaleDateString()
                : "-"}
            </div>
          </div>

          {/* Check-out */}
          <div>
            <div className="text-xs text-gray-500">Check-out</div>
            <div className="font-medium">
              {bk.ngay_tra_phong
                ? new Date(bk.ngay_tra_phong).toLocaleDateString()
                : "-"}
            </div>
          </div>

          {/* Duration of Stay */}
          <div>
            <div className="text-xs text-gray-500">Duration of Stay</div>
            <div className="font-medium">
              {bk.thoi_gian_cu_tru ?? 0} months
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
