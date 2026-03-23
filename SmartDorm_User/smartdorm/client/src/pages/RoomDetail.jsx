import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import { getReviewSummary, getReviews, postReview } from "../services/review.service";

function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/dorms/${id}`)
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!room) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

  const getStatusDisplay = (status) => {
    switch (status) {
      case "con_trong":
        return { label: "✔ Còn phòng trống", color: "text-green-600" };
      case "da_dat":
        return { label: "✖ Đã được đặt", color: "text-red-600" };
      case "dang_bao_tri":
        return { label: "🛠️ Đang bảo trì", color: "text-yellow-500" };
      default:
        return { label: "Không xác định", color: "text-gray-500" };
    }
  };

  const { label, color } = getStatusDisplay(room.status || room.trang_thai);

  const handleBook = () => {
    const target = `/booking/${room.id}`;
    if (!isLoggedIn()) {
      navigate("/login", { state: { from: target } });
      return;
    }
    navigate(target);
  };

  //  fallback ảnh nếu thiếu images
  const images = room.images?.length ? room.images : ["/images/ktx.jpg"];
  const safeIndex = Math.min(currentImage, images.length - 1);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{room.name}</h1>
          <p className="mt-2">{room.address}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          &gt;{" "}
          <Link to="/dorms" className="hover:underline">
            Danh sách KTX
          </Link>{" "}
          &gt; <span className="text-gray-700">{room.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Slider ảnh */}
          <div className="relative">
            <img
              src={images[safeIndex]}
              alt="Ảnh phòng"
              className="w-full h-96 object-cover rounded-lg"
            />

            <button
              onClick={() =>
                setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              ◀
            </button>

            <button
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              ▶
            </button>
          </div>

          <div className="flex gap-3 mt-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`flex-shrink-0 w-24 h-20 border rounded-lg overflow-hidden ${
                  safeIndex === i ? "border-blue-600" : "border-gray-200"
                }`}
              >
                <img src={img} alt={`Ảnh ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-blue-600 font-bold">💰 Giá phòng</h3>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {(room.price || 0).toLocaleString()} đ/tháng
              </p>
              <p className="text-sm text-gray-500">
                Phụ thuộc vào loại phòng và tiện ích đi kèm
              </p>
              <Link className="text-blue-600 text-sm mt-1 inline-block" to="#">
                Xem bảng giá chi tiết &gt;
              </Link>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-indigo-600 font-bold">👥 Sức chứa</h3>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {room.capacity} người/phòng
              </p>
              <p className="text-sm text-gray-500">
                Hiện tại: {room.occupied}/{room.capacity} người
              </p>
              <p className={`font-semibold mt-1 ${color}`}>{label}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-purple-600 font-bold">📅 Đặt phòng</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Đặt phòng ngay để được giá ưu đãi và đảm bảo còn chỗ
                </p>
              </div>

              <button
                onClick={handleBook}
                className="bg-blue-600 text-white mt-3 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Đặt phòng
              </button>
            </div>
          </div>
        </div>

        {/*  ĐÁNH GIÁ */}
        <Reviews roomId={room.id} />
      </div>
    </div>
  );
}

export default RoomDetail;

/* ================== COMPONENT ĐÁNH GIÁ ================== */
function Reviews({ roomId }) {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const [sum, lst] = await Promise.all([
          getReviewSummary(roomId),
          getReviews(roomId, page, limit),
        ]);
        if (!alive) return;
        setSummary(sum);
        setList(lst.items || []);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [roomId, page]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isLoggedIn()) {
      navigate("/login", { state: { from: `/rooms/${roomId}` } });
      return;
    }
    if (!content.trim()) return;

    await postReview({
      phong_id: roomId,
      so_sao: rating,
      noi_dung: content.trim(),
    });

    setContent("");
    setRating(5);

    // reload về trang 1
    const [sum, lst] = await Promise.all([
      getReviewSummary(roomId),
      getReviews(roomId, 1, limit),
    ]);
    setSummary(sum);
    setList(lst.items || []);
    setPage(1);
  }

  if (loading) return <div className="mt-6">Đang tải đánh giá...</div>;

  const total = summary?.count || 0;
  const avg = summary?.avg || 0;

  const bars = [
    { label: "5 sao", val: summary?.star5 || 0 },
    { label: "4 sao", val: summary?.star4 || 0 },
    { label: "3 sao", val: summary?.star3 || 0 },
    { label: "2 sao", val: summary?.star2 || 0 },
    { label: "1 sao", val: summary?.star1 || 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      {/* summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{avg}</div>
          <div className="text-sm text-gray-500">
            <div>Điểm trung bình</div>
            <div>{total} đánh giá</div>
          </div>
        </div>

        <div className="flex-1">
          {bars.map((b, i) => {
            const pct = total ? Math.round((b.val * 100) / total) : 0;
            return (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="w-12 text-sm text-gray-600">{b.label}</span>
                <div className="h-2 bg-gray-200 rounded w-full">
                  <div
                    className="h-2 bg-yellow-400 rounded"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm text-gray-600">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded self-start"
          onClick={() =>
            document.getElementById("rv-form")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Viết đánh giá
        </button>
      </div>

      {/* list */}
      <div className="divide-y mt-6">
        {list.length === 0 && (
          <div className="text-gray-500">Chưa có đánh giá nào.</div>
        )}

        {list.map((it) => (
          <div key={it.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{it.user_name || "Người dùng"}</div>
              <div className="text-yellow-500">
                {"★".repeat(it.so_sao)}{"☆".repeat(5 - it.so_sao)}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {it.ngay_danh_gia ? new Date(it.ngay_danh_gia).toLocaleDateString() : ""}
            </div>

            <p className="mt-2">{it.noi_dung}</p>

            {/*  phản hồi admin */}
            {it.phan_hoi && it.phan_hoi.trim() !== "" && (
              <div className="mt-3 ml-4 p-3 bg-gray-50 border rounded-lg">
                <div className="text-sm font-semibold text-gray-700">Admin</div>
                <div className="text-sm text-gray-700 mt-1">{it.phan_hoi}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* pagination */}
      {total > limit && (
        <div className="flex gap-3 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Trước
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setPage((p) => p + 1)}
          >
            Sau »
          </button>
        </div>
      )}

      {/* form */}
      {!isLoggedIn() ? (
        <div id="rv-form" className="mt-8 p-4 border rounded-lg text-sm">
          Bạn cần{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => navigate("/login", { state: { from: `/rooms/${roomId}` } })}
          >
            đăng nhập
          </button>{" "}
          để viết đánh giá.
        </div>
      ) : (
        <form
          id="rv-form"
          onSubmit={handleSubmit}
          className="mt-8 p-4 border rounded-lg"
        >
          <div className="font-semibold mb-2">Viết đánh giá của bạn</div>

          <div className="flex items-center gap-4 mb-3">
            <label className="text-sm">Số sao:</label>
            <select
              className="border rounded px-2 py-1"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full border rounded p-2"
            rows="4"
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="submit"
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gửi đánh giá
          </button>
        </form>
      )}
    </div>
  );
}
