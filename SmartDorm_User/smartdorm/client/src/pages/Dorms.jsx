import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchDorms } from "../services/dorm.service";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import { isLoggedIn } from "../services/authService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const vietnamDaNang = [16.0545, 108.2022];

function Badge({ children }) {
  return (
    <span className="inline-block text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded mr-2 mb-2">
      {children}
    </span>
  );
}

function DormCard({ dorm }) {
  const navigate = useNavigate();

  const handleBook = () => {
    const target = `/booking/${encodeURIComponent(dorm.id)}`;
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: target } });
      return;
    }
    navigate(target);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="w-48 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-gray-400 text-xs">
        {dorm.image ? (
          <img
            src={dorm.image}
            alt={dorm.name}
            className="w-full h-full object-cover"
          />
        ) : (
          "Hình ảnh KTX"
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="font-semibold text-lg text-gray-900">
            {dorm.name}
          </span>
          <span className="text-yellow-500 ml-auto">
            ⭐ {dorm.rating?.toFixed(1)}{" "}
            <span className="text-gray-400 text-sm">({dorm.reviews})</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
          <span>📍 {dorm.address}</span>
        </div>

        <p className="mt-2 text-gray-600 text-sm">
          Ký túc xá hiện đại, phù hợp sinh viên. Sức chứa {dorm.capacity} — đang
          ở {dorm.occupied || 0}.
        </p>

        <div className="mt-2">
          {(dorm.amenities || []).slice(0, 4).map((am, idx) => (
            <Badge key={idx}>{am}</Badge>
          ))}
          {dorm.amenities?.length > 4 && (
            <span className="text-xs text-gray-500 ml-1">
              +{dorm.amenities.length - 4} khác
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="text-sm text-gray-500">
            Giá:{" "}
            <b className="text-gray-900">
              {dorm.price?.toLocaleString("vi-VN")}đ/tháng
            </b>
          </div>
          <div className="ml-auto flex gap-2">
            <Link
              to={`/dorms/${dorm.id}`}
              className="px-3 py-2 text-sm rounded border hover:bg-gray-50"
            >
              Chi tiết
            </Link>
            <button
              onClick={handleBook}
              className="px-3 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Đặt Phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarFilters({ filters, setFilters, onApply }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters]);

  function update(k, v) {
    setLocal((s) => ({ ...s, [k]: v, page: 1 }));
  }
  function toggleAmen(name) {
    setLocal((s) => {
      const set = new Set(s.amenities);
      set.has(name) ? set.delete(name) : set.add(name);
      return { ...s, amenities: Array.from(set), page: 1 };
    });
  }

  return (
    <aside className="w-full md:w-80 bg-white border rounded-lg p-4 h-max">
      <h3 className="font-semibold mb-3">Tìm kiếm & Lọc</h3>

      <label className="text-sm text-gray-600">Tìm kiếm</label>
      <input
        className="w-full border rounded px-3 py-2 mt-1 mb-3"
        placeholder="Tên KTX, địa chỉ…"
        value={local.q}
        onChange={(e) => update("q", e.target.value)}
      />

      <label className="text-sm text-gray-600">Khu vực</label>
      <input
        className="w-full border rounded px-3 py-2 mt-1 mb-3"
        placeholder="VD: Liên Chiểu"
        value={local.area}
        onChange={(e) => update("area", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Giá từ</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mt-1"
            value={local.priceMin}
            onChange={(e) => update("priceMin", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Đến</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mt-1"
            value={local.priceMax}
            onChange={(e) => update("priceMax", e.target.value)}
          />
        </div>
      </div>

      <label className="text-sm text-gray-600 mt-3 block">Loại phòng</label>
      <select
        className="w-full border rounded px-3 py-2 mt-1 mb-3"
        value={local.type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="">Tất cả</option>
        <option value="nam">Khu nam</option>
        <option value="nu">Khu nữ</option>
        <option value="khac">Khác</option>
      </select>

      <label className="text-sm text-gray-600 block">Tiện ích</label>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
        {["Wifi", "Máy giặt", "Bảo vệ 24/7", "Máy lạnh", "Bãi xe", "Phòng máy tính"].map(
          (x) => (
            <label key={x} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={local.amenities.includes(x)}
                onChange={() => toggleAmen(x)}
              />
              {x}
            </label>
          )
        )}
      </div>

      <button
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
        onClick={() => {
          setFilters(local);
          onApply?.();
        }}
      >
        Áp dụng bộ lọc
      </button>
    </aside>
  );
}

export default function Dorms() {
  const [filters, setFilters] = useState({
    q: "",
    area: "",
    priceMin: "",
    priceMax: "",
    type: "",
    amenities: [],
    page: 1,
    limit: 6,
    sort: "default",
  });

  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 6 });
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.total / filters.limit)),
    [data.total, filters.limit]
  );

  async function load() {
    setLoading(true);
    try {
      const res = await fetchDorms({
        ...filters,
        amenities: filters.amenities.join(","),
      });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.page, filters.limit, filters.sort]);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-sm opacity-80">Trang chủ &gt; Ký túc xá</div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Ký túc xá tại Đà Nẵng
          </h1>
          <p className="opacity-90 mt-2">
            Khám phá các ký túc xá chất lượng cao với đầy đủ tiện nghi dành cho
            sinh viên
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white shadow rounded-lg p-2 overflow-hidden">
          <MapContainer
            center={vietnamDaNang}
            zoom={12}
            className="h-[420px] w-full rounded"
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {(data.items || []).map((d) =>
              d.lat && d.lng ? (
                <Marker key={d.id} position={[d.lat, d.lng]}>
                  <Popup>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-500">{d.address}</div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-6">
        <SidebarFilters
          filters={filters}
          setFilters={setFilters}
          onApply={() => {
            setFilters((s) => ({ ...s, page: 1 }));
            load();
          }}
        />

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-4 border mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị <b>{data.items?.length || 0}</b> / {data.total} kết quả
            </div>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filters.sort}
              onChange={(e) =>
                setFilters((s) => ({ ...s, sort: e.target.value, page: 1 }))
              }
            >
              <option value="default">Mặc định</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
            </select>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Đang tải…</div>
            ) : (data.items || []).length ? (
              data.items.map((d) => <DormCard key={d.id} dorm={d} />)
            ) : (
              <div className="text-center text-gray-500 py-8">
                Không có kết quả.
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <button
              className="px-3 py-2 text-sm rounded border disabled:opacity-50"
              onClick={() =>
                setFilters((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
              }
              disabled={filters.page <= 1}
            >
              «
            </button>

            {Array.from({ length: totalPages })
              .slice(0, 7)
              .map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={
                      "px-3 py-2 text-sm rounded border " +
                      (filters.page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "")
                    }
                    onClick={() => setFilters((s) => ({ ...s, page: p }))}
                  >
                    {p}
                  </button>
                );
              })}

            <button
              className="px-3 py-2 text-sm rounded border disabled:opacity-50"
              onClick={() =>
                setFilters((s) => ({
                  ...s,
                  page: Math.min(totalPages, s.page + 1),
                }))
              }
              disabled={filters.page >= totalPages}
            >
              »
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
