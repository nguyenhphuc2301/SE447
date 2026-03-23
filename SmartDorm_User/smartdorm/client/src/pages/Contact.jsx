import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const IconCircle = ({ children }) => (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {children}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6 text-center">
        <p className="text-sm mb-2 opacity-90">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          &gt; Liên hệ
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-lg max-w-3xl mx-auto opacity-90">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
        </p>
      </div>

      {/* Nội dung */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-8">
        {/* Thông tin liên hệ */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
            <p className="text-sm opacity-90">
              Liên hệ với chúng tôi qua các kênh sau
            </p>
          </div>

          <div className="p-6 space-y-6 text-gray-700">
            <div className="flex items-start space-x-3">
              <IconCircle>
                <MapPin className="w-5 h-5" />
              </IconCircle>
              <div>
                <p className="font-semibold">Địa chỉ</p>
                <p>54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <IconCircle>
                <Mail className="w-5 h-5" />
              </IconCircle>
              <div>
                <p className="font-semibold">Email</p>
                <p>contact@SmartDorm.vn</p>
                <p>support@SmartDorm.vn</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <IconCircle>
                <Phone className="w-5 h-5" />
              </IconCircle>
              <div>
                <p className="font-semibold">Điện thoại</p>
                <p>0236 123 4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <IconCircle>
                <Clock className="w-5 h-5" />
              </IconCircle>
              <div>
                <p className="font-semibold">Giờ làm việc</p>
                <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                <p>Thứ 7: 8:00 - 12:00</p>
                <p>Chủ nhật: Đóng cửa</p>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Kết nối với chúng tôi</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-600">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-sky-500">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-600">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <h3 className="text-lg font-semibold">Gửi tin nhắn cho chúng tôi</h3>
            <p className="text-sm opacity-90">
              Điền thông tin và nội dung tin nhắn của bạn vào form bên dưới
            </p>
          </div>

          {/* Thông báo */}
          {status === "success" && (
            <div className="bg-green-100 text-green-800 p-3 m-4 rounded border border-green-300">
              Tin nhắn đã được gửi thành công.
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-100 text-red-800 p-3 m-4 rounded border border-red-300">
              Vui lòng nhập đầy đủ các trường bắt buộc.
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Chủ đề</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn chủ đề</option>
                  <option>Hỗ trợ</option>
                  <option>Phản hồi</option>
                  <option>Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nội dung tin nhắn *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Nội dung tin nhắn của bạn..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
