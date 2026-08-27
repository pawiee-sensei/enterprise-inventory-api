import { useState, useEffect } from "react";
import { getAllProducts, createProduct, updateProduct, deleteProduct, updateProductAvailability } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";
import { createInventoryAdjustment } from "../../api/adjustmentApi";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Switch } from "../../components/ui/Switch";
import { ActionMenu, ActionMenuItem } from "../../components/ui/ActionMenu";
import { Pagination } from "../../components/ui/Pagination";



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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [adjustingProduct, setAdjustingProduct] = useState(null);
    const [adjustForm, setAdjustForm] = useState({ type: "ADJUSTMENT_IN", quantity: "", reason: "" });

    const [togglingId, setTogglingId] = useState(null); 

    useEffect(() => {
    loadAll();
    }, [page]);

    const loadAll = async () => {
    setLoading(true);
    try {
        const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        getAllProducts({ page, limit: 10 }),
        getAllCategories(),
        getAllSuppliers(),
        ]);
        setProducts(productsRes.data);
        setTotalPages(productsRes.pagination?.totalPages || 1);
        setCategories(categoriesRes.data);
        setSuppliers(suppliersRes.data);
    } catch (err) {
        setError("Failed to load data: " + err.message);
    } finally {
        setLoading(false);
    }
    };

const handleToggleAvailability = async (prod) => {
  setTogglingId(prod.id);
  try {
    const newValue = !prod.is_available_for_sale;
    await updateProductAvailability(prod.id, newValue);

    // update just this one product locally instead of re-fetching everything
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prod.id ? { ...p, is_available_for_sale: newValue } : p
      )
    );
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update availability");
  } finally {
    setTogglingId(null);
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
    setIsModalOpen(false);
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
  setIsModalOpen(true);
};

const handleAddClick = () => {
  setEditingId(null);
  setForm(emptyForm);
  setIsModalOpen(true);
};

const handleCancelEdit = () => {
  setEditingId(null);
  setForm(emptyForm);
  setIsModalOpen(false);
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
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record adjustment");
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <PageHeader
            title="Products"
            subtitle="Manage your product catalog"
            action={<Button onClick={handleAddClick}>Add Product</Button>}
            />

        <Modal
  isOpen={isModalOpen}
  onClose={handleCancelEdit}
  title={editingId ? "Edit Product" : "Add Product"}
>
  <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
    <Input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
    <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
    <Input
      name="description"
      placeholder="Description (optional)"
      value={form.description}
      onChange={handleChange}
      className="sm:col-span-2"
    />
    <Input
      name="cost_price"
      type="number"
      step="0.01"
      placeholder="Cost price"
      value={form.cost_price}
      onChange={handleChange}
    />
    <Input
      name="selling_price"
      type="number"
      step="0.01"
      placeholder="Selling price"
      value={form.selling_price}
      onChange={handleChange}
    />
    <Input
      name="stock"
      type="number"
      placeholder="Stock"
      value={form.stock}
      onChange={handleChange}
      disabled={!!editingId}
      title={editingId ? "Use 'Adjust Stock' to change this" : ""}
    />
    <Input
      name="minimum_stock"
      type="number"
      placeholder="Minimum stock"
      value={form.minimum_stock}
      onChange={handleChange}
    />

    <Select name="category_id" value={form.category_id} onChange={handleChange}>
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </Select>

    <Select name="supplier_id" value={form.supplier_id} onChange={handleChange}>
      <option value="">Select supplier</option>
      {suppliers.map((sup) => (
        <option key={sup.id} value={sup.id}>
          {sup.name}
        </option>
      ))}
    </Select>

    <div className="flex gap-2 sm:col-span-2">
      <Button type="submit">{editingId ? "Update Product" : "Add Product"}</Button>
      <Button type="button" variant="secondary" onClick={handleCancelEdit}>
        Cancel
      </Button>
    </div>
  </form>
</Modal>

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <Th>SKU</Th>
            <Th>Name</Th>
            <Th align="right">Cost</Th>
            <Th align="right">Price</Th>
            <Th align="right">Stock</Th>
            <Th>Status</Th>
            <Th>Category</Th>
            <Th>Supplier</Th>
            <Th>Available</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
  {products.map((prod) => (
    <Tr key={prod.id}>
      <Td className="font-mono tabular-nums text-text-secondary">{prod.sku}</Td>
      <Td className="font-medium">{prod.name}</Td>
      <Td align="right" className="font-mono tabular-nums">{prod.cost_price}</Td>
      <Td align="right" className="font-mono tabular-nums">{prod.selling_price}</Td>
      <Td align="right" className="font-mono tabular-nums">{prod.stock}</Td>
      <Td>
        {prod.stock <= prod.minimum_stock ? (
          <Badge tone="warning">Low Stock</Badge>
        ) : (
          <Badge tone="success">In Stock</Badge>
        )}
      </Td>
      <Td>{prod.category}</Td>
      <Td>{prod.supplier}</Td>
        <Td>
        <Switch
        checked={!!prod.is_available_for_sale}
        onChange={() => handleToggleAvailability(prod)}
        disabled={togglingId === prod.id}
        showLabel
        />
        </Td>
        <Td align="right">
        <ActionMenu>
            <ActionMenuItem onClick={() => handleEditClick(prod)}>Edit</ActionMenuItem>
            <ActionMenuItem onClick={() => handleAdjustClick(prod)}>Adjust Stock</ActionMenuItem>
            <ActionMenuItem onClick={() => handleDelete(prod.id)} danger>Delete</ActionMenuItem>
        </ActionMenu>
        </Td>
    </Tr>
  ))}
</TableBody>
        </Table>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

<Modal
  isOpen={!!adjustingProduct}
  onClose={() => setAdjustingProduct(null)}
  title={adjustingProduct ? `Adjust Stock — ${adjustingProduct.name}` : ""}
>
  {adjustingProduct && (
    <>
      <p className="mb-4 text-sm text-text-secondary">
        Current stock: <span className="font-mono tabular-nums text-text-primary">{adjustingProduct.stock}</span>
      </p>
      <form onSubmit={handleAdjustSubmit} className="flex flex-col gap-3">
        <Select name="type" value={adjustForm.type} onChange={handleAdjustChange}>
          <option value="ADJUSTMENT_IN">Add stock (found/correction up)</option>
          <option value="ADJUSTMENT_OUT">Remove stock (damage/loss/correction down)</option>
        </Select>
        <Input
          name="quantity"
          type="number"
          min="1"
          placeholder="Quantity"
          value={adjustForm.quantity}
          onChange={handleAdjustChange}
          required
        />
        <Input
          name="reason"
          placeholder="Reason (required)"
          value={adjustForm.reason}
          onChange={handleAdjustChange}
          required
        />
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="secondary" onClick={() => setAdjustingProduct(null)}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  )}
</Modal>
    </div>
  );
}

export default Products;