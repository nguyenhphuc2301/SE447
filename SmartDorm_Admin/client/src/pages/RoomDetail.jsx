import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchRoom } from "../services/room.service";
import { ArrowLeft } from "lucide-react";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRoom(id);
        setRoom(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!room) return <div className="p-8 text-gray-500">Loading data...</div>;

  // Status text mapping
  const getStatusText = (status) => {
    switch (status) {
      case "con_trong":
        return "Available";
      case "da_dat":
        return "Occupied";
      case "dang_bao_tri":
        return "Maintenance";
      case "co_van_de":
        return "Issue";
      default:
        return "Unknown";
    }
  };

  // Status color mapping
  const getStatusClass = (status) => {
    switch (status) {
      case "con_trong":
        return "text-green-600";
      case "da_dat":
        return "text-blue-600";
      case "dang_bao_tri":
        return "text-yellow-600";
      case "co_van_de":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Gender text mapping 
  const getGenderText = (gender) => {
    switch (gender) {
      case "nam":
        return "Male";
      case "nu":
        return "Female";
      case "khac":
        return "Any";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white border rounded-2xl shadow-sm p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Room Details — {room.so_phong}
          </h1>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Building</h2>
            <p className="text-gray-800 font-semibold">{room.building_name}</p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Floor</h2>
            <p className="text-gray-800 font-semibold">{room.tang}</p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Capacity</h2>
            <p className="text-gray-800 font-semibold">{room.suc_chua} persons</p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Currently Occupied</h2>
            <p className="text-gray-800 font-semibold">{room.so_nguoi_dang_o} persons</p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Gender</h2>
            <p className="text-gray-800 font-semibold">{getGenderText(room.gioi_tinh)}</p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Price (Per Month)</h2>
            <p className="text-gray-800 font-semibold">
              {room.gia_tien?.toLocaleString()} VND
            </p>
          </div>

          <div>
            <h2 className="text-gray-600 text-sm font-medium mb-1">Status</h2>
            <p className={`font-semibold ${getStatusClass(room.trang_thai)}`}>
              {getStatusText(room.trang_thai)}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            to={`/rooms/edit/${room.id}`}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
          >
            Edit
          </Link>
          <Link
            to="/rooms"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Back to list
          </Link>
        </div>

      </div>
    </div>
  );
}
