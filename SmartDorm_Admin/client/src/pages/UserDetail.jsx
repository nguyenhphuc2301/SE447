import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchUser } from "../services/user.service";
import { ArrowLeft } from "lucide-react";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [u, setU] = useState(null);

  useEffect(() => {
    (async () => setU(await fetchUser(id)))();
  }, [id]);

  if (!u) return <div className="p-6 text-gray-500">Loading...</div>;

  const avatar = (s) => s?.charAt(0)?.toUpperCase() || "?";

  const genderText = {
    nam: "Male",
    nu: "Female",
    khac: "Other",
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

          <h1 className="text-xl font-semibold text-gray-800">
            User Information
          </h1>

          <Link
            to={`/users/edit/${u.id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </Link>
        </div>

        {/* Avatar + Basic Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
            {avatar(u.ho_ten)}
          </div>
          <div>
            <div className="text-lg font-semibold">{u.ho_ten}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-gray-500 uppercase">Phone Number</div>
            <div className="font-medium">{u.so_dien_thoai || "-"}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">Gender</div>
            <div className="font-medium">
              {genderText[u.gioi_tinh] || "Unknown"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">Role</div>
            <div className="font-medium">{u.ten_vai_tro || "User"}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">University</div>
            <div className="font-medium">{u.ten_truong || "-"}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase">National ID</div>
            <div className="font-medium">{u.can_cuoc || "-"}</div>
          </div>

          <div className="col-span-2">
            <div className="text-xs text-gray-500 uppercase">Address</div>
            <div className="font-medium">{u.dia_chi || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
