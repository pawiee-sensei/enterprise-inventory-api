import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ROLES } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";
import Suppliers from "./pages/admin/Suppliers";
import Products from "./pages/admin/Products";
import Purchases from "./pages/admin/Purchases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/suppliers"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/purchases"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Purchases />
            </ProtectedRoute>
          }
        />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;