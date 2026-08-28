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
import { PageHeader } from "../components/ui/PageHeader";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../context/ToastContext";

const reasonCategories = ["Damaged", "Lost / Theft", "Miscount", "Expired", "Other"];

const statusTone = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

function StockRequests() {
  const { user } = useAuth();
  const isAdmin = user.role === ROLES.ADMIN;

  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [type, setType] = useState("ADJUSTMENT_OUT");
  const [quantity, setQuantity] = useState("");
  const [reasonCategory, setReasonCategory] = useState("Damaged");
  const [reasonDetail, setReasonDetail] = useState("");
  const { toast } = useToast();

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

  const resetForm = () => {
    setSelectedProduct(null);
    setSearch("");
    setType("ADJUSTMENT_OUT");
    setQuantity("");
    setReasonCategory("Damaged");
    setReasonDetail("");
    setIsModalOpen(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!selectedProduct) {
    setError("Select a product first");
    return;
  }

  const reason = reasonDetail ? `${reasonCategory} - ${reasonDetail}` : reasonCategory;

  try {
    await createStockRequest({
      product_id: selectedProduct.id,
      type,
      quantity: Number(quantity),
      reason,
    });
    toast.success("Request submitted");
    resetForm();
    loadRequests();
  } catch (err) {
    const message = err.response?.data?.message || "Failed to submit request";
    setError(message);
    toast.error(message);
  }
};

const handleApprove = async (id) => {
  setError("");
  try {
    await approveStockRequest(id);
    toast.success("Request approved");
    loadRequests();
  } catch (err) {
    const message = err.response?.data?.message || "Failed to approve";
    setError(message);
    toast.error(message);
  }
};

const handleReject = async (id) => {
  setError("");
  try {
    await rejectStockRequest(id);
    toast.success("Request rejected");
    loadRequests();
  } catch (err) {
    const message = err.response?.data?.message || "Failed to reject";
    setError(message);
    toast.error(message);
  }
};

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Stock Requests"
        subtitle={
          isAdmin
            ? "Review and approve stock adjustment requests"
            : "Report damaged, lost, or miscounted stock"
        }
        action={!isAdmin && <Button onClick={() => setIsModalOpen(true)}>New Request</Button>}
      />

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary">Filter:</span>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="">All</option>
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-text-secondary">No requests found.</p>
      ) : (
        <Table>
          <TableHead>
            <Th>Product</Th>
            <Th>Type</Th>
            <Th align="right">Qty</Th>
            <Th>Reason</Th>
            <Th>Requested By</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            {isAdmin && <Th align="right">Actions</Th>}
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <Tr key={r.id}>
                <Td className="font-medium">{r.product}</Td>
                <Td>
                  <Badge tone={r.type === "ADJUSTMENT_IN" ? "success" : "danger"}>
                    {r.type === "ADJUSTMENT_IN" ? "Stock In" : "Stock Out"}
                  </Badge>
                </Td>
                <Td align="right" className="font-mono tabular-nums">{r.quantity}</Td>
                <Td className="text-text-secondary">{r.reason}</Td>
                <Td>{r.requested_by_name}</Td>
                <Td className="text-text-secondary">{formatDate(r.created_at)}</Td>
                <Td>
                  <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                </Td>
                {isAdmin && (
                  <Td align="right">
                    {r.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => handleApprove(r.id)}>Approve</Button>
                        <Button variant="danger" onClick={() => handleReject(r.id)}>Reject</Button>
                      </div>
                    ) : (
                      <span className="text-sm text-text-secondary">—</span>
                    )}
                  </Td>
                )}
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title="New Stock Request">
        {!selectedProduct ? (
          <>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 w-full"
            />
            <div className="max-h-64 overflow-y-auto rounded-md border border-border">
              <Table>
                <TableHead>
                  <Th>Product</Th>
                  <Th align="right">Stock</Th>
                  <Th align="right">Action</Th>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((prod) => (
                    <Tr key={prod.id}>
                      <Td>{prod.name}</Td>
                      <Td align="right" className="font-mono tabular-nums">{prod.stock}</Td>
                      <Td align="right">
                        <Button variant="secondary" onClick={() => setSelectedProduct(prod)}>
                          Select
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
              <span className="text-sm">
                <span className="font-medium">{selectedProduct.name}</span>{" "}
                <span className="text-text-secondary">
                  (current stock: {selectedProduct.stock})
                </span>
              </span>
              <Button type="button" variant="secondary" onClick={() => setSelectedProduct(null)}>
                Change
              </Button>
            </div>

            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ADJUSTMENT_OUT">Remove stock (damage/loss)</option>
              <option value="ADJUSTMENT_IN">Add stock (found/correction)</option>
            </Select>

            <Input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <Select value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)}>
              {reasonCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>

            <Input
              placeholder="Additional details (optional)"
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
            />

            <Button type="submit">Submit Request</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default StockRequests;