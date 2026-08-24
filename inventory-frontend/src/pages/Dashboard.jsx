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

      // filter to just this staff member's own activity
      setMySales(salesRes.data.filter((s) => s.created_by === fullName));
      setMyRequests(requestsRes.data.filter((r) => r.requested_by_name === fullName));
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

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome, {user?.first_name}! <button onClick={handleLogout}>Logout</button>
      </p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>My Sales</strong>
          <p>{mySales.length}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <strong>My Pending Requests</strong>
          <p>{myRequests.filter((r) => r.status === "PENDING").length}</p>
        </div>
      </div>

      <h3>My Recent Sales</h3>
      {mySales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mySales.slice(0, 5).map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{formatDate(s.sale_date)}</td>
                <td>{s.total_amount}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>My Stock Requests</h3>
      {myRequests.length === 0 ? (
        <p>No requests submitted yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.slice(0, 5).map((r) => (
              <tr key={r.id}>
                <td>{r.product}</td>
                <td>{r.type}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {lowStock.length > 0 && (
        <div>
          <h3>Heads up — Low Stock</h3>
          <ul>
            {lowStock.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.name} — only {item.stock} left
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;