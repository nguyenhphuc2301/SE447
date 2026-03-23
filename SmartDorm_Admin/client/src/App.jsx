import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout.jsx";

// ✅ thêm
import Login from "./pages/Login.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import { getAuth } from "./services/auth.service.js";

import Dashboard from "./pages/Dashboard.jsx";

import Buildings from "./pages/Buildings.jsx";
import BuildingDetail from "./pages/BuildingDetail.jsx";

import Rooms from "./pages/Rooms.jsx";
import RoomDetail from "./pages/RoomDetail.jsx";
import RoomForm from "./pages/RoomForm.jsx";

import Bookings from "./pages/Bookings.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import BookingDetail from "./pages/BookingDetail.jsx";

import Users from "./pages/Users.jsx";
import UserForm from "./pages/UserForm.jsx";
import UserDetail from "./pages/UserDetail.jsx";

import Reports from "./pages/Reports.jsx";
import ReportForm from "./pages/ReportForm.jsx";
import ReportDetail from "./pages/ReportDetail.jsx";

import Reviews from "./pages/Reviews.jsx";
import ReviewForm from "./pages/ReviewForm.jsx";

import Settings from "./pages/Settings.jsx";

import Payments from "./pages/Payments.jsx";
import PaymentForm from "./pages/PaymentForm.jsx";
import PaymentDetail from "./pages/PaymentDetail.jsx";

// ✅ redirect thông minh
function RootRedirect() {
  const auth = getAuth();
  const ok =
    auth?.token &&
    (auth?.user?.vai_tro_id === "VT02" ||
      auth?.user?.ten_vai_tro === "Quản trị viên");

  return <Navigate to={ok ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<RootRedirect />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* bọc RequireAdmin cho tất cả route admin*/}
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* BUILDINGS */}
        <Route
          path="/buildings"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Buildings />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/buildings/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <BuildingDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* ROOMS */}
        <Route
          path="/rooms"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Rooms />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/rooms/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <RoomForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/rooms/edit/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <RoomForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <RoomDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* BOOKINGS */}
        <Route
          path="/bookings"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Bookings />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/bookings/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <BookingForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/bookings/edit/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <BookingForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <BookingDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/users/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <UserForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <UserForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <UserDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reports/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReportForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reports/edit/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReportForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReportDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* REVIEWS */}
        <Route
          path="/reviews"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Reviews />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reviews/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReviewForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reviews/edit/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReviewForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/* PAYMENTS */}
        <Route
          path="/payments"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/payments/new"
          element={
            <RequireAdmin>
              <AdminLayout>
                <PaymentForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/payments/:id/edit"
          element={
            <RequireAdmin>
              <AdminLayout>
                <PaymentForm />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/payments/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <PaymentDetail />
              </AdminLayout>
            </RequireAdmin>
          }
        />

        {/*  404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
