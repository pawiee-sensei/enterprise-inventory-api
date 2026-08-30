import { useState, useEffect } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import { PageHeader } from "../../components/ui/PageHeader";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { ActionMenu, ActionMenuItem } from "../../components/ui/ActionMenu";
import { useToast } from "../../context/ToastContext";
import { SkeletonTable } from "../../components/ui/Skeleton";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // TEMPORARY — remove after testing
    try {
      const data = await getAllCategories();
      setCategories(data.data);
    } catch (err) {
      setError("Failed to load categories: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || "" });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    if (editingId) {
      await updateCategory(editingId, form);
      toast.success("Category updated");
    } else {
      await createCategory(form);
      toast.success("Category created");
    }
    handleCancel();
    loadCategories();
  } catch (err) {
    const message = err.response?.data?.message || "Failed to save category";
    setError(message);
    toast.error(message);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this category?")) return;
  try {
    await deleteCategory(id);
    toast.success("Category deleted");
    loadCategories();
  } catch (err) {
    const message = err.response?.data?.message || "Failed to delete category";
    setError(message);
    toast.error(message);
  }
};

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Categories"
        subtitle="Organize your products into categories"
        action={<Button onClick={handleAddClick}>Add Category</Button>}
      />

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

<Table>
  <TableHead>
    <Th>ID</Th>
    <Th>Name</Th>
    <Th>Description</Th>
    <Th align="right">Actions</Th>
  </TableHead>
  <TableBody>
    {loading ? (
      <SkeletonTable rows={4} columns={4} />
    ) : (
      categories.map((cat) => (
        <Tr key={cat.id}>
          <Td className="font-mono tabular-nums text-text-secondary">#{cat.id}</Td>
          <Td className="font-medium">{cat.name}</Td>
          <Td className="text-text-secondary">{cat.description || "—"}</Td>
          <Td align="right">
            <ActionMenu>
              <ActionMenuItem onClick={() => handleEditClick(cat)}>Edit</ActionMenuItem>
              <ActionMenuItem onClick={() => handleDelete(cat.id)} danger>Delete</ActionMenuItem>
            </ActionMenu>
          </Td>
        </Tr>
      ))
    )}
  </TableBody>
</Table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingId ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Update" : "Add"} Category</Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;