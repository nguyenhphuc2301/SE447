import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../services/auth.service";

export default function RequireAdmin({ children }) {
  const auth = getAuth();
  const ok = auth?.token && (auth?.user?.vai_tro_id === "VT02" || auth?.user?.ten_vai_tro === "Quản trị viên");
  return ok ? children : <Navigate to="/login" replace />;
}
