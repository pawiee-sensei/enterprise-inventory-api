import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInventorySummary, getLowStockInventory } from "../../api/inventoryApi";
import { getAllSales } from "../../api/saleApi";
import { getAllStockRequests } from "../../api/stockRequestApi";
import { formatDate } from "../../utils/formatDate";

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
      const [summaryRes, lowStockRes, salesRes, requestsRes] = await Promise.all([
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

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>
        Welcome, {user?.first_name}! <button onClick={handleLogout}>Logout</button>
      </p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Total Products</strong>
          <p>{summary?.total_products}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Low Stock</strong>
          <p>{summary?.low_stock_products}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Total Sales</strong>
          <p>{sales.length}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>Total Revenue</strong>
          <p>{totalRevenue.toFixed(2)}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px", background: pendingRequests.length > 0 ? "#fff3cd" : "" }}>
          <strong>Pending Requests</strong>
          <p>{pendingRequests.length}</p>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Pending Stock Requests</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Requested By</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td>{r.product}</td>
                  <td>{r.type}</td>
                  <td>{r.quantity}</td>
                  <td>{r.reason}</td>
                  <td>{r.requested_by_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lowStock.length > 0 && (
        <div>
          <h3>Low Stock Products</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Minimum</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.minimum_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;