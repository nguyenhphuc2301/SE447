import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBooking, payDeposit } from "../services/booking.service";
import { FaCheckCircle } from "react-icons/fa";

const BANK_INFO = {
  bank: "Vietcombank",
  accountNumber: "1234567890",
  accountName: "CONG TY SMARTDORM",
};

const MOMO_QR = "/images/momo-qr.jpg";

const fmtVND = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
  " VND";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt)) return d;
  return dt.toLocaleDateString("vi-VN");
};

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("bank");
  const [bk, setBk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBooking(id);
        if (mounted) {
          setBk(data);
          setErr("");
        }
      } catch (e) {
        if (mounted) setErr(e.message || "Không lấy được dữ liệu thanh toán");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  const calc = useMemo(() => {
    const price = Number(bk?.gia_tien || 0);
    const months = Number(bk?.thoi_gian_cu_tru || 0);
    const deposit = price;
    const total = deposit + price * months;
    return { price, months, deposit, total };
  }, [bk]);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await payDeposit(id);
      navigate(`/booking/complete/${id}`);
    } catch (e) {
      alert(e.message || "Xác nhận thanh toán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F6F7FB] min-h-screen pb-20">

      <div className="pt-10 px-8 text-center">
        <h1 className="text-[32px] font-bold text-gray-900">
          Đặt phòng ký túc xá
        </h1>
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
              { no: 1, label: "Xác nhận thông tin", done: true },
              { no: 2, label: "Thanh toán", active: true },
              { no: 3, label: "Hoàn tất đặt phòng" },
            ].map((s) => (
              <div key={s.no} className="flex flex-col items-center">
                <div
                  className={[
                    "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-[15px]",
                    s.active
                      ? "bg-[#2563EB] text-white"
                      : s.done
                      ? "bg-[#E6F0FF] text-[#2563EB] border-[3px] border-[#2563EB]"
                      : "bg-white text-gray-500 border-[3px] border-gray-200",
                  ].join(" ")}
                >
                  {s.done ? <FaCheckCircle /> : s.no}
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
      <div className="max-w-[1200px] mx-auto mt-8 px-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-7 py-4 bg-white border-b">
            <div className="text-[18px] font-semibold text-gray-900">
              Phương thức thanh toán
            </div>
          </div>

          <div className="p-7">
            {loading ? (
              <div className="text-[15px] text-gray-500">Đang tải…</div>
            ) : err ? (
              <div className="text-[15px] text-red-600">{err}</div>
            ) : (
              <>
                {/* MoMo */}
                <label className="flex flex-col gap-3 p-4 border rounded-[12px] mb-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymethod"
                      checked={method === "momo"}
                      onChange={() => setMethod("momo")}
                    />
                    <div>
                      <div className="font-medium">Thanh toán qua ví MoMo</div>
                      <div className="text-[13px] text-gray-500">
                        Quét mã QR để thanh toán nhanh chóng
                      </div>
                    </div>
                  </div>

                  {method === "momo" && (
                    <div className="mt-2 border rounded-[12px] p-4 bg-[#FFF5F8]">
                      <div className="text-[14px] text-gray-700 mb-2">
                        Quét mã QR MoMo để thanh toán:
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={MOMO_QR}
                          alt="MoMo QR"
                          className="w-40 h-40 object-contain rounded"
                        />
                        <div className="text-sm text-gray-700">
                          <p>
                            <b>Số tiền:</b> {fmtVND(calc.deposit)}
                          </p>
                          <p>
                            <b>Nội dung:</b> {bk?.nguoi_dat || "Nguoi dat"}
                          </p>
                          <p className="text-gray-500 mt-2">
                            Sau khi thanh toán thành công, bấm “Xác nhận thanh
                            toán”.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Bank transfer */}
                <label className="block p-4 border rounded-[12px] cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymethod"
                      checked={method === "bank"}
                      onChange={() => setMethod("bank")}
                    />
                    <div>
                      <div className="font-medium">Chuyển khoản ngân hàng</div>
                      <div className="text-[13px] text-gray-500">
                        Chuyển khoản trực tiếp đến tài khoản của chúng tôi
                      </div>
                    </div>
                  </div>

                  {method === "bank" && (
                    <div className="mt-4 border rounded-[12px] p-4 bg-[#F8FBFF]">
                      <div className="text-[14px] text-gray-700 mb-2">
                        Thông tin chuyển khoản:
                      </div>
                      <ul className="text-[14px] text-gray-800 space-y-1">
                        <li>Ngân hàng: {BANK_INFO.bank}</li>
                        <li>Số tài khoản: {BANK_INFO.accountNumber}</li>
                        <li>Chủ tài khoản: {BANK_INFO.accountName}</li>
                        <li>
                          Nội dung chuyển khoản:{" "}
                          <b>{bk?.nguoi_dat || "Ten nguoi dat"}</b>
                        </li>
                      </ul>
                      <p className="text-[12px] text-gray-500 mt-3">
                        Sau khi chuyển khoản thành công, vui lòng chọn “Xác nhận
                        thanh toán” để hoàn tất đặt phòng.
                      </p>
                    </div>
                  )}
                </label>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full h-[48px] rounded-[12px] bg-[#2563EB] hover:bg-[#1d4fce] text-white font-semibold text-[15px] mt-6 disabled:opacity-60"
                >
                  {submitting ? "Đang xác nhận…" : "Xác nhận thanh toán"}
                </button>

                <p className="text-[12.5px] text-gray-500 mt-2">
                  Bằng cách nhấn nút xác nhận, bạn đồng ý với các điều khoản và
                  điều kiện của chúng tôi.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-7 py-4 bg-white border-b">
            <div className="text-[18px] font-semibold text-gray-900">
              Tóm tắt thanh toán
            </div>
          </div>

          <div className="p-7 text-[14.5px]">
            {loading ? (
              <div className="text-gray-500">Đang tải…</div>
            ) : err ? (
              <div className="text-red-600">{err}</div>
            ) : (
              <>
                <Row label="Ký túc xá" value={bk?.ten_toa || "—"} />
                <Row
                  label="Loại phòng"
                  value={`Phòng ${bk?.so_nguoi || 4} người (Standard)`}
                />
                <Row label="Địa chỉ" value={bk?.dia_chi || "—"} divider />
                <Row label="Người đặt" value={bk?.nguoi_dat || "—"} />
                <Row
                  label="Ngày nhận phòng"
                  value={fmtDate(bk?.ngay_nhan_phong)}
                />
                <Row label="Thời hạn" value={`${calc.months} tháng`} divider />
                <Row label="Giá phòng/tháng" value={fmtVND(calc.price)} />
                <Row label="Tiền đặt cọc" value={fmtVND(calc.deposit)} />
                <div className="bg-[#F2F6FF] rounded-[12px] px-5 py-4 mt-5">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-gray-800">
                      Tổng thanh toán
                    </div>
                    <div className="text-[#2563EB] font-bold text-[16px]">
                      {fmtVND(calc.total)}
                    </div>
                  </div>
                  <div className="text-[12.5px] text-gray-500 mt-0.5">
                    Bao gồm tiền đặt cọc và tiền phòng {calc.months} tháng
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, divider }) {
  return (
    <>
      <div className="flex items-center justify-between py-1">
        <div className="text-gray-600">{label}</div>
        <div className="font-medium text-right max-w-[60%]">{value}</div>
      </div>
      {divider && <div className="h-px bg-gray-200 my-3" />}
    </>
  );
}
