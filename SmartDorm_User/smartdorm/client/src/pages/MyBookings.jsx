import React, { useEffect, useState } from "react";
import { getMyBookings } from "../services/booking.service";
import { Link } from "react-router-dom";
console.log("MyBookings component mounted");

const statusText = (s) =>
  ({
    cho_duyet: "Chờ duyệt",
    da_duyet: "Đã duyệt",
    da_huy: "Đã hủy",
  }[s] || s);

const statusClass = (s) =>
  ({
    cho_duyet: "bg-yellow-100 text-yellow-700",
    da_duyet: "bg-green-100 text-green-700",
    da_huy: "bg-red-100 text-red-700",
  }[s] || "bg-gray-100 text-gray-700");

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const rs = await getMyBookings();
        setItems(rs || []);
      } catch (e) {
        setErr(e.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Đơn đặt phòng của tôi
            </h1>
            <p className="text-gray-500 mt-1">
              Xem lại các đơn bạn đã đặt trong hệ thống
            </p>
          </div>

          <Link
            to="/dorms"
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
          >
            Tìm KTX
          </Link>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-600">Đang tải...</div>
          ) : err ? (
            <div className="p-6 text-red-600">{err}</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-gray-600">Bạn chưa có đơn nào.</div>
          ) : (
            <div className="divide-y">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-gray-800">
                        {b.ten_toa} • Phòng {b.so_phong} (Tầng {b.tang})
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${statusClass(
                          b.trang_thai
                        )}`}
                      >
                        {statusText(b.trang_thai)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <div>Địa chỉ: {b.dia_chi}</div>
                      <div>
                        Ngày đặt:{" "}
                        <b>{new Date(b.ngay_dat).toLocaleDateString()}</b> •
                        Ngày nhận:{" "}
                        <b>
                          {b.ngay_nhan_phong
                            ? new Date(b.ngay_nhan_phong).toLocaleDateString()
                            : "--"}
                        </b>{" "}
                        • Cư trú: <b>{b.thoi_gian_cu_tru}</b> tháng
                      </div>
                      <div>
                        Giá: <b>{Number(b.gia_tien).toLocaleString()} đ</b>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/dorms/${b.phong_id}`}
                      className="px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm"
                    >
                      Xem phòng
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
