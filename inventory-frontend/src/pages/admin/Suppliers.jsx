import { useState, useEffect } from "react";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../api/supplierApi";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  contact_person: "",
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getAllSuppliers();
      setSuppliers(data.data);
    } catch (err) {
      setError("Failed to load suppliers: " + err.message);
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
        await updateSupplier(editingId, form);
        setEditingId(null);
      } else {
        await createSupplier(form);
      }
      setForm(emptyForm);
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save supplier");
    }
  };

  const handleEditClick = (sup) => {
    setEditingId(sup.id);
    setForm({
      name: sup.name || "",
      email: sup.email || "",
      phone: sup.phone || "",
      address: sup.address || "",
      contact_person: sup.contact_person || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete supplier");
    }
  };

  return (
    <div>
      <h1>Suppliers</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input
          name="contact_person"
          placeholder="Contact person"
          value={form.contact_person}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update Supplier" : "Add Supplier"}</button>
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
              <th>Email</th>
              <th>Phone</th>
              <th>Contact Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup) => (
              <tr key={sup.id}>
                <td>{sup.id}</td>
                <td>{sup.name}</td>
                <td>{sup.email}</td>
                <td>{sup.phone}</td>
                <td>{sup.contact_person}</td>
                <td>
                  <button onClick={() => handleEditClick(sup)}>Edit</button>
                  <button onClick={() => handleDelete(sup.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Suppliers;