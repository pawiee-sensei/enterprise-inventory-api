import { useState, useEffect } from "react";
import {
  getAllInventory,
  getLowStockInventory,
  getInventorySummary,
  getAllInventoryLogs,
} from "../api/inventoryApi";
import { formatDate } from "../utils/formatDate";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../components/ui/Table";
import { Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Pagination } from "../components/ui/Pagination";
import { Package, AlertTriangle, Boxes, PackageX } from "lucide-react";

function Inventory() {
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // full list, only for the logs filter dropdown
  const [lowStock, setLowStock] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [invPage, setInvPage] = useState(1);
  const [invTotalPages, setInvTotalPages] = useState(1);

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logProductFilter, setLogProductFilter] = useState("");
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    loadAll();
  }, [invPage]);

  useEffect(() => {
    loadLogs();
  }, [logsPage, logProductFilter]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, inventoryRes, allProductsRes, lowStockRes] = await Promise.all([
        getInventorySummary(),
        getAllInventory({ page: invPage, limit: 10 }),
        getAllInventory(),
        getLowStockInventory(),
      ]);
      setSummary(summaryRes.data);
      setInventory(inventoryRes.data);
      setInvTotalPages(inventoryRes.pagination?.totalPages || 1);
      setAllProducts(allProductsRes.data);
      setLowStock(lowStockRes.data);
    } catch (err) {
      setError("Failed to load inventory: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await getAllInventoryLogs({
        page: logsPage,
        limit: logsPerPage,
        productId: logProductFilter,
      });
      setLogs(data.data);
      setLogsTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load logs: " + err.message);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleFilterChange = (productId) => {
    setLogProductFilter(productId);
    setLogsPage(1);
  };

  const rowsToShow = showLowStockOnly ? lowStock : inventory;

  const movementTone = (type) => {
    if (type === "PURCHASE" || type === "ADJUSTMENT_IN" || type === "SALE_RETURN") return "success";
    if (type === "SALE" || type === "ADJUSTMENT_OUT" || type === "PURCHASE_RETURN") return "danger";
    return "neutral";
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader title="Inventory" subtitle="Stock levels and movement history" />

      {error && (
        <p className="rounded-md bg-danger-bg px-4 py-2 text-sm text-danger">{error}</p>
      )}

      {summary && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface text-text-secondary">
                <Package size={18} />
              </span>
              <p className="text-sm font-medium text-text-secondary">Total Products</p>
            </div>
            <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">{summary.total_products}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface text-text-secondary">
                <Boxes size={18} />
              </span>
              <p className="text-sm font-medium text-text-secondary">Total Stock</p>
            </div>
            <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">{summary.total_stock}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-md ${summary.low_stock_products > 0 ? "bg-warning-bg text-warning" : "bg-success-bg text-success"}`}>
                <AlertTriangle size={18} />
              </span>
              <p className="text-sm font-medium text-text-secondary">Low Stock</p>
            </div>
            <p className={`mt-4 font-mono text-3xl font-semibold tabular-nums ${summary.low_stock_products > 0 ? "text-warning" : "text-success"}`}>
              {summary.low_stock_products}
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-md ${summary.out_of_stock_products > 0 ? "bg-danger-bg text-danger" : "bg-success-bg text-success"}`}>
                <PackageX size={18} />
              </span>
              <p className="text-sm font-medium text-text-secondary">Out of Stock</p>
            </div>
            <p className={`mt-4 font-mono text-3xl font-semibold tabular-nums ${summary.out_of_stock_products > 0 ? "text-danger" : "text-success"}`}>
              {summary.out_of_stock_products}
            </p>
          </Card>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Products</h2>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-navy"
            />
            Show low-stock items only
          </label>
        </div>

        {loading && inventory.length === 0 ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : (
          <>
            <Table>
              <TableHead>
                <Th>SKU</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Supplier</Th>
                <Th align="right">Stock</Th>
                <Th align="right">Minimum</Th>
                <Th>Status</Th>
              </TableHead>
              <TableBody>
                {rowsToShow.map((item) => (
                  <Tr key={item.id}>
                    <Td className="font-mono tabular-nums text-text-secondary">{item.sku}</Td>
                    <Td className="font-medium">{item.name}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.supplier}</Td>
                    <Td align="right" className="font-mono tabular-nums">{item.stock}</Td>
                    <Td align="right" className="font-mono tabular-nums text-text-secondary">
                      {item.minimum_stock}
                    </Td>
                    <Td>
                      {item.stock <= item.minimum_stock ? (
                        <Badge tone="warning">Low Stock</Badge>
                      ) : (
                        <Badge tone="success">In Stock</Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </Table>

            {!showLowStockOnly && (
              <Pagination page={invPage} totalPages={invTotalPages} onPageChange={setInvPage} />
            )}
          </>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Stock Movement Logs</h2>
          <Select
            value={logProductFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-56"
          >
            <option value="">All products</option>
            {allProducts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        {logsLoading && logs.length === 0 ? (
          <p className="text-sm text-text-secondary">Loading logs...</p>
        ) : (
          <>
            <Table>
              <TableHead>
                <Th>Product</Th>
                <Th>Type</Th>
                <Th align="right">Qty</Th>
                <Th align="right">Prev</Th>
                <Th align="right">New</Th>
                <Th>Reference</Th>
                <Th>By</Th>
                <Th>Remarks</Th>
                <Th>Date</Th>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <Tr key={log.id}>
                    <Td className="font-medium">{log.product_name}</Td>
                    <Td>
                      <Badge tone={movementTone(log.movement_type)}>{log.movement_type}</Badge>
                    </Td>
                    <Td align="right" className="font-mono tabular-nums">{log.quantity}</Td>
                    <Td align="right" className="font-mono tabular-nums text-text-secondary">{log.previous_stock}</Td>
                    <Td align="right" className="font-mono tabular-nums">{log.new_stock}</Td>
                    <Td className="text-text-secondary">{log.reference_type}</Td>
                    <Td>{log.user_name}</Td>
                    <Td className="text-text-secondary">{log.remarks}</Td>
                    <Td className="text-text-secondary">{formatDate(log.created_at)}</Td>
                  </Tr>
                ))}
              </TableBody>
            </Table>

            <Pagination page={logsPage} totalPages={logsTotalPages} onPageChange={setLogsPage} />
          </>
        )}
      </section>
    </div>
  );
}

export default Inventory;