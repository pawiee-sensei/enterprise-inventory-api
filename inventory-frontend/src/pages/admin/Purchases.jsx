import { useState, useEffect } from "react";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  getProductsPurchasedFromSupplier,
  createPurchaseReturn,
} from "../../api/purchaseApi";
import { getAllSuppliers } from "../../api/supplierApi";
import { getAllProducts } from "../../api/productApi";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatDate } from "../../utils/formatDate";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [historyProducts, setHistoryProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnQuantities, setReturnQuantities] = useState({});

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
  const isAlreadyAdded = (productId) => items.some((item) => item.product_id === productId);
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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

  const resetPurchaseForm = () => {
    setSupplierId("");
    setItems([]);
    setSearch("");
    setIsPurchaseModalOpen(false);
  };

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
      resetPurchaseForm();
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

  const handleReturnQuantityChange = (itemId, value) => {
    setReturnQuantities({ ...returnQuantities, [itemId]: value });
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    setError("");
    const returnItems = selectedPurchase.items
      .filter((item) => Number(returnQuantities[item.id]) > 0)
      .map((item) => ({
        product_id: item.product_id,
        quantity: Number(returnQuantities[item.id]),
      }));

    if (returnItems.length === 0) {
      setError("Enter a quantity for at least one item to return");
      return;
    }

    try {
      await createPurchaseReturn(selectedPurchase.id, { reason: returnReason, items: returnItems });
      setReturnReason("");
      setReturnQuantities({});
      setSelectedPurchase(null);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create return");
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Purchases"
        subtitle="Record incoming stock from suppliers"
        action={<Button onClick={() => setIsPurchaseModalOpen(true)}>New Purchase</Button>}
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
            <Th>Supplier</Th>
            <Th>Created By</Th>
            <Th>Date</Th>
            <Th align="right">Total</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {purchases.map((p) => (
              <Tr key={p.id}>
                <Td className="font-mono tabular-nums text-text-secondary">#{p.id}</Td>
                <Td className="font-medium">{p.supplier}</Td>
                <Td>{p.created_by}</Td>
                <Td className="text-text-secondary">{formatDate(p.purchase_date)}</Td>
                <Td align="right" className="font-mono tabular-nums">{p.total_amount}</Td>
                <Td><Badge tone="success">{p.status}</Badge></Td>
                <Td align="right">
                  <Button variant="secondary" onClick={() => handleView(p.id)}>View</Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}

      {/* New Purchase modal */}
      <Modal isOpen={isPurchaseModalOpen} onClose={resetPurchaseForm} title="New Purchase" size="xl">
        <Select
          value={supplierId}
          onChange={(e) => {
            setSupplierId(e.target.value);
            setItems([]);
          }}
          className="mb-4 w-full"
          required
        >
          <option value="">Select supplier</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </Select>

        {supplierId && (
          <>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 w-full"
            />

            <div className="max-h-48 overflow-y-auto rounded-md border border-border">
              <Table>
                <TableHead>
                  <Th>Product</Th>
                  <Th align="right">Cost Price</Th>
                  <Th align="right">Stock</Th>
                  <Th>Source</Th>
                  <Th align="right">Action</Th>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((prod) => (
                    <Tr key={prod.id}>
                      <Td>{prod.name}</Td>
                      <Td align="right" className="font-mono tabular-nums">{prod.cost_price}</Td>
                      <Td align="right" className="font-mono tabular-nums">{prod.stock}</Td>
                      <Td>
                        {historyIds.includes(prod.id) && (
                          <Badge tone="neutral">Previously purchased</Badge>
                        )}
                      </Td>
                      <Td align="right">
                        <Button
                          variant="secondary"
                          onClick={() => handleAddProduct(prod)}
                          disabled={isAlreadyAdded(prod.id)}
                        >
                          {isAlreadyAdded(prod.id) ? "Added" : "Add"}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {items.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Items in this purchase</h3>
            <Table>
              <TableHead>
                <Th>Product</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Unit Cost</Th>
                <Th align="right">Subtotal</Th>
                <Th align="right">Action</Th>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <Tr key={item.product_id}>
                    <Td>{item.product_name}</Td>
                    <Td align="right">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemFieldChange(index, "quantity", e.target.value)}
                        className="w-20 text-right"
                        required
                      />
                    </Td>
                    <Td align="right">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) => handleItemFieldChange(index, "unit_cost", e.target.value)}
                        className="w-24 text-right"
                        required
                      />
                    </Td>
                    <Td align="right" className="font-mono tabular-nums">
                      {((Number(item.quantity) || 0) * (Number(item.unit_cost) || 0)).toFixed(2)}
                    </Td>
                    <Td align="right">
                      <Button type="button" variant="danger" onClick={() => removeItemRow(index)}>
                        Remove
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </Table>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-mono text-lg font-semibold tabular-nums">
                Total: {total.toFixed(2)}
              </p>
              <Button type="submit">Create Purchase</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Purchase details modal */}
      <Modal
        isOpen={!!selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        title={selectedPurchase ? `Purchase #${selectedPurchase.id}` : ""}
        size="xl"
      >
        {selectedPurchase && (
          <>
            <Table>
              <TableHead>
                <Th>Product</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Cost</Th>
                <Th align="right">Returned</Th>
                <Th align="right">Remaining</Th>
                <Th align="right">Return Qty</Th>
              </TableHead>
              <TableBody>
                {selectedPurchase.items.map((item) => {
                  const remaining = item.quantity - item.returned_quantity;
                  return (
                    <Tr key={item.id}>
                      <Td>{item.product}</Td>
                      <Td align="right" className="font-mono tabular-nums">{item.quantity}</Td>
                      <Td align="right" className="font-mono tabular-nums">{item.unit_cost}</Td>
                      <Td align="right" className="font-mono tabular-nums">{item.returned_quantity}</Td>
                      <Td align="right" className="font-mono tabular-nums">{remaining}</Td>
                      <Td align="right">
                        <Input
                          type="number"
                          min="0"
                          max={remaining}
                          value={returnQuantities[item.id] || ""}
                          onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                          className="w-20 text-right"
                          disabled={remaining <= 0}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </TableBody>
            </Table>

            <form onSubmit={handleSubmitReturn} className="mt-4 flex gap-2">
              <Input
                placeholder="Reason for return"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit">Submit Return</Button>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Purchases;