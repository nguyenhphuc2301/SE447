import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { getToken } from "../services/authService"; 

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const BOOKING_STATUS_LABEL = {
  cho_duyet: "Chờ duyệt",
  da_duyet: "Đã xác nhận",
  da_huy: "Đã hủy",
};

const PAY_METHOD_LABEL = {
  chuyen_khoan: "Chuyển khoản ngân hàng",
  momo: "Ví MoMo",
};

const fmtVND = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt)) return d;
  return dt.toLocaleDateString("vi-VN");
};

const addMonths = (dateStr, months) => {
  if (!dateStr) return "";
  const dt = new Date(dateStr);
  dt.setMonth(dt.getMonth() + Number(months || 0));
  return dt.toLocaleDateString("vi-VN");
};

async function readSafe(res) {
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {}
  return { data, raw };
}

export default function BookingComplete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rcp, setRcp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const token = getToken();
        if (!token) {
          setErr("Bạn chưa đăng nhập");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/bookings/${id}/receipt`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        const { data, raw } = await readSafe(res);

        if (res.status === 401) {
          if (mounted) {
            setErr("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            setLoading(false);
            // đá về login sau 500ms cho user đọc
            setTimeout(() => navigate("/login", { replace: true }), 500);
          }
          return;
        }

        if (!res.ok || data?.ok === false) {
          throw new Error(data?.message || raw || "Không lấy được biên nhận.");
        }

        if (mounted) {
          setRcp(data?.data || null);
        }
      } catch (e) {
        if (mounted) setErr(e.message || "Không lấy được dữ liệu.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [id, navigate]);

  const endDate = useMemo(
    () => addMonths(rcp?.ngay_nhan_phong, rcp?.thoi_gian_cu_tru),
    [rcp?.ngay_nhan_phong, rcp?.thoi_gian_cu_tru]
  );

  return (
    <div className="bg-[#F6F7FB] min-h-screen pb-20">
      <div className="pt-10 px-8 text-center">
        <h1 className="text-[32px] font-bold text-gray-900">Đặt phòng ký túc xá</h1>
        <p className="text-[15px] text-gray-500 mt-2">
          Chỉ vài bước đơn giản để đặt phòng ký túc xá mong muốn
        </p>
      </div>

      {/* Stepper */}
      <div className="max-w-[1200px] mx-auto mt-8 px-8">
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 px-10 py-7 relative">
          <div className="absolute left-0 right-0 top-[64px] mx-10 border-t-[4px] border-[#2563EB]" />
          <div className="grid grid-cols-3 text-center relative z-[1]">
            {[
              { no: 1, label: "Xác nhận thông tin" },
              { no: 2, label: "Thanh toán" },
              { no: 3, label: "Hoàn tất đặt phòng", active: true },
            ].map((s) => (
              <div key={s.no} className="flex flex-col items-center">
                <div
                  className={[
                    "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-[15px]",
                    s.active
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#E6F0FF] text-[#2563EB] border-[3px] border-[#2563EB]",
                  ].join(" ")}
                >
                  <FaCheckCircle />
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

      {/* Success box */}
      <div className="max-w-[1200px] mx-auto mt-8 px-8">
        <div className="bg-green-50 text-green-700 rounded-[12px] border border-green-200 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold">
            <FaCheckCircle /> Đặt phòng thành công!
          </div>
          <div className="text-[14px] mt-2">
            Cảm ơn bạn đã đặt phòng tại ký túc xá của chúng tôi. Thông tin chi
            tiết về đặt phòng đã được gửi đến email của bạn.
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-[1200px] mx-auto mt-6 px-8">
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100">
          <div className="px-7 py-4 bg-[#F6FAFF] border-b rounded-t-[12px] flex items-center justify-between">
            <div className="text-[16px] font-semibold text-gray-900">
              Chi tiết đặt phòng
            </div>
            {!!rcp?.ref && (
              <div className="text-[13px] text-gray-500">
                Mã đặt phòng: <span className="font-semibold">{rcp.ref}</span>
              </div>
            )}
          </div>

          <div className="p-7">
            {loading ? (
              <div className="text-[15px] text-gray-500">Đang tải…</div>
            ) : err ? (
              <div className="text-[15px] text-red-600">{err}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left */}
                <div className="space-y-6">
                  <Section title="Thông tin ký túc xá">
                    <Row label="Tên ký túc xá" value={rcp?.ten_toa || "—"} />
                    <Row
                      label="Loại phòng"
                      value={`Phòng ${rcp?.so_nguoi || 6} người (Standard)`}
                    />
                    <Row label="Địa chỉ" value={rcp?.dia_chi || "—"} />
                  </Section>

                  <Section title="Chi tiết thuê phòng">
                    <Row label="Ngày nhận phòng" value={fmtDate(rcp?.ngay_nhan_phong)} />
                    <Row label="Thời hạn" value={`${rcp?.thoi_gian_cu_tru || 0} tháng`} />
                    <Row label="Ngày hết hạn" value={endDate} />
                    <Row
                      label="Trạng thái đặt phòng"
                      value={
                        BOOKING_STATUS_LABEL[rcp?.trang_thai_dat_phong] ||
                        rcp?.trang_thai_dat_phong ||
                        "—"
                      }
                    />
                  </Section>
                </div>

                {/* Right */}
                <div className="space-y-6">
                  <Section title="Thông tin người thuê">
                    <Row label="Họ và tên" value={rcp?.nguoi_dat || "—"} />
                    <Row label="Email" value={rcp?.email || "—"} />
                    <Row label="Số điện thoại" value={rcp?.so_dien_thoai || "—"} />
                    <Row label="Trường đại học" value={rcp?.truong_dai_hoc || "—"} />
                  </Section>

                  <Section title="Thông tin thanh toán">
                    <Row
                      label="Phương thức thanh toán"
                      value={PAY_METHOD_LABEL[rcp?.phuong_thuc] || rcp?.phuong_thuc || "—"}
                    />
                    <Row label="Ngày thanh toán" value={fmtDate(rcp?.ngay_thanh_toan)} />
                    <Row
                      label="Trạng thái (thanh toán)"
                      value={
                        rcp?.trang_thai
                          ? rcp.trang_thai === "da_thanh_toan"
                            ? "Thành công"
                            : rcp.trang_thai
                          : "—"
                      }
                    />
                    <Row label="Số tiền" value={fmtVND(rcp?.so_tien)} />
                  </Section>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-end mt-6">
          <Link
            to="/dorms"
            className="px-5 h-[42px] rounded-[10px] border border-gray-300 bg-white text-gray-700 flex items-center hover:bg-gray-50"
          >
            Xem thêm ký túc xá khác
          </Link>
          <button
            onClick={() => navigate("/")}
            className="px-5 h-[42px] rounded-[10px] bg-[#2563EB] text-white hover:bg-[#1d4fce]"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[15px] font-semibold text-gray-800 mb-3">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between py-1">
      <div className="text-gray-600">{label}</div>
      <div className="font-medium text-right max-w-[60%]">{value}</div>
    </div>
  );
}
