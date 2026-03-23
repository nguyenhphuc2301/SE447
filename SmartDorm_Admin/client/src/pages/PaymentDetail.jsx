import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPayment } from "../services/payment.service";
import { ArrowLeft } from "lucide-react";

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPayment(id);
        setItem(data);
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu thanh toán");
      }
    })();
  }, [id]);

  if (!item) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-600 mb-4 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Payment Detail</h1>

      <div className="bg-white rounded-2xl shadow p-4 space-y-2 text-sm">
        <div>
          <span className="font-medium">ID: </span>
          {item.id}
        </div>
        <div>
          <span className="font-medium">Booking ID: </span>
          {item.dat_phong_id}
        </div>
        <div>
          <span className="font-medium">Student: </span>
          {item.ten_sinh_vien} ({item.email})
        </div>
        <div>
          <span className="font-medium">Room: </span>
          {item.so_phong} – {item.ten_toa}
        </div>
        <div>
          <span className="font-medium">Amount: </span>
          {item.so_tien}
        </div>
        <div>
          <span className="font-medium">Method: </span>
          {item.phuong_thuc}
        </div>
        <div>
          <span className="font-medium">Status: </span>
          {item.trang_thai}
        </div>
        <div>
          <span className="font-medium">Paid at: </span>
          {item.ngay_thanh_toan}
        </div>
      </div>
    </div>
  );
}
