import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ToastContainer } from "./components/ui/Toast.jsx";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  </StrictMode>
);