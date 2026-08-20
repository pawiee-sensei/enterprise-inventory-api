import { useState, useEffect } from "react";
import { getAllSales, getSaleById, createSale } from "../api/saleApi";
import { getAllProducts } from "../api/productApi";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]); // { product_id, product_name, selling_price, quantity }

  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes] = await Promise.all([getAllSales(), getAllProducts()]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyAdded = (productId) => items.some((item) => item.product_id === productId);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (prod) => {
    if (isAlreadyAdded(prod.id)) return;
    if (prod.stock <= 0) return; // can't sell what you don't have

    setItems([
      ...items,
      {
        product_id: prod.id,
        product_name: prod.name,
        selling_price: prod.selling_price,
        quantity: "",
      },
    ]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], quantity: value };
    setItems(updated);
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * Number(item.selling_price || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
      })),
    };

    try {
      await createSale(payload);
      setItems([]);
      setSearch("");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create sale");
    }
  };

  const handleView = async (id) => {
    try {
      const data = await getSaleById(id);
      setSelectedSale(data.data);
    } catch (err) {
      setError("Failed to load sale details: " + err.message);
    }
  };

  return (
    <div>
      <h1>Sales</h1>

      <form onSubmit={handleSubmit}>
        <h3>Pick products to sell</h3>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.selling_price}</td>
                <td>{prod.stock}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleAddProduct(prod)}
                    disabled={isAlreadyAdded(prod.id) || prod.stock <= 0}
                  >
                    {prod.stock <= 0
                      ? "Out of stock"
                      : isAlreadyAdded(prod.id)
                      ? "Added"
                      : "Add"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length > 0 && (
          <>
            <h3>Items in this sale</h3>
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td>{item.selling_price}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      {((Number(item.quantity) || 0) * Number(item.selling_price)).toFixed(2)}
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

            <button type="submit">Complete Sale</button>
          </>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Sales History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.created_by}</td>
                <td>{s.sale_date}</td>
                <td>{s.total_amount}</td>
                <td>{s.status}</td>
                <td>
                  <button onClick={() => handleView(s.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSale && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
          <h3>Sale #{selectedSale.id} details</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedSale.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price}</td>
                  <td>{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setSelectedSale(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Sales;