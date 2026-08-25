import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getInventorySummary,
  getLowStockInventory,
} from "../../api/inventoryApi";
import { getAllSales } from "../../api/saleApi";
import { getAllStockRequests } from "../../api/stockRequestApi";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [summaryRes, lowStockRes, salesRes, requestsRes] =
        await Promise.all([
          getInventorySummary(),
          getLowStockInventory(),
          getAllSales(),
          getAllStockRequests("PENDING"),
        ]);
      setSummary(summaryRes.data);
      setLowStock(lowStockRes.data);
      setSales(salesRes.data);
      setPendingRequests(requestsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.total_amount || 0),
    0
  );

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading dashboard...</p>;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Welcome, {user?.first_name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-text-primary">
            Admin Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light sm:w-auto"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            Total Products
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {summary?.total_products}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Low Stock</p>
          <p className="mt-3 text-3xl font-semibold text-warning">
            {summary?.low_stock_products}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Total Sales</p>
          <p className="mt-3 text-3xl font-semibold">{sales.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            Total Revenue
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {totalRevenue.toFixed(2)}
          </p>
        </div>
        <div
          className={`rounded-lg border p-5 shadow-sm ${
            pendingRequests.length > 0
              ? "border-warning/30 bg-warning-bg"
              : "border-border bg-card"
          }`}
        >
          <p className="text-sm font-medium text-text-secondary">
            Pending Requests
          </p>
          <p className="mt-3 text-3xl font-semibold text-warning">
            {pendingRequests.length}
          </p>
        </div>
      </section>

      {pendingRequests.length > 0 && (
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Pending Stock Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Quantity</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Requested By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingRequests.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-surface/70">
                    <td className="px-5 py-3 font-medium">{r.product}</td>
                    <td className="px-5 py-3">{r.type}</td>
                    <td className="px-5 py-3">{r.quantity}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {r.reason}
                    </td>
                    <td className="px-5 py-3">{r.requested_by_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {lowStock.length > 0 && (
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Low Stock Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Minimum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lowStock.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-surface/70">
                    <td className="px-5 py-3 font-medium">{item.name}</td>
                    <td className="px-5 py-3 text-warning">{item.stock}</td>
                    <td className="px-5 py-3">{item.minimum_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;