import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    admin_code: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        const firstError = data.errors
          ? Object.values(data.errors)[0]?.[0]
          : null;
        alert(firstError || data.message || "Admin registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Admin Register</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.name}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.email}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.password}
        />

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.password_confirmation}
        />

        <input
          type="text"
          name="admin_code"
          placeholder="Admin Registration Code"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.admin_code}
        />

        <button className="btn btn-warning w-100">Create Admin Account</button>
      </form>
    </div>
  );
}
