import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ROLES } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";
import Suppliers from "./pages/admin/Suppliers";
import Products from "./pages/admin/Products";
import Purchases from "./pages/admin/Purchases";

// Staff and Admin Pages
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import StockRequests from "./pages/StockRequests";

// Staff Product Page
import ProductsView from "./pages/ProductsView";
import NotFound from "./pages/NotFound";

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

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
              <ProductsView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-requests"
          element={
            <ProtectedRoute>
              <StockRequests />
            </ProtectedRoute>
          }
        />

        </Route>
                <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;