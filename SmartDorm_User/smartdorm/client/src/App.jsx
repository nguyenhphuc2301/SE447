import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomeVisitor from "./pages/HomeVisitor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dorms from "./pages/Dorms";
import RoomDetail from "./pages/RoomDetail";
import Booking from "./pages/Booking.jsx";
import Payment from "./pages/Payment";
import Complete from "./pages/Complete.jsx";
import About from "./pages/About";
import Contact from "./pages/Contact";

import MyBookings from "./pages/MyBookings"; // ✅ thêm

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* ✅ Navbar luôn hiển thị ở mọi trang */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomeVisitor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dorms" element={<Dorms />} />
        <Route path="/dorms/:id" element={<RoomDetail />} />

        {/* ✅ Đơn đặt phòng của tôi */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/complete/:id"
          element={
            <ProtectedRoute>
              <Complete />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
