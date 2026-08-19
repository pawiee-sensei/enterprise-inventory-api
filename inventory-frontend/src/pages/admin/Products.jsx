import { useState, useEffect } from "react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";

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
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        </div>
    );
}

export default Products;