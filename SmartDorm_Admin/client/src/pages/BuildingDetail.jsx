import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function BuildingDetail() {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/buildings/${id}`
        );
        setBuilding(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!building) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <Link to="/buildings" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-6">
          <img
            src={
              building.anh_toa_nha
                ? `http://localhost:4000${
                    building.anh_toa_nha.startsWith("/")
                      ? building.anh_toa_nha
                      : "/uploads/" + building.anh_toa_nha
                  }`
                : "https://via.placeholder.com/400x250?text=No+Image"
            }
            alt={building.ten_toa}
            className="w-[400px] h-[250px] object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-2">{building.ten_toa}</h2>
            <p className="text-gray-600">{building.dia_chi}</p>
            <p className="mt-2 text-sm text-gray-500">
              {building.mo_ta || "Không có mô tả."}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-gray-600">Floors</p>
                <p className="font-semibold text-blue-600">
                  {building.so_tang}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-gray-600">Rooms</p>
                <p className="font-semibold text-blue-600">
                  {building.total_rooms}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-gray-600">Available</p>
                <p className="font-semibold text-green-600">
                  {building.available}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-center mb-3">
            Building Overview
          </h3>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            {building.mo_ta || "No description available."}
          </p>
          <p className="text-center text-gray-500 mt-4">
            Located at {building.dia_chi}, this building provides easy access
            and modern facilities.
          </p>
          <div className="text-center mt-4">
            <h4 className="font-medium mb-2">Facilities</h4>
            <ul className="text-gray-600 space-y-1">
              <li>WiFi throughout the building</li>
              <li>Laundry facilities</li>
              <li>Study rooms on each floor</li>
              <li>Community kitchens</li>
              <li>24/7 security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
