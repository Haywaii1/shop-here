import { useEffect, useState } from "react";

export default function AdminCategories() {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("admin_token"); // ✅ FIXED

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/categories", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Fetch error:", data);
        setCategories([]); // ✅ prevent crash
        return;
      }

      // ✅ ensure it's always an array
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
      const res = await fetch("http://127.0.0.1:8000/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

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
      const res = await fetch(`http://127.0.0.1:8000/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

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
    <div className="container">

      <h3 className="my-4">Categories</h3>

      <form onSubmit={createCategory} className="mb-4">
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Category name"
          className="form-control mb-2"
        />
        <button className="btn btn-primary">
          Add Category
        </button>
      </form>

      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    onClick={()=>deleteCategory(cat.id)}
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