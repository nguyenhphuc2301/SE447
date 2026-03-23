import React from "react";
import { Zap, ShieldCheck, MessageSquare, Lock } from "lucide-react";

function IconCircle({ children }) {
  return (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {children}
    </div>
  );
}

function About() {
  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6 text-center">
        <p className="text-sm mb-2 opacity-90">Trang chủ &gt; Giới thiệu</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Giới thiệu về SmartDorm
        </h1>
        <p className="text-lg max-w-3xl mx-auto opacity-90">
          Nền tảng đặt phòng ký túc xá hàng đầu
        </p>
      </div>

      <div className="py-12 px-6 max-w-6xl mx-auto">
        {/* Giới thiệu */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
          {/* Hình ảnh */}
          <div className="rounded-lg overflow-hidden h-full">
            <img
              src="/images/gioithieu.jpg"
              alt="Giới thiệu"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nội dung */}
          <div className="bg-white p-8 rounded-lg shadow-md h-full">
            <h2 className="text-2xl font-semibold mb-4">Về chúng tôi</h2>
            <p className="text-gray-600 leading-relaxed text-base">
              <span className="font-bold text-blue-600">SmartDorm</span> là nền
              tảng đặt phòng ký túc xá trực tuyến hàng đầu tại Đà Nẵng, kết nối
              sinh viên với các ký túc xá chất lượng cao trong khu vực.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed text-base">
              Được thành lập vào năm 2023, chúng tôi đã phát triển thành một nền
              tảng đáng tin cậy giúp hàng nghìn sinh viên tìm được nơi ở phù hợp
              với nhu cầu và ngân sách của mình.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed text-base">
              Với sứ mệnh cung cấp dịch vụ tìm kiếm và đặt phòng ký túc xá nhanh
              chóng, tiện lợi và an toàn, SmartDorm cam kết mang đến trải nghiệm
              tốt nhất cho sinh viên và các đối tác ký túc xá.
            </p>
          </div>
        </div>

        {/* Sứ mệnh và Tầm nhìn */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col mb-4">
              <IconCircle>
                <Zap className="w-7 h-7" />
              </IconCircle>
              <h3 className="text-2xl font-semibold mt-3">Sứ mệnh</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">
              Chúng tôi cam kết đơn giản hóa quá trình tìm kiếm và đặt phòng ký
              túc xá cho sinh viên, đồng thời hỗ trợ các ký túc xá quản lý hiệu
              quả công suất phòng và tăng khả năng tiếp cận với sinh viên.
            </p>
            <p className="text-gray-600 mt-3 leading-relaxed text-base">
              SmartDorm nỗ lực xây dựng một cộng đồng sinh viên kết nối, chia sẻ
              kinh nghiệm và hỗ trợ lẫn nhau trong hành trình học tập tại Đà
              Nẵng.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col mb-4">
              <IconCircle>
                <ShieldCheck className="w-7 h-7" />
              </IconCircle>
              <h3 className="text-2xl font-semibold mt-3">Tầm nhìn</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-base">
              SmartDorm hướng tới việc trở thành nền tảng đặt phòng ký túc xá
              hàng đầu tại Việt Nam, mở rộng dịch vụ đến các thành phố lớn và
              khu vực đại học trên cả nước.
            </p>
            <p className="text-gray-600 mt-3 leading-relaxed text-base">
              Chúng tôi mong muốn xây dựng một hệ sinh thái hoàn chỉnh cho sinh
              viên, từ việc tìm kiếm chỗ ở đến các dịch vụ tiện ích hỗ trợ học
              tập và sinh hoạt trong suốt quá trình học đại học.
            </p>
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center">
            Giá trị cốt lõi
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex flex-col items-center">
                <IconCircle>
                  <MessageSquare className="w-7 h-7" />
                </IconCircle>
                <h4 className="font-semibold text-lg mt-3 mb-3">Minh bạch</h4>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Chúng tôi cung cấp thông tin chính xác và đầy đủ về các ký túc
                xá, giá cả và dịch vụ, giúp sinh viên đưa ra quyết định sáng
                suốt.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex flex-col items-center">
                <IconCircle>
                  <Lock className="w-7 h-7" />
                </IconCircle>
                <h4 className="font-semibold text-lg mt-3 mb-3">An toàn</h4>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Bảo mật thông tin cá nhân và đảm bảo các giao dịch thanh toán an
                toàn là ưu tiên hàng đầu của chúng tôi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex flex-col items-center">
                <IconCircle>
                  <Zap className="w-7 h-7" />
                </IconCircle>
                <h4 className="font-semibold text-lg mt-3 mb-3">Hiệu quả</h4>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                Chúng tôi không ngừng cải tiến nền tảng để mang đến trải nghiệm
                đặt phòng nhanh chóng, tiện lợi và thân thiện với người dùng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
