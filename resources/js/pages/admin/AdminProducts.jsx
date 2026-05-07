import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token");
  const navigate = useNavigate();
  const location = useLocation();
  const isDealsPage = location.pathname === "/admin/deals";

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/products", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
        alert(data.message || "Failed to load products");
        return;
      }

      const allProducts = Array.isArray(data) ? data : data.products || [];

      setProducts(
        isDealsPage
          ? allProducts.filter((product) => product.is_deal)
          : allProducts
      );

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isDealsPage]);

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

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

  if (loading) {
    return <div className="text-center mt-5">Loading products...</div>;
  }

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

        if (!Number.isInteger(durationHours) || durationHours < 1) {
          alert("Duration must be at least 1 hour");
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

  return (
    <div className="container">

      <h3 className="my-4">
        {isDealsPage ? "Deals of the Day" : "Products"}
      </h3>

      {!isDealsPage && (
        <Link to="/admin/products/create" className="btn btn-primary mb-3">
          Add Product
        </Link>
      )}

      <table className="table table-bordered">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                {isDealsPage ? "No active deals found" : "No products found"}
              </td>
            </tr>
          ) : (

            products.map(product => (

              <tr key={product.id}>

                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>₦{product.price}</td>
                <td>{product.category?.name || "-"}</td>

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

                  {/* 🔥 DEAL BUTTON */}
                  <button
                    className={`btn btn-sm ${product.is_deal
                      ? "btn-danger"
                      : "btn-outline-primary"
                      }`}
                    onClick={() => toggleDeal(product)}
                  >
                    {product.is_deal
                      ? "Remove Deal"
                      : "Add Deal"}
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
