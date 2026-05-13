import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";

export default function DealsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/deals")
      .then(res => res.json())
      .then(data => {

        // ✅ API already returns deals only
        setProducts(data);

      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  return (

    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            Deals & Discounts
          </h2>

          <p className="text-muted mb-0">
            Products currently on sale
          </p>

        </div>

        <span className="badge bg-danger fs-6">
          {products.length} Deals
        </span>

      </div>

      {loading ? (

        <div className="text-center py-5">
          Loading deals...
        </div>

      ) : products.length === 0 ? (

        <div className="text-center py-5">

          <h5>No active deals available</h5>

          <p className="text-muted">
            Check back later for discounts.
          </p>

        </div>

      ) : (

        <ProductGrid products={products} />

      )}

    </div>

  );

}