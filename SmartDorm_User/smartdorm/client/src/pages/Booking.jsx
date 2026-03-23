import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDormById } from "../services/dorm.service";
import { createBooking } from "../services/booking.service";
import { getUser } from "../services/authService";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const currency = (v) =>
  (Number(v) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [errRoom, setErrRoom] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    truong_dai_hoc: "",
    ngay_nhan_phong: "",
    thoi_gian_cu_tru: 6,
  });

  useEffect(() => {
    const u = getUser();
    if (u?.email) {
      setForm((p) => ({
        ...p,
        email: u.email,
        ho_ten: p.ho_ten || u.ho_ten || "",
      }));
    }
  }, []);

  // Load room
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingRoom(true);
        const data = await getDormById(id);
        if (mounted) {
          setRoom(data);
          setErrRoom("");
        }
      } catch (e) {
        if (mounted) setErrRoom(e.message || "Không lấy được phòng");
      } finally {
        if (mounted) setLoadingRoom(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  const calc = useMemo(() => {
    const price = Number(room?.price || room?.gia_tien || 0);
    const months = Number(form.thoi_gian_cu_tru || 0);
    const deposit = price;
    const total = deposit + price * months;
    return { price, months, deposit, total };
  }, [room, form.thoi_gian_cu_tru]);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(form.email)) {
      alert("Email không hợp lệ");
      return;
    }

    if (!form.ngay_nhan_phong) {
      alert("Vui lòng chọn ngày nhận phòng");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ho_ten: form.ho_ten,
        email: form.email,
        so_dien_thoai: form.so_dien_thoai,
        truong_dai_hoc_id: form.truong_dai_hoc || null, 
        phong_id: id,
        ngay_nhan_phong: form.ngay_nhan_phong,
        thoi_gian_cu_tru: Number(form.thoi_gian_cu_tru),
      };

      const res = await createBooking(payload);

      const bookingId =
        res?.dat_phong_id ||
        res?.data?.dat_phong_id ||
        res?.id ||
        res?.bookingId;

      if (!bookingId) {
        console.log("Response createBooking:", res);
        alert("Không nhận được mã đơn đặt phòng từ server");
        return;
      }

      navigate(`/payment/${encodeURIComponent(bookingId)}`);
    } catch (err) {
      alert(err?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F6F7FB] min-h-screen pb-20">
      {/* Title */}
      <div className="pt-10 px-8 text-center">
        <h1 className="text-[32px] font-bold text-gray-900">
          Đặt phòng ký túc xá
        </h1>
        <p className="text-[15px] text-gray-500 mt-2">
          Chỉ vài bước đơn giản để đặt phòng ký túc xá mong muốn
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-[1200px] 2xl:max-w-[1320px] mx-auto mt-8 px-8">
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 px-10 py-7 relative">
          <div className="absolute left-0 right-0 top-[64px] mx-10 border-t-[4px] border-gray-200" />
          <div className="grid grid-cols-3 text-center relative z-[1]">
            {[
              { no: 1, label: "Xác nhận thông tin", active: true },
              { no: 2, label: "Thanh toán" },
              { no: 3, label: "Hoàn tất đặt phòng" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={[
                    "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-[15px]",
                    s.active
                      ? "bg-[#2563EB] text-white"
                      : "bg-white text-gray-500 border-[3px] border-gray-200",
                  ].join(" ")}
                >
                  {s.no}
                </div>
                <div
                  className={[
                    "mt-3 text-[14px]",
                    s.active ? "text-[#2563EB] font-medium" : "text-gray-500",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1200px] 2xl:max-w-[1320px] mx-auto mt-10 px-8 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 items-start">
        {/* Form Card */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#1F54D6] text-white px-7 py-4">
            <div className="text-[17px] font-semibold">Thông tin cá nhân</div>
            <div className="text-[13px] opacity-90">
              Vui lòng điền đầy đủ thông tin để tiếp tục đặt phòng
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                icon={<FaUser />}
                placeholder="Nguyễn Văn A"
                label="Họ và tên"
                name="ho_ten"
                value={form.ho_ten}
                onChange={onChange}
                required
                big
              />
              <Field
                icon={<FaEnvelope />}
                placeholder="example@gmail.com"
                label="Email (đúng email đang đăng nhập)"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                big
                disabled
              />

              <Field
                icon={<FaPhone />}
                placeholder="0123456789"
                label="Số điện thoại"
                name="so_dien_thoai"
                value={form.so_dien_thoai}
                onChange={onChange}
                required
                big
              />

              <Field
                icon={<FaUniversity />}
                placeholder="Đại học Bách Khoa Đà Nẵng (hoặc ID)"
                label="Trường Đại học"
                name="truong_dai_hoc"
                value={form.truong_dai_hoc}
                onChange={onChange}
                big
              />

              <Field
                icon={<FaCalendarAlt />}
                label="Ngày nhận phòng"
                name="ngay_nhan_phong"
                type="date"
                value={form.ngay_nhan_phong}
                onChange={onChange}
                required
                big
              />

              <div>
                <label className="text-[14px] text-gray-700 mb-1.5 block">
                  Thời hạn (tháng)
                </label>
                <select
                  name="thoi_gian_cu_tru"
                  value={form.thoi_gian_cu_tru}
                  onChange={onChange}
                  className="w-full h-[48px] rounded-[10px] border border-gray-300 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                >
                  {[3, 6, 9, 12].map((m) => (
                    <option key={m} value={m}>
                      {m} tháng
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={[
                "mt-7 w-full h-[48px] rounded-[12px] text-white font-semibold text-[15px] transition-colors",
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2563EB] hover:bg-[#1d4fce]",
              ].join(" ")}
            >
              {submitting ? "Đang tạo đơn..." : "Tiếp tục đến thanh toán →"}
            </button>
          </form>
        </div>

        {/* Room Card */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#1F54D6] text-white px-7 py-4">
            <div className="text-[17px] font-semibold">Thông tin đặt phòng</div>
            <div className="text-[13px] opacity-90">
              Chi tiết về phòng bạn sắp đặt
            </div>
          </div>

          <div className="p-7">
            {loadingRoom ? (
              <div className="text-[15px] text-gray-500">Đang tải...</div>
            ) : errRoom ? (
              <div className="text-[15px] text-red-600">{errRoom}</div>
            ) : room ? (
              <>
                {room.images?.[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.name || "room"}
                    className="w-full h-[200px] object-cover rounded-[12px]"
                  />
                )}

                <div className="mt-4">
                  <div className="text-[14.5px] font-semibold">
                    {room.name || "KTX - Phòng"}
                  </div>
                  <div className="text-[12.5px] text-gray-500">
                    Phòng {room.capacity || room.suc_chua || 6} người
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-[14px] text-gray-700">
                  <FaMapMarkerAlt className="mt-[3px] text-[#2563EB]" />
                  <div>{room.address || room.dia_chi || "Địa chỉ đang cập nhật"}</div>
                </div>

                <div className="h-px bg-gray-200 my-5" />

                <div className="grid grid-cols-2 gap-y-3 text-[14.5px]">
                  <div className="text-gray-600">Giá phòng/tháng</div>
                  <div className="text-right font-medium">{currency(calc.price)}</div>
                  <div className="text-gray-600">Tiền đặt cọc</div>
                  <div className="text-right font-medium">{currency(calc.deposit)}</div>
                  <div className="text-gray-600">Thời hạn</div>
                  <div className="text-right font-medium">{calc.months} tháng</div>
                </div>

                <div className="bg-[#F2F6FF] rounded-[12px] px-5 py-4 mt-5">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-gray-800">
                      Tổng thanh toán
                    </div>
                    <div className="text-[#2563EB] font-bold text-[16px]">
                      {currency(calc.total)}
                    </div>
                  </div>
                  <div className="text-[12.5px] text-gray-500 mt-0.5">
                    Bao gồm tiền đặt cọc và tiền phòng {calc.months} tháng
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[15px] text-gray-500">Không có dữ liệu phòng</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, big, disabled, ...props }) {
  return (
    <div>
      <label className="text-[14px] text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]">
          {icon}
        </div>
        <input
          {...props}
          disabled={disabled}
          className={[
            "w-full",
            big ? "h-[48px]" : "h-[42px]",
            "rounded-[10px] border border-gray-300 pl-10 pr-3 text-[15px]",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30",
            disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
