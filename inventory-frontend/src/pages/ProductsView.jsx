import { useState, useEffect } from "react";
import { getAllProducts } from "../api/productApi";

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
    <div>
      <h1>Products</h1>

      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Selling Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr
                key={prod.id}
                style={prod.stock <= prod.minimum_stock ? { background: "#fdd" } : {}}
              >
                <td>{prod.sku}</td>
                <td>{prod.name}</td>
                <td>{prod.category}</td>
                <td>{prod.supplier}</td>
                <td>{prod.selling_price}</td>
                <td>{prod.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductsView;