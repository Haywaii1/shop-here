import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: ""
  });

  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const parseResponse = async (response) => {
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Request failed.");
      }

      return data;
    };

    fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(parseResponse)
      .then((data) => setForm(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/api/admin/categories", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(parseResponse)
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Product updated");
      navigate("/admin/products");
    }
  };

  return (
    <div className="container">

      <h3 className="my-4">Edit Product</h3>

      <form onSubmit={updateProduct}>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="">Select category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="form-control mb-3"
        />

        <button className="btn btn-success">
          Update Product
        </button>

      </form>

    </div>
  );
}
