import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    }

    setLoading(false);
  };

  return (

    <div className="container">

      <h3 className="my-4">Create Product</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <select
          name="category_id"
          className="form-control mb-3"
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>

          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-3"
          onChange={handleChange}
        />

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
          className="form-control mb-3"
          onChange={handleImageChange}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

      </form>

    </div>
  );
}