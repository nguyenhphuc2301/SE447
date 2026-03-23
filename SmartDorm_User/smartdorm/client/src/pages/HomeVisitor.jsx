import React from "react";

function HomeVisitor() {
  return (
    <div className="font-sans">

      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 pr-8">
            <h1 className="text-4xl font-bold mb-4">
              Tìm phòng ký túc xá dễ dàng tại Đà Nẵng
            </h1>
            <p className="mb-6">
              Nền tảng đặt phòng ký túc xá toàn diện nhất dành cho sinh viên
            </p>
            <div className="space-x-4">
              <button className="bg-white text-blue-600 font-semibold px-5 py-2 rounded shadow hover:bg-gray-100">
                Tìm ký túc xá
              </button>
              <button className="border border-white px-5 py-2 rounded hover:bg-white hover:text-blue-600">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center mt-8 md:mt-0">
            <img
              src="/images/ktx.jpg"
              alt="Ký túc xá"
              className="rounded-lg shadow-lg w-[500px] h-[260px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Lọc */}
      <section className="relative -mt-10 z-10 flex justify-center px-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-wrap gap-4 items-center">
          <select className="border p-2 rounded w-48">
            <option>Tất cả khu vực</option>
          </select>
          <select className="border p-2 rounded w-48">
            <option>Tất cả mức giá</option>
          </select>
          <select className="border p-2 rounded w-48">
            <option>Tất cả loại phòng</option>
          </select>
          <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            Tìm kiếm
          </button>
        </div>
      </section>

      <section className="text-center py-16">
        <h2 className="text-2xl font-bold mb-6">Ký túc xá nổi bật</h2>
        <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white">
          Xem tất cả ký túc xá
        </button>
      </section>

      <section className="bg-gray-50 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10 text-gray-800">
          Tại sao chọn SmartDorm?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 px-8">
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full">
                🔍
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Tìm kiếm dễ dàng
            </h3>
            <p>
              Hệ thống tìm kiếm thông minh giúp bạn dễ dàng lọc và tìm ký túc xá
              phù hợp với nhu cầu cá nhân.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-full">
                ✅
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Thông tin đáng tin cậy
            </h3>
            <p>
              Thông tin và hình ảnh chính xác, được cập nhật thường xuyên từ các
              ký túc xá đối tác của chúng tôi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 text-yellow-600 w-12 h-12 flex items-center justify-center rounded-full">
                ⏰
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Đặt phòng nhanh chóng
            </h3>
            <p>
              Quy trình đặt phòng đơn giản, nhanh chóng và bảo mật, giúp tiết
              kiệm thời gian cho sinh viên.
            </p>
          </div>
        </div>
      </section>

      {/* câu hỏi */}
      <section className="py-16 bg-white">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10 text-gray-800">
          Câu hỏi thường gặp
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* ... giữ nguyên phần FAQ của bạn ... */}
        </div>
      </section>

      {/*  Cách thức hoạt động */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">
          Cách thức hoạt động
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-8">
          <div>
            <h3 className="font-bold">1. Tìm kiếm</h3>
            <p>Dùng bộ lọc để tìm ký túc xá phù hợp.</p>
          </div>
          <div>
            <h3 className="font-bold">2. So sánh</h3>
            <p>Xem thông tin, hình ảnh và đánh giá.</p>
          </div>
          <div>
            <h3 className="font-bold">3. Đặt phòng</h3>
            <p>Thủ tục nhanh chóng, đơn giản, an toàn.</p>
          </div>
          <div>
            <h3 className="font-bold">4. Nhận phòng</h3>
            <p>Bắt đầu trải nghiệm cuộc sống ký túc xá.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold mb-2">SmartDorm</h3>
            <p>
              Nền tảng đặt phòng ký túc xá hàng đầu tại Đà Nẵng, tiện lợi và
              nhanh chóng.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Liên kết nhanh</h3>
            <ul>
              <li>Trang chủ</li>
              <li>Danh sách ký túc xá</li>
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Liên hệ</h3>
            <p>54 Nguyễn Lương Bằng, Đà Nẵng</p>
            <p>📧 contact@SmartDorm.vn</p>
            <p>📞 0236 123 4567</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Theo dõi</h3>
            <p>Facebook | Twitter | Instagram</p>
          </div>
        </div>
        <p className="text-center mt-6 text-sm">
          © 2025 SmartDorm. Tất cả các quyền được bảo lưu.
        </p>
      </footer>
    </div>
  );
}

export default HomeVisitor;
