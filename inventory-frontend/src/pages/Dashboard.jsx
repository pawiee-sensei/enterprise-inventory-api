import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllSales } from "../api/saleApi";
import { getAllStockRequests } from "../api/stockRequestApi";
import { getLowStockInventory } from "../api/inventoryApi";
import { formatDate } from "../utils/formatDate";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mySales, setMySales] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = `${user?.first_name} ${user?.last_name}`;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [salesRes, requestsRes, lowStockRes] = await Promise.all([
        getAllSales(),
        getAllStockRequests(""),
        getLowStockInventory(),
      ]);

      setMySales(salesRes.data.filter((s) => s.created_by === fullName));
      setMyRequests(
        requestsRes.data.filter((r) => r.requested_by_name === fullName)
      );
      setLowStock(lowStockRes.data);
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

  if (loading) {
    return <p className="text-sm text-text-secondary">Loading dashboard...</p>;
  }

  const pendingRequestCount = myRequests.filter(
    (r) => r.status === "PENDING"
  ).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Welcome, {user?.first_name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-text-primary">
            Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light sm:w-auto"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">My Sales</p>
          <p className="mt-3 text-3xl font-semibold text-text-primary">
            {mySales.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            My Pending Requests
          </p>
          <p className="mt-3 text-3xl font-semibold text-warning">
            {pendingRequestCount}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">My Recent Sales</h2>
        </div>
        {mySales.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-secondary">No sales yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mySales.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-surface/70">
                    <td className="px-5 py-3 font-medium">{s.id}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {formatDate(s.sale_date)}
                    </td>
                    <td className="px-5 py-3">{s.total_amount}</td>
                    <td className="px-5 py-3">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">My Stock Requests</h2>
        </div>
        {myRequests.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-secondary">
            No requests submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Quantity</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myRequests.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-surface/70">
                    <td className="px-5 py-3 font-medium">{r.product}</td>
                    <td className="px-5 py-3">{r.type}</td>
                    <td className="px-5 py-3">{r.quantity}</td>
                    <td className="px-5 py-3">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {lowStock.length > 0 && (
        <section className="rounded-lg border border-warning/30 bg-warning-bg p-5 text-warning shadow-sm">
          <h2 className="text-lg font-semibold">Heads up - Low Stock</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {lowStock.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.name} - only {item.stock} left
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Dashboard;