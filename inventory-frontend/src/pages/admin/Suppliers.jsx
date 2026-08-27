import { useState, useEffect } from "react";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../api/supplierApi";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { ActionMenu, ActionMenuItem } from "../../components/ui/ActionMenu";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddClick = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateSupplier(editingId, form);
      } else {
        await createSupplier(form);
      }
      handleCancel();
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save supplier");
    }
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
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Suppliers"
        subtitle="Manage the businesses you purchase from"
        action={<Button onClick={handleAddClick}>Add Supplier</Button>}
      />

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Contact Person</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {suppliers.map((sup) => (
              <Tr key={sup.id}>
                <Td className="font-mono tabular-nums text-text-secondary">#{sup.id}</Td>
                <Td className="font-medium">{sup.name}</Td>
                <Td className="text-text-secondary">{sup.email || "—"}</Td>
                <Td className="text-text-secondary">{sup.phone || "—"}</Td>
                <Td>{sup.contact_person || "—"}</Td>
                <Td align="right">
                  <ActionMenu>
                    <ActionMenuItem onClick={() => handleEditClick(sup)}>Edit</ActionMenuItem>
                    <ActionMenuItem onClick={() => handleDelete(sup.id)} danger>Delete</ActionMenuItem>
                  </ActionMenu>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingId ? "Edit Supplier" : "Add Supplier"}
      >
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <Input
            name="contact_person"
            placeholder="Contact person"
            value={form.contact_person}
            onChange={handleChange}
          />
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="sm:col-span-2"
          />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">{editingId ? "Update" : "Add"} Supplier</Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Suppliers;