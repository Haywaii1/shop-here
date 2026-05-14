import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminCategories() {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("admin_token");

  const fetchCategories = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/categories",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {

        console.error("Fetch error:", data);
        setCategories([]);
        return;

      }

      setCategories(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Network error:", err);
      setCategories([]);

    }

  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ name })
        }
      );

      const data = await res.json();

      if (res.ok) {

        setName("");
        fetchCategories();

      } else {

        console.error(data);
        alert(data.message || "Failed to create category");

      }

    } catch (err) {

      console.error(err);
      alert("Network error");

    }

  };

  const deleteCategory = async (id) => {

    if (!window.confirm("Delete this category?")) return;

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {

        fetchCategories();

      } else {

        const data = await res.json();

        console.error(data);
        alert(data.message || "Failed to delete category");

      }

    } catch (err) {

      console.error(err);
      alert("Network error");

    }

  };

  return (

    <div className="container py-4">

      {/* BACK BUTTON */}
      <div className="mb-3">

        <Link
          to="/admin/dashboard"
          className="btn btn-outline-dark rounded-pill px-4"
        >
          ← Back to Dashboard
        </Link>

      </div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="fw-bold mb-1">
            Categories
          </h3>

          <p className="text-muted mb-0">
            Manage store categories
          </p>

        </div>

        <span className="badge bg-dark">
          {categories.length} Categories
        </span>

      </div>

      {/* FORM */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">

        <form onSubmit={createCategory}>

          <div className="row align-items-end">

            <div className="col-md-9 mb-3 mb-md-0">

              <label className="form-label fw-semibold">
                Category Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="form-control rounded-3"
                required
              />

            </div>

            <div className="col-md-3">

              <button className="btn btn-primary w-100 rounded-3">
                Add Category
              </button>

            </div>

          </div>

        </form>

      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

        <table className="table align-middle mb-0">

          <thead className="table-light">

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th width="120">Action</th>
            </tr>

          </thead>

          <tbody>

            {categories.length === 0 ? (

              <tr>

                <td
                  colSpan="3"
                  className="text-center text-muted py-4"
                >
                  No categories found
                </td>

              </tr>

            ) : (

              categories.map(cat => (

                <tr key={cat.id}>

                  <td>
                    #{cat.id}
                  </td>

                  <td className="fw-medium">
                    {cat.name}
                  </td>

                  <td>

                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="btn btn-danger btn-sm rounded-pill px-3"
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

    </div>

  );

}