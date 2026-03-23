import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ thêm 2 dòng này
import { getAuth, setAuthToken } from "./services/auth.service.js";

// ✅ nếu đã đăng nhập trước đó thì set Authorization header cho axios
const auth = getAuth();
if (auth?.token) setAuthToken(auth.token);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
