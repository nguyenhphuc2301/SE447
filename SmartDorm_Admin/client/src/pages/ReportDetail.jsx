import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReport } from "../services/report.service";
import { ArrowLeft } from "lucide-react";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [r, setR] = useState(null);

  useEffect(() => {
    (async () => setR(await fetchReport(id)))();
  }, [id]);

  if (!r) return <div className="p-6 text-gray-500">Loading...</div>;

  const head = r.noi_dung?.split("\n")[0] || "";
  const body = r.noi_dung?.split("\n").slice(1).join("\n");

  const statusKey =
    r.trang_thai === "da_xu_ly"
      ? "resolved"
      : r.trang_thai === "dang_xu_ly"
      ? "in_progress"
      : "unresolved";

  const statusMap = {
    unresolved: {
      label: "Unresolved",
      cls: "bg-red-100 text-red-700",
    },
    in_progress: {
      label: "In Progress",
      cls: "bg-yellow-100 text-yellow-700",
    },
    resolved: {
      label: "Resolved",
      cls: "bg-green-100 text-green-700",
    },
  };

  const statusInfo = statusMap[statusKey] || {
    label: "Unknown",
    cls: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white border rounded-2xl shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-xl font-semibold">Report Details</h1>
          <div />
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <div className="text-xs text-gray-500 uppercase">Title</div>
            <div className="font-semibold">{head}</div>
          </div>

          {/* Description */}
          <div>
            <div className="text-xs text-gray-500 uppercase">Description</div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {body || "-"}
            </pre>
          </div>

          {/* Other info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Room / Building */}
            <div>
              <div className="text-xs text-gray-500 uppercase">
                Room / Building
              </div>
              <div className="font-medium">
                {`Room ${r.so_phong} — ${r.ten_toa}`}
              </div>
            </div>

            {/* Reporter */}
            <div>
              <div className="text-xs text-gray-500 uppercase">Reporter</div>
              <div className="font-medium">{r.ten_sinh_vien}</div>
              <div className="text-xs text-gray-500">
                {r.email} • {r.so_dien_thoai || "-"}
              </div>
            </div>

            {/* Reported At */}
            <div>
              <div className="text-xs text-gray-500 uppercase">
                Reported At
              </div>
              <div className="font-medium">
                {r.ngay_bao_cao
                  ? new Date(r.ngay_bao_cao).toLocaleString()
                  : "-"}
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="text-xs text-gray-500 uppercase">Status</div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusInfo.cls}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
