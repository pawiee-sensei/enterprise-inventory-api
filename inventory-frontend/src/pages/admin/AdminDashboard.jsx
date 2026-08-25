import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getInventorySummary,
  getLowStockInventory,
} from "../../api/inventoryApi";
import { getAllSales } from "../../api/saleApi";
import { getAllStockRequests } from "../../api/stockRequestApi";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";

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

  const hasLowStock = lowStock.length > 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Welcome back, {user?.first_name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Overview of your inventory operations
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light sm:w-auto"
        >
          Logout
        </button>
      </header>

      {/* Metric cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          icon={<Package size={18} />}
          label="Total Products"
          value={summary?.total_products}
          tone="neutral"
        />
        <MetricCard
          icon={<AlertTriangle size={18} />}
          label="Low Stock"
          value={summary?.low_stock_products}
          tone={summary?.low_stock_products > 0 ? "warning" : "success"}
        />
        <MetricCard
          icon={<ShoppingCart size={18} />}
          label="Total Sales"
          value={sales.length}
          tone="neutral"
        />
        <MetricCard
          icon={<DollarSign size={18} />}
          label="Total Revenue"
          value={totalRevenue.toFixed(2)}
          tone="neutral"
        />
        <MetricCard
          icon={<Clock size={18} />}
          label="Pending Requests"
          value={pendingRequests.length}
          tone={pendingRequests.length > 0 ? "warning" : "success"}
        />
      </section>

      {/* Low Stock Notification */}
      <section
        className={`rounded-lg border p-5 shadow-sm ${
          hasLowStock
            ? "border-warning/30 bg-warning-bg"
            : "border-success/30 bg-success-bg"
        }`}
      >
        <div className="flex items-center gap-2">
          {hasLowStock ? (
            <AlertTriangle size={18} className="text-warning" />
          ) : (
            <CheckCircle2 size={18} className="text-success" />
          )}
          <h2
            className={`text-sm font-semibold ${
              hasLowStock ? "text-warning" : "text-success"
            }`}
          >
            {hasLowStock
              ? `${lowStock.length} product${lowStock.length > 1 ? "s" : ""} running low on stock`
              : "All products are sufficiently stocked"}
          </h2>
        </div>

        {hasLowStock && (
          <ul className="mt-3 divide-y divide-warning/20 text-sm">
            {lowStock.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium text-text-primary">
                  {item.name}
                </span>
                <span className="font-mono text-warning tabular-nums">
                  {item.stock} left{" "}
                  <span className="text-text-secondary">
                    (min {item.minimum_stock})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {lowStock.length > 5 && (
          <Link
            to="/inventory"
            className="mt-2 inline-block text-sm font-medium text-warning underline underline-offset-2"
          >
            View all {lowStock.length} low stock items
          </Link>
        )}
      </section>

      {/* Pending Stock Requests */}
      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Pending Stock Requests</h2>
          <Link
            to="/stock-requests"
            className="text-sm font-medium text-navy underline underline-offset-2"
          >
            View all
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="flex items-center gap-2 px-5 py-6 text-sm text-text-secondary">
            <CheckCircle2 size={16} className="text-success" />
            No pending requests right now.
          </p>
        ) : (
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
                    <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            r.type === "ADJUSTMENT_IN"
                              ? "bg-success-bg text-success"
                              : "bg-danger-bg text-danger"
                          }`}
                        >
                        {r.type === "ADJUSTMENT_IN" ? "Stock In" : "Stock Out"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono tabular-nums">
                      {r.quantity}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      {r.reason}
                    </td>
                    <td className="px-5 py-3">{r.requested_by_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, tone }) {
  const toneStyles = {
    neutral: "bg-surface text-text-secondary",
    warning: "bg-warning-bg text-warning",
    success: "bg-success-bg text-success",
  };

  const valueStyles = {
    neutral: "text-text-primary",
    warning: "text-warning",
    success: "text-success",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${toneStyles[tone]}`}
        >
          {icon}
        </span>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
      </div>
      <p
        className={`mt-4 font-mono text-3xl font-semibold tabular-nums ${valueStyles[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;