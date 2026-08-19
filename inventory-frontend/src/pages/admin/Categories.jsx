import { useState, useEffect } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";

    function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "" });
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    // fetch all categories when the page first loads
    useEffect(() => {
        loadCategories();
    }, []);

    // fetch all categories
    const loadCategories = async () => {
        setLoading(true);

        
    try {
        const data = await getAllCategories();
        setCategories(data.data); // backend wraps the array inside { data: [...] }
        } catch (err) {
        setError("Failed to load categories: " + err.message);
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
            if (editingId) {
            await updateCategory(editingId, form);
            setEditingId(null);
            } else {
            await createCategory(form);
            }
            setForm({ name: "", description: "" });
            loadCategories();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save category");
        }
    };

    const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete category: ${name}?`);
    if (!confirmed) return;

    try {
        await deleteCategory(id);
        loadCategories();
    } catch (err) {
        setError(err.response?.data?.message || "Failed to delete category");
    }
    };

    const handleEditClick = (cat) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, description: cat.description || "" });
        };

        const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
        };

    return (
        <div>
        <h1>Categories</h1>

        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Category name"
                value={form.name}
                onChange={handleChange}
            />
            <input
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleChange}
            />

            <button type="submit">{editingId ? "Update Category" : "Add Category"}</button>

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
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((cat) => (
                <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>
                    <td>
                        <td>
                        <button onClick={() => handleEditClick(cat)}>Edit</button>
                        <button onClick={() => handleDelete(cat.id, cat.name)}>Delete</button>
                        </td>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
    }

    export default Categories;