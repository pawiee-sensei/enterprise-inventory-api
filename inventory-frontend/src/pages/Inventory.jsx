import { useState, useEffect } from "react";
import {
  getAllInventory,
  getLowStockInventory,
  getInventorySummary,
  getAllInventoryLogs,
} from "../api/inventoryApi";


import { formatDate } from "../utils/formatDate";

function Inventory() {
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // logs section state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logProductFilter, setLogProductFilter] = useState("");
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    loadAll();
  }, []);

  // re-fetch logs whenever the page or the product filter changes
  useEffect(() => {
    loadLogs();
  }, [logsPage, logProductFilter]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, inventoryRes, lowStockRes] = await Promise.all([
        getInventorySummary(),
        getAllInventory(),
        getLowStockInventory(),
      ]);
      setSummary(summaryRes.data);
      setInventory(inventoryRes.data);
      setLowStock(lowStockRes.data);
    } catch (err) {
      setError("Failed to load inventory: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await getAllInventoryLogs({
        page: logsPage,
        limit: logsPerPage,
        productId: logProductFilter,
      });
      setLogs(data.data);
      setLogsTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load logs: " + err.message);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleFilterChange = (productId) => {
    setLogProductFilter(productId);
    setLogsPage(1); // reset to page 1 whenever the filter changes
  };

  const rowsToShow = showLowStockOnly ? lowStock : inventory;

  return (
    <div>
      <h1>Inventory</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <strong>Total Products</strong>
            <p>{summary.total_products}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <strong>Total Stock</strong>
            <p>{summary.total_stock}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <strong>Low Stock</strong>
            <p>{summary.low_stock_products}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <strong>Out of Stock</strong>
            <p>{summary.out_of_stock_products}</p>
          </div>
        </div>
      )}

      <h2>Products</h2>
      <label>
        <input
          type="checkbox"
          checked={showLowStockOnly}
          onChange={(e) => setShowLowStockOnly(e.target.checked)}
        />
        Show low-stock items only
      </label>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Stock</th>
              <th>Minimum Stock</th>
            </tr>
          </thead>
          <tbody>
            {rowsToShow.map((item) => (
              <tr
                key={item.id}
                style={item.stock <= item.minimum_stock ? { background: "#fdd" } : {}}
              >
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.supplier}</td>
                <td>{item.stock}</td>
                <td>{item.minimum_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Stock Movement Logs</h2>

      <label>
        Filter by product:{" "}
        <select
          value={logProductFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All products</option>
          {inventory.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {logsLoading ? (
        <p>Loading logs...</p>
      ) : (
        <>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Previous Stock</th>
                <th>New Stock</th>
                <th>Reference</th>
                <th>By</th>
                <th>Remarks</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.product_name}</td>
                  <td>{log.movement_type}</td>
                  <td>{log.quantity}</td>
                  <td>{log.previous_stock}</td>
                  <td>{log.new_stock}</td>
                  <td>{log.reference_type}</td>
                  <td>{log.user_name}</td>
                  <td>{log.remarks}</td>
                  <td>{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <button
              type="button"
              disabled={logsPage <= 1}
              onClick={() => setLogsPage(logsPage - 1)}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {logsPage} of {logsTotalPages}
            </span>
            <button
              type="button"
              disabled={logsPage >= logsTotalPages}
              onClick={() => setLogsPage(logsPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Inventory;