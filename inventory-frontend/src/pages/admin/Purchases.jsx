import { useState, useEffect } from "react";
import { getAllPurchases, getPurchaseById, createPurchase, getProductsPurchasedFromSupplier, createPurchaseReturn } from "../../api/purchaseApi";
import { getAllSuppliers } from "../../api/supplierApi";
import { getAllProducts } from "../../api/productApi";
import { formatDate } from "../../utils/formatDate";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [returnReason, setReturnReason] = useState("");
  const [returnQuantities, setReturnQuantities] = useState({});
  const [supplierId, setSupplierId] = useState("");
  const [historyProducts, setHistoryProducts] = useState([]);
  const [search, setSearch] = useState("");

  // items being purchased: { product_id, product_name, quantity, unit_cost }
  const [items, setItems] = useState([]);

  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!supplierId) {
      setHistoryProducts([]);
      return;
    }
    getProductsPurchasedFromSupplier(supplierId)
      .then((res) => setHistoryProducts(res.data))
      .catch(() => setHistoryProducts([]));
  }, [supplierId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [purchasesRes, suppliersRes, productsRes] = await Promise.all([
        getAllPurchases(),
        getAllSuppliers(),
        getAllProducts(),
      ]);
      setPurchases(purchasesRes.data);
      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const historyIds = historyProducts.map((p) => p.id);

  // products already added to this purchase shouldn't show an "Add" option again
  const isAlreadyAdded = (productId) => items.some((item) => item.product_id === productId);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReturnQuantityChange = (itemId, value) => {
  setReturnQuantities({ ...returnQuantities, [itemId]: value });
};

const handleSubmitReturn = async (e) => {
  e.preventDefault();
  setError("");

  const items = selectedPurchase.items
    .filter((item) => Number(returnQuantities[item.id]) > 0)
    .map((item) => ({
      product_id: item.product_id,
      quantity: Number(returnQuantities[item.id]),
    }));

  if (items.length === 0) {
    setError("Enter a quantity for at least one item to return");
    return;
  }

  try {
    await createPurchaseReturn(selectedPurchase.id, { reason: returnReason, items });
    setReturnReason("");
    setReturnQuantities({});
    setSelectedPurchase(null);
    loadAll();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to create return");
  }
};

  const handleAddProduct = (prod) => {
    if (isAlreadyAdded(prod.id)) return;

    setItems([
      ...items,
      {
        product_id: prod.id,
        product_name: prod.name,
        quantity: "",
        unit_cost: prod.cost_price,
      },
    ]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemFieldChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      supplier_id: supplierId,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
        unit_cost: Number(item.unit_cost),
      })),
    };

    try {
      await createPurchase(payload);
      setSupplierId("");
      setItems([]);
      setSearch("");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create purchase");
    }
  };

  const handleView = async (id) => {
    try {
      const data = await getPurchaseById(id);
      setSelectedPurchase(data.data);
    } catch (err) {
      setError("Failed to load purchase details: " + err.message);
    }
  };

  return (
    <div>
      <h1>Purchases</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={supplierId}
          onChange={(e) => {
            setSupplierId(e.target.value);
            setItems([]);
          }}
          required
        >
          <option value="">Select supplier</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>

        {supplierId && (
          <>
            <h3>Pick products to purchase</h3>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Cost Price</th>
                  <th>Stock</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.cost_price}</td>
                    <td>{prod.stock}</td>
                    <td>
                      {historyIds.includes(prod.id) ? "Previously purchased" : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleAddProduct(prod)}
                        disabled={isAlreadyAdded(prod.id)}
                      >
                        {isAlreadyAdded(prod.id) ? "Added" : "Add"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {items.length > 0 && (
          <>
            <h3>Items in this purchase</h3>
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemFieldChange(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) =>
                          handleItemFieldChange(index, "unit_cost", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      {((Number(item.quantity) || 0) * (Number(item.unit_cost) || 0)).toFixed(2)}
                    </td>
                    <td>
                      <button type="button" onClick={() => removeItemRow(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>Total: {total.toFixed(2)}</p>

            <button type="submit">Create Purchase</button>
          </>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.supplier}</td>
                <td>{p.created_by}</td>
                <td>{formatDate(p.purchase_date)}</td>
                <td>{p.total_amount}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleView(p.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{selectedPurchase && (
  <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
    <h3>Purchase #{selectedPurchase.id} details</h3>
    <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Subtotal</th>
            <th>Returned</th>
            <th>Remaining</th>
            <th>Return Qty</th>
          </tr>
        </thead>
        <tbody>
          {selectedPurchase.items.map((item) => {
            const remaining = item.quantity - item.returned_quantity;
            return (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>{item.unit_cost}</td>
                <td>{item.subtotal}</td>
                <td>{item.returned_quantity}</td>
                <td>{remaining}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={remaining}
                    value={returnQuantities[item.id] || ""}
                    onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                    style={{ width: "60px" }}
                    disabled={remaining <= 0}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
    </table>

    <form onSubmit={handleSubmitReturn}>
      <input
        placeholder="Reason for return"
        value={returnReason}
        onChange={(e) => setReturnReason(e.target.value)}
        required
      />
      <button type="submit">Submit Return</button>
    </form>

    <button onClick={() => setSelectedPurchase(null)}>Close</button>
  </div>
)}
    </div>
  );
}

export default Purchases;