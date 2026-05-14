import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("admin_token");

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null
  });

  // 🔥 FETCH CATEGORIES (SAFE)
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/categories", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        if (!res.ok) {
          console.error("Category error:", data);

          if (res.status === 401 || res.status === 403) {
            alert("Session expired. Please login again.");
            localStorage.removeItem("admin_token");
            navigate("/admin/login");
          }

          return;
        }

        setCategories(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Category fetch failed:", err);
      }
    };

    fetchCategories();

  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;

    setImages({
      ...images,
      [name]: files[0]
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category_id", form.category_id);
    formData.append("description", form.description);

    Object.values(images).forEach((img) => {
      if (img) {
        formData.append("images[]", img);
      }
    });

    try {

      const res = await fetch("http://127.0.0.1:8000/api/admin/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Non-JSON response:", text);
        alert("Server error. Check backend.");
        return;
      }

      if (!res.ok) {

        console.error("Create error:", data);

        if (res.status === 401 || res.status === 403) {
          alert("Session expired. Login again.");
          localStorage.removeItem("admin_token");
          navigate("/admin/login");
          return;
        }

        alert(data.message || "Failed to create product");
        return;
      }

      alert("✅ Product created successfully!");

      navigate(`/admin/products/${data.product.id}/variants`);

    } catch (error) {

      console.error("Request failed:", error);

      alert("Network error");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="container py-4">

      {/* 🔙 BACK TO DASHBOARD */}
      <div className="mb-3">

        <Link
          to="/admin/dashboard"
          className="btn btn-outline-dark rounded-pill px-4"
        >
          ← Back to Admin Dashboard
        </Link>

      </div>

      {/* PAGE TITLE */}
      <div className="mb-4">

        <h3 className="fw-bold">
          Create Product
        </h3>

        <p className="text-muted mb-0">
          Add a new product to your store
        </p>

      </div>

      {/* FORM */}
      <div className="card border-0 shadow-sm rounded-4 p-4">

        <form onSubmit={handleSubmit}>

          {/* PRODUCT NAME */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              className="form-control"
              onChange={handleChange}
              required
            />

          </div>

          {/* PRICE */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter product price"
              className="form-control"
              onChange={handleChange}
              required
            />

          </div>

          {/* CATEGORY */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Category
            </label>

            <select
              name="category_id"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}

            </select>

          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter product description"
              className="form-control"
              rows="4"
              onChange={handleChange}
            />

          </div>

          {/* IMAGES */}
          <div className="mb-3">

            <label className="form-label fw-semibold">
              Product Images
            </label>

            <input
              type="file"
              name="image1"
              className="form-control mb-2"
              onChange={handleImageChange}
            />

            <input
              type="file"
              name="image2"
              className="form-control mb-2"
              onChange={handleImageChange}
            />

            <input
              type="file"
              name="image3"
              className="form-control"
              onChange={handleImageChange}
            />

          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary px-4 rounded-pill"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

        </form>

      </div>

    </div>

  );
}