import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      // 🔥 SAFELY HANDLE RESPONSE (even if HTML error comes back)
      const text = await res.text();

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Non-JSON response:", text);
        alert("Server error (not JSON). Check backend.");
        setLoading(false);
        return;
      }

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Admin login failed");
        setLoading(false);
        return;
      }

      // ✅ FIXED HERE
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Check your server.");
    }

    setLoading(false);
  };

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Admin Login</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.password}
          required
        />

        <button
          className="btn btn-dark w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>

      <p className="mt-3 text-center">
        Need an admin account?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/admin/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}