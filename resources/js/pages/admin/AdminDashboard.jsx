import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminAutoLogout from "./components/AdminAutoLogout";


export default function AdminDashboard() {

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    variants: 0,
    low_stock: 0
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const admin = JSON.parse(localStorage.getItem("admin"));

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // 📊 FETCH DASHBOARD DATA
  useEffect(() => {

    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/dashboard", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const text = await res.text();

        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          console.error("Non JSON response:", text);
          alert("Server error");
          return;
        }

        if (!res.ok) {
          console.error("Dashboard error:", data);
          alert(data.message || "Failed to load dashboard");
          return;
        }

        setStats(data);

      } catch (err) {
        console.error(err);
        alert("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, [token]);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  return (

    <div className="container my-4">
      <AdminAutoLogout />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Admin Dashboard</h2>
          <small className="text-muted">
            Welcome, {admin?.name || "Admin"}
          </small>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* 📊 STAT CARDS */}
      <div className="row mb-4">

        {/* PRODUCTS */}
        <div className="col-md-3">
          <div
            className="card p-3 text-center shadow-sm dashboard-card"
            onClick={() => navigate("/admin/products")}
            style={{ cursor: "pointer" }}
          >
            <h4>{stats.products}</h4>
            <p>Total Products</p>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="col-md-3">
          <div
            className="card p-3 text-center shadow-sm dashboard-card"
            onClick={() => navigate("/admin/categories")}
            style={{ cursor: "pointer" }}
          >
            <h4>{stats.categories}</h4>
            <p>Categories</p>
          </div>
        </div>

        {/* VARIANTS */}
        <div className="col-md-3">
          <div
            className="card p-3 text-center shadow-sm dashboard-card"
            onClick={() => navigate("/admin/variants")}
            style={{ cursor: "pointer" }}
          >
            <h4>{stats.variants}</h4>
            <p>Total Variants</p>
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="col-md-3">
          <div
            className="card p-3 bg-danger text-white text-center shadow-sm dashboard-card"
            onClick={() => navigate("/admin/products?filter=low_stock")}
            style={{ cursor: "pointer" }}
          >
            <h4>{stats.low_stock}</h4>
            <p>Low Stock</p>
          </div>
        </div>

      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div className="card p-4 shadow-sm">

        <h4 className="mb-3">Quick Actions</h4>

        <div className="d-flex gap-3 flex-wrap">

          <Link to="/admin/products" className="btn btn-primary">
            Manage Products
          </Link>

          <Link to="/admin/products/create" className="btn btn-success">
            Create Product
          </Link>

          <Link to="/admin/categories" className="btn btn-dark">
            Manage Categories
          </Link>

          <Link to="/admin/orders" className="btn btn-warning">
            View Orders
          </Link>

          <Link to="/admin/deals" className="btn btn-info">
            Manage Deals of the Day
          </Link>

        </div>

      </div>

    </div>
  );
}