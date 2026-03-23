import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  deleteUser,
  fetchUserRoles,
  fetchUniversities,
} from "../services/user.service";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";

const ROLE_BADGE = (role) =>
  role?.toLowerCase() === "admin"
    ? "bg-purple-100 text-purple-700"
    : role?.toLowerCase() === "manager"
    ? "bg-blue-100 text-blue-700"
    : "bg-gray-100 text-gray-700";

export default function Users() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [roleId, setRoleId] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useMemo(
    () => ({
      q: q || undefined,
      roleId: roleId || undefined,
      universityId: universityId || undefined,
      page,
      limit: 10,
    }),
    [q, roleId, universityId, page]
  );

  useEffect(() => {
    (async () => {
      setRoles(await fetchUserRoles());
      setUnis(await fetchUniversities());
    })();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchUsers(params);
      setItems(data.items);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [roleId, universityId, page]);

  async function onDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    await deleteUser(id);
    load();
  }

  const avatar = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-500">
          </p>
        </div>
        <Link
          to="/users/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus size={16} /> Add User
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center border rounded-lg px-3 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="w-full py-2 px-2 text-sm outline-none"
            placeholder="Search users..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={roleId}
          onChange={(e) => {
            setRoleId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.ten_vai_tro}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={universityId}
          onChange={(e) => {
            setUniversityId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Universities</option>
          {unis.map((u) => (
            <option key={u.id} value={u.id}>
              {u.ten_truong}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">USER</th>
              <th className="px-4 py-3 text-left">ROLE</th>
              <th className="px-4 py-3 text-left">UNIVERSITY</th>
              <th className="px-4 py-3 text-left">CONTACT</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {avatar(u.ho_ten)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {u.ho_ten}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${ROLE_BADGE(
                        u.ten_vai_tro
                      )}`}
                    >
                      {u.ten_vai_tro || "USER"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.ten_truong || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">
                      {u.so_dien_thoai || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {u.dia_chi || ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/users/${u.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/users/edit/${u.id}`}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(u.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
