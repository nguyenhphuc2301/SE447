import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchReviews,
  fetchReviewStats,
  fetchReviewBuildings,
  deleteReview,
  replyReview, 
} from "../services/review.service";
import { Search, Edit, Trash2 } from "lucide-react";

function Stars({ n = 0, size = 14 }) {
  const a = Math.max(0, Math.min(5, Number(n) || 0));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={size}
          height={size}
          className={
            i < a
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }
        >
          <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.62L10 0 7.19 6.62 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    average: "0.0",
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [rating, setRating] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [order, setOrder] = useState("newest");

  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);

  const params = useMemo(
    () => ({
      q: q || undefined,
      rating: rating || undefined,
      buildingId: buildingId || undefined,
      order,
    }),
    [q, rating, buildingId, order]
  );

  async function load() {
    setLoading(true);
    try {
      const [list, stat] = await Promise.all([
        fetchReviews(params),
        fetchReviewStats(params),
      ]);
      setItems(list);
      setStats(stat);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => setBuildings(await fetchReviewBuildings()))();
  }, []);

  useEffect(() => {
    load();
    setReplyingId(null);
    setReplyText("");
  }, [rating, buildingId, order]);

  async function onDelete(id) {
    if (!confirm("Bạn có chắc muốn xoá đánh giá này?")) return;
    await deleteReview(id);
    load();
  }

  async function onSaveReply(id) {
    try {
      setSavingReply(true);
      await replyReview(id, replyText);
      setReplyingId(null);
      setReplyText("");
      load();
    } finally {
      setSavingReply(false);
    }
  }

  const distMax = Math.max(1, ...Object.values(stats.distribution || {}));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Reviews & Feedback</h1>
          <p className="text-sm text-gray-500"></p>
        </div>
        <Link
          to="/reviews/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          + Add Review
        </Link>
      </div>

      {/* Top stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* average */}
        <div className="bg-white border rounded-xl p-6">
          <div className="text-[44px] font-semibold text-center leading-none">
            {stats.average}
          </div>
          <div className="mt-2 flex justify-center">
            <Stars n={Math.round(Number(stats.average))} size={18} />
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            Based on {stats.total} reviews
          </div>
        </div>

        {/* distribution */}
        <div className="bg-white border rounded-xl p-6">
          <div className="font-medium mb-2">Rating Distribution</div>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((s) => {
              const cnt = stats.distribution?.[s] || 0;
              const w = Math.round((cnt / distMax) * 100);
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-4 text-xs">{s}</div>
                  <Stars n={s} size={12} />
                  <div className="flex-1 h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 rounded bg-yellow-400"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <div className="w-6 text-right text-xs text-gray-600">
                    {cnt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center border rounded-lg px-3 flex-1">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="w-full py-2 px-2 text-sm outline-none"
            placeholder="Search reviews..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} stars
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
        >
          <option value="">All Buildings</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.ten_toa}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* list */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No reviews found.
          </div>
        ) : (
          items.map((rv) => (
            <div key={rv.id} className="border-b p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                  {rv.ho_ten?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{rv.ho_ten}</div>
                      <div className="text-xs text-gray-500">
                        {rv.ten_toa} - Room {rv.so_phong}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(rv.ngay_danh_gia).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Stars n={rv.so_sao} />
                      <span className="text-xs text-gray-500">
                        {rv.so_sao}.0
                      </span>

                      <button
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Link to={`/reviews/edit/${rv.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </button>

                      <button
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                        onClick={() => onDelete(rv.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* content */}
                  <div className="mt-3 text-gray-700 text-sm">{rv.noi_dung}</div>

                  {/* hiển thị admin reply  */}
                  {rv.phan_hoi && replyingId !== rv.id && (
                    <div className="mt-3 ml-10 border-l-4 border-blue-500 pl-3 text-sm text-gray-700">
                      <div className="text-xs font-semibold text-blue-600 mb-1">
                        Admin reply
                      </div>
                      {rv.phan_hoi}
                    </div>
                  )}

                  {/* actions */}
                  <div className="mt-3">
                    <button
                      className="px-3 py-1.5 text-xs border rounded-md hover:bg-gray-50"
                      onClick={() => {
                        setReplyingId(rv.id);
                        setReplyText(rv.phan_hoi || "");
                      }}
                    >
                      Reply
                    </button>
                  </div>

                  {/* reply box */}
                  {replyingId === rv.id && (
                    <div className="mt-3 ml-10 bg-gray-50 border rounded-lg p-3">
                      <textarea
                        className="w-full border rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Write admin reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={savingReply}
                          onClick={() => onSaveReply(rv.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-60"
                        >
                          {savingReply ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingId(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1.5 border text-xs rounded-md hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
