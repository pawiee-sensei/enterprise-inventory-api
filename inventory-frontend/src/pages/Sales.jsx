import { useState, useEffect, useMemo } from "react";
import {
  getAllSales,
  getSaleById,
  createSale,
  createSaleReturn,
  getTopSellingProducts,
} from "../api/saleApi";
import { getAllProducts } from "../api/productApi";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader } from "../components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { formatDate } from "../utils/formatDate";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  addDays,
  addMonths,
  percentChange,
  sumSalesInRange,
} from "../utils/dateHelpers";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Pagination } from "../components/ui/Pagination";

function Trend({ value }) {
  const isUp = value >= 0;
  return (
    <span className={`text-xs font-medium ${isUp ? "text-success" : "text-danger"}`}>
      {isUp ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const [selectedSale, setSelectedSale] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnQuantities, setReturnQuantities] = useState({});
  
  const [allSales, setAllSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAll();
  }, [page]);

const loadAll = async () => {
  setLoading(true);
  try {
    const [salesRes, allSalesRes, productsRes, topRes] = await Promise.all([
      getAllSales({ page, limit: 10 }),
      getAllSales(),
      getAllProducts(),
      getTopSellingProducts(5),
    ]);
    setSales(salesRes.data);
    setTotalPages(salesRes.pagination?.totalPages || 1);
    setAllSales(allSalesRes.data);
    setProducts(productsRes.data);
    setTopProducts(topRes.data);
  } catch (err) {
    setError("Failed to load data: " + err.message);
  } finally {
    setLoading(false);
  }
};

  // ---- insights, computed from the sales already in state ----
  const insights = useMemo(() => {
    const now = new Date();

    const todayStart = startOfDay(now);
    const yesterdayStart = addDays(todayStart, -1);

    const weekStart = startOfWeek(now);
    const lastWeekStart = addDays(weekStart, -7);

    const monthStart = startOfMonth(now);
    const lastMonthStart = addMonths(monthStart, -1);
    const nextMonthStart = addMonths(monthStart, 1);

    const today = sumSalesInRange(allSales, todayStart, addDays(todayStart, 1));
    const yesterday = sumSalesInRange(allSales, yesterdayStart, todayStart);

    const week = sumSalesInRange(allSales, weekStart, addDays(weekStart, 7));
    const lastWeek = sumSalesInRange(allSales, lastWeekStart, weekStart);

    const month = sumSalesInRange(allSales, monthStart, nextMonthStart);
    const lastMonth = sumSalesInRange(allSales, lastMonthStart, monthStart);

    return {
      today: { ...today, change: percentChange(today.revenue, yesterday.revenue) },
      week: { ...week, change: percentChange(week.revenue, lastWeek.revenue) },
      month: { ...month, change: percentChange(month.revenue, lastMonth.revenue) },
    };
  }, [allSales]);

  // ---- last 7 days revenue, for the trend chart ----
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const day = addDays(startOfDay(new Date()), -i);
      const { revenue } = sumSalesInRange(sales, day, addDays(day, 1));
      days.push({
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: Number(revenue.toFixed(2)),
      });
    }
    return days;
  }, [sales]);

  const isAlreadyAdded = (productId) => items.some((item) => item.product_id === productId);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (prod) => {
    if (isAlreadyAdded(prod.id) || prod.stock <= 0 || !prod.is_available_for_sale) return;

    
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

  const cartTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * Number(item.selling_price || 0),
    0
  );

  const handleSubmitSale = async (e) => {
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
      setIsSaleModalOpen(false);
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

  const handleReturnQuantityChange = (itemId, value) => {
    setReturnQuantities({ ...returnQuantities, [itemId]: value });
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    setError("");
    const returnItems = selectedSale.items
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
      await createSaleReturn(selectedSale.id, { reason: returnReason, items: returnItems });
      setReturnReason("");
      setReturnQuantities({});
      setSelectedSale(null);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create return");
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Sales"
        subtitle="Track performance and record new sales"
        action={<Button onClick={() => setIsSaleModalOpen(true)}>New Sale</Button>}
      />

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

      {/* Period insight cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Today", data: insights.today },
          { label: "This Week", data: insights.week },
          { label: "This Month", data: insights.month },
        ].map(({ label, data }) => (
          <Card key={label}>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="font-mono text-2xl font-semibold tabular-nums text-text-primary">
                {data.revenue.toFixed(2)}
              </p>
              <Trend value={data.change} />
            </div>
            <p className="mt-1 text-xs text-text-secondary">{data.count} sale{data.count !== 1 ? "s" : ""}</p>
          </Card>
        ))}
      </section>

      {/* Trend chart + top products */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue — last 7 days" />
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E1" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Products" />
          <ul className="space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-text-secondary">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
                <span className="font-mono tabular-nums text-text-secondary">
                  {p.total_quantity} sold
                </span>
              </li>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-text-secondary">No sales data yet.</p>
            )}
          </ul>
        </Card>
      </section>

      {/* Sales history */}
      {loading ? (
        <p className="text-sm text-text-secondary">Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <Th>ID</Th>
            <Th>Created By</Th>
            <Th>Date</Th>
            <Th align="right">Total</Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {sales.map((s) => (
              <Tr key={s.id}>
                <Td className="font-mono tabular-nums text-text-secondary">#{s.id}</Td>
                <Td>{s.created_by}</Td>
                <Td className="text-text-secondary">{formatDate(s.sale_date)}</Td>
                <Td align="right" className="font-mono tabular-nums">{s.total_amount}</Td>
                <Td><Badge tone="success">{s.status}</Badge></Td>
                <Td align="right">
                  <Button variant="secondary" onClick={() => handleView(s.id)}>View</Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}

      {/* New Sale modal */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="New Sale"
      >
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
              <Th align="right">Price</Th>
              <Th align="right">Stock</Th>
              <Th align="right">Action</Th>
            </TableHead>
            <TableBody>
              {filteredProducts.map((prod) => (
                <Tr key={prod.id}>
                  <Td>{prod.name}</Td>
                  <Td align="right" className="font-mono tabular-nums">{prod.selling_price}</Td>
                  <Td align="right" className="font-mono tabular-nums">{prod.stock}</Td>
                  <Td align="right">
                  <Button
                    variant="secondary"
                    onClick={() => handleAddProduct(prod)}
                    disabled={isAlreadyAdded(prod.id) || prod.stock <= 0 || !prod.is_available_for_sale}
                  >
                    {!prod.is_available_for_sale
                      ? "Unavailable"
                      : prod.stock <= 0
                      ? "Out of stock"
                      : isAlreadyAdded(prod.id)
                      ? "Added"
                      : "Add"}
                  </Button>
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {items.length > 0 && (
          <form onSubmit={handleSubmitSale} className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Items in this sale</h3>
            <Table>
              <TableHead>
                <Th>Product</Th>
                <Th align="right">Price</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Subtotal</Th>
                <Th align="right">Action</Th>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <Tr key={item.product_id}>
                    <Td>{item.product_name}</Td>
                    <Td align="right" className="font-mono tabular-nums">{item.selling_price}</Td>
                    <Td align="right">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-20 text-right"
                        required
                      />
                    </Td>
                    <Td align="right" className="font-mono tabular-nums">
                      {((Number(item.quantity) || 0) * Number(item.selling_price)).toFixed(2)}
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
                Total: {cartTotal.toFixed(2)}
              </p>
              <Button type="submit">Complete Sale</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Sale details modal */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={selectedSale ? `Sale #${selectedSale.id}` : ""}
      >
        {selectedSale && (
          <>
            <Table>
              <TableHead>
                <Th>Product</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Price</Th>
                <Th align="right">Returned</Th>
                <Th align="right">Remaining</Th>
                <Th align="right">Return Qty</Th>
              </TableHead>
              <TableBody>
                {selectedSale.items.map((item) => {
                  const remaining = item.quantity - item.returned_quantity;
                  return (
                    <Tr key={item.id}>
                      <Td>{item.product}</Td>
                      <Td align="right" className="font-mono tabular-nums">{item.quantity}</Td>
                      <Td align="right" className="font-mono tabular-nums">{item.unit_price}</Td>
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

export default Sales;