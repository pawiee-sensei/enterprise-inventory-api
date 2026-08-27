import { useState, useEffect } from "react";
import { getAllProducts } from "../api/productApi";
import { PageHeader } from "../components/ui/PageHeader";
import { Table, TableHead, Th, TableBody, Tr, Td } from "../components/ui/Table";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";

function ProductsView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data.data);
    } catch (err) {
      setError("Failed to load products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader title="Products" subtitle="Browse the product catalog" />

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-80"
      />

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
            <Th>Category</Th>
            <Th>Supplier</Th>
            <Th align="right">Price</Th>
            <Th align="right">Stock</Th>
            <Th>Status</Th>
          </TableHead>
          <TableBody>
            {filteredProducts.map((prod) => (
              <Tr key={prod.id}>
                <Td className="font-mono tabular-nums text-text-secondary">{prod.sku}</Td>
                <Td className="font-medium">{prod.name}</Td>
                <Td>{prod.category}</Td>
                <Td>{prod.supplier}</Td>
                <Td align="right" className="font-mono tabular-nums">{prod.selling_price}</Td>
                <Td align="right" className="font-mono tabular-nums">{prod.stock}</Td>
                <Td>
                  {!prod.is_available_for_sale ? (
                    <Badge tone="neutral">Unavailable</Badge>
                  ) : prod.stock <= prod.minimum_stock ? (
                    <Badge tone="warning">Low Stock</Badge>
                  ) : (
                    <Badge tone="success">In Stock</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ProductsView;