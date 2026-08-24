import { useState, useEffect } from "react";
import {
  createStockRequest,
  getAllStockRequests,
  approveStockRequest,
  rejectStockRequest,
} from "../api/stockRequestApi";
import { getAllProducts } from "../api/productApi";
import { useAuth, ROLES } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";

const reasonCategories = ["Damaged", "Lost / Theft", "Miscount", "Expired", "Other"];

function StockRequests() {
  const { user } = useAuth();
  const isAdmin = user.role === ROLES.ADMIN;

  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState("PENDING");

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [type, setType] = useState("ADJUSTMENT_OUT");
  const [quantity, setQuantity] = useState("");
  const [reasonCategory, setReasonCategory] = useState("Damaged");
  const [reasonDetail, setReasonDetail] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.data);
    } catch (err) {
      setError("Failed to load products: " + err.message);
    }
  };

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getAllStockRequests(statusFilter);
      setRequests(data.data);
    } catch (err) {
      setError("Failed to load requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSearch("");
    setType("ADJUSTMENT_OUT");
    setQuantity("");
    setReasonCategory("Damaged");
    setReasonDetail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Select a product first");
      return;
    }

    // combine category + optional free-text detail into one reason string
    const reason = reasonDetail
      ? `${reasonCategory} - ${reasonDetail}`
      : reasonCategory;

    try {
      await createStockRequest({
        product_id: selectedProduct.id,
        type,
        quantity: Number(quantity),
        reason,
      });
      setSuccess("Request submitted");
      resetForm();
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    }
  };

  const handleApprove = async (id) => {
    setError("");
    try {
      await approveStockRequest(id);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    setError("");
    try {
      await rejectStockRequest(id);
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <div>
      <h1>Stock Adjustment Requests</h1>

      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>Submit a request</h3>

        {!selectedProduct ? (
          <>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.stock}</td>
                    <td>
                      <button type="button" onClick={() => handleSelectProduct(prod)}>
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>
              <strong>Selected:</strong> {selectedProduct.name} (current stock:{" "}
              {selectedProduct.stock}){" "}
              <button type="button" onClick={() => setSelectedProduct(null)}>
                Change
              </button>
            </p>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ADJUSTMENT_OUT">Remove stock (damage/loss)</option>
              <option value="ADJUSTMENT_IN">Add stock (found/correction)</option>
            </select>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <select value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)}>
              {reasonCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              placeholder="Additional details (optional)"
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
            />

            <button type="submit">Submit Request</button>
          </form>
        )}

        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Filter:{" "}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="">All</option>
        </select>
      </label>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Requested By</th>
              <th>Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.product}</td>
                <td>{r.type}</td>
                <td>{r.quantity}</td>
                <td>{r.reason}</td>
                <td>{r.requested_by_name}</td>
                <td>{formatDate(r.created_at)}</td>
                <td>{r.status}</td>
                {isAdmin && (
                  <td>
                    {r.status === "PENDING" && (
                      <>
                        <button onClick={() => handleApprove(r.id)}>Approve</button>
                        <button onClick={() => handleReject(r.id)}>Reject</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StockRequests;