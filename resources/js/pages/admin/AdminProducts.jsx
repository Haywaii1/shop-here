import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ PAGE DETECTION
  const isDealsPage =
    location.pathname === "/admin/deals";

  const searchParams =
    new URLSearchParams(location.search);

  const isLowStockPage =
    searchParams.get("filter") === "low_stock";

  // 🔐 PROTECT ROUTE
  useEffect(() => {

    if (!token) {
      navigate("/admin/login");
    }

  }, [token, navigate]);

  // 📦 FETCH PRODUCTS
  const fetchProducts = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/products",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();

      let data = {};

      try {

        data = text ? JSON.parse(text) : {};

      } catch (err) {

        console.error("Non-JSON response:", text);

        alert("Server error");

        return;

      }

      if (!res.ok) {

        console.error("Error:", data);

        alert(
          data.message || "Failed to load products"
        );

        return;

      }

      const allProducts = Array.isArray(data)
        ? data
        : data.products || [];

      let filteredProducts = allProducts;

      // 🔥 DEAL PRODUCTS
      if (isDealsPage) {

        filteredProducts = allProducts.filter(
          product => product.is_deal
        );

      }

      // ⚠️ LOW STOCK PRODUCTS
      if (isLowStockPage) {

        filteredProducts = allProducts.filter(
          product => {

            // variants stock
            if (product.variants?.length > 0) {

              const totalVariantStock =
                product.variants.reduce(
                  (sum, variant) =>
                    sum +
                    Number(variant.stock || 0),
                  0
                );

              return totalVariantStock < 3;

            }

            // normal stock
            return Number(product.stock || 0) < 3;

          }
        );

      }

      setProducts(filteredProducts);

    } catch (error) {

      console.error("Fetch error:", error);

      alert("Network error");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, [isDealsPage, isLowStockPage]);

  // 🗑 DELETE PRODUCT
  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {

        alert("Failed to delete product");

        return;

      }

      fetchProducts();

    } catch (error) {

      console.error("Delete error:", error);

    }

  };

  // 🔥 TOGGLE DEAL
  const toggleDeal = async (product) => {

    try {

      let percentage = null;

      let durationHours = 24;

      // adding deal
      if (!product.is_deal) {

        percentage = prompt(
          "Enter discount percentage"
        );

        if (!percentage) return;

        const durationInput = prompt(
          "Enter deal duration in hours",
          "24"
        );

        if (durationInput === null) return;

        durationHours = Number(durationInput);

        if (
          !Number.isInteger(durationHours) ||
          durationHours < 1
        ) {

          alert(
            "Duration must be at least 1 hour"
          );

          return;

        }

      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/products/${product.id}/toggle-deal`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            deal_percentage: percentage,
            duration_hours: durationHours
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(data.message || "Failed");

        return;

      }

      fetchProducts();

    } catch (err) {

      console.error(err);

      alert("Network error");

    }

  };

  if (loading) {

    return (
      <div className="text-center mt-5">
        Loading products...
      </div>
    );

  }

  return (

    <div className="container">

      {/* PAGE TITLE */}
      <h3 className="my-4">

        {isDealsPage
          ? "Deals of the Day"
          : isLowStockPage
            ? "Low Stock Products"
            : "Products"}

      </h3>

      {/* ADD PRODUCT */}
      {!isDealsPage && !isLowStockPage && (

        <Link
          to="/admin/products/create"
          className="btn btn-primary mb-3"
        >
          Add Product
        </Link>

      )}

      {/* PRODUCTS TABLE */}
      <table className="table table-bordered">

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center"
              >

                {isDealsPage
                  ? "No active deals found"
                  : isLowStockPage
                    ? "No low stock products found"
                    : "No products found"}

              </td>

            </tr>

          ) : (

            products.map(product => {

              const totalStock =
                product.variants?.length > 0
                  ? product.variants.reduce(
                    (sum, variant) =>
                      sum +
                      Number(
                        variant.stock || 0
                      ),
                    0
                  )
                  : Number(product.stock || 0);

              return (

                <tr key={product.id}>

                  <td>{product.id}</td>

                  <td>{product.name}</td>

                  <td>
                    ₦{Number(product.price).toLocaleString()}
                  </td>

                  <td>
                    {product.category?.name || "-"}
                  </td>

                  {/* STOCK */}
                  <td>

                    <span
                      className={`badge ${totalStock < 3
                          ? "bg-danger"
                          : "bg-success"
                        }`}
                    >

                      {totalStock}

                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td>

                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/admin/products/${product.id}/variants`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Variants
                    </Link>

                    {/* DEAL BUTTON */}
                    <button
                      className={`btn btn-sm me-2 ${product.is_deal
                          ? "btn-danger"
                          : "btn-outline-primary"
                        }`}
                      onClick={() =>
                        toggleDeal(product)
                      }
                    >

                      {product.is_deal
                        ? "Remove Deal"
                        : "Add Deal"}

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              );

            })

          )}

        </tbody>

      </table>

    </div>

  );

}