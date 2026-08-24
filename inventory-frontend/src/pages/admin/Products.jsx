import { useState, useEffect } from "react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";

import { createInventoryAdjustment } from "../../api/adjustmentApi";

const emptyForm = {
    sku: "",
    name: "",
    description: "",
    cost_price: "",
    selling_price: "",
    stock: "",
    minimum_stock: "",
    category_id: "",
    supplier_id: "",
};

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [adjustingProduct, setAdjustingProduct] = useState(null);
    const [adjustForm, setAdjustForm] = useState({ type: "ADJUSTMENT_IN", quantity: "", reason: "" });

    useEffect(() => {
        loadAll();
    }, []);

  // fetch products, categories, AND suppliers together
    const loadAll = async () => {
    setLoading(true);
        try {
        const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
            getAllProducts(),
            getAllCategories(),
            getAllSuppliers(),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSuppliers(suppliersRes.data);
        } catch (err) {
        setError("Failed to load data: " + err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleAdjustClick = (prod) => {
  setAdjustingProduct(prod);
  setAdjustForm({ type: "ADJUSTMENT_IN", quantity: "", reason: "" });
};

const handleAdjustChange = (e) => {
  setAdjustForm({ ...adjustForm, [e.target.name]: e.target.value });
};

const handleAdjustSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    await createInventoryAdjustment({
      product_id: adjustingProduct.id,
      type: adjustForm.type,
      quantity: Number(adjustForm.quantity),
      reason: adjustForm.reason,
    });
    setAdjustingProduct(null);
    loadAll(); // refresh product list to show updated stock
  } catch (err) {
    setError(err.response?.data?.message || "Failed to record adjustment");
  }
};

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const payload = { ...form, is_active: 1 };
        if (editingId) {
        await updateProduct(editingId, payload);
        setEditingId(null);
        } else {
        await createProduct(payload);
        }
        setForm(emptyForm);
        loadAll();
    } catch (err) {
        setError(err.response?.data?.message || "Failed to save product");
    }
    };

    const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setForm({
        sku: prod.sku || "",
        name: prod.name || "",
        description: prod.description || "",
        cost_price: prod.cost_price || "",
        selling_price: prod.selling_price || "",
        stock: prod.stock || "",
        minimum_stock: prod.minimum_stock || "",
        category_id: prod.category_id || "",
        supplier_id: prod.supplier_id || "",
    });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
        await deleteProduct(id);
        loadAll();
        } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
        }
    };



    return (
        <div>
        <h1>Products</h1>

        <form onSubmit={handleSubmit}>
            <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleChange}
            />
            <input
            name="cost_price"
            type="number"
            step="0.01"
            placeholder="Cost price"
            value={form.cost_price}
            onChange={handleChange}
            />
            <input
            name="selling_price"
            type="number"
            step="0.01"
            placeholder="Selling price"
            value={form.selling_price}
            onChange={handleChange}
            />
            <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            disabled={!!editingId}
            title={editingId ? "Use 'Adjust Stock' to change this" : ""}
            />
            <input
            name="minimum_stock"
            type="number"
            placeholder="Minimum stock"
            value={form.minimum_stock}
            onChange={handleChange}
            />

            <select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.name}
                </option>
            ))}
            </select>

            <select name="supplier_id" value={form.supplier_id} onChange={handleChange}>
            <option value="">Select supplier</option>
            {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                {sup.name}
                </option>
            ))}
            </select>

            <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
            {editingId && (
            <button type="button" onClick={handleCancelEdit}>
                Cancel
            </button>
            )}
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
            <p>Loading...</p>
        ) : (
            <table border="1" cellPadding="8">
            <thead>
                <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Actions</th>
                </tr>
            </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id}>
                        <td>{prod.sku}</td>
                        <td>{prod.name}</td>
                        <td>{prod.cost_price}</td>
                        <td>{prod.selling_price}</td>
                        <td>{prod.stock}</td>
                        <td>{prod.category}</td>
                        <td>{prod.supplier}</td>
                            <td>
                            <button onClick={() => handleEditClick(prod)}>Edit</button>
                            <button onClick={() => handleDelete(prod.id)}>Delete</button>
                            <button onClick={() => handleAdjustClick(prod)}>Adjust Stock</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

                {adjustingProduct && (
  <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
    <h3>Adjust stock — {adjustingProduct.name} (current: {adjustingProduct.stock})</h3>
    <form onSubmit={handleAdjustSubmit}>
      <select name="type" value={adjustForm.type} onChange={handleAdjustChange}>
        <option value="ADJUSTMENT_IN">Add stock (found/correction up)</option>
        <option value="ADJUSTMENT_OUT">Remove stock (damage/loss/correction down)</option>
      </select>

      <input
        name="quantity"
        type="number"
        min="1"
        placeholder="Quantity"
        value={adjustForm.quantity}
        onChange={handleAdjustChange}
        required
      />

      <input
        name="reason"
        placeholder="Reason (required)"
        value={adjustForm.reason}
        onChange={handleAdjustChange}
        required
      />

      <button type="submit">Submit Adjustment</button>
      <button type="button" onClick={() => setAdjustingProduct(null)}>
        Cancel
      </button>
    </form>
  </div>
)}

            </table>
        )}
        </div>
    );
}

export default Products;