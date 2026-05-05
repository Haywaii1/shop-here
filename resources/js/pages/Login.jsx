import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      // 🔥 redirect back (important for checkout)
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (

    <div className="container my-5" style={{ maxWidth: "500px" }}>

      <h3 className="mb-4">Login</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button className="btn btn-dark w-100">
          Login
        </button>

      </form>

      <p className="mt-3 text-center">
        Don't have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>

    </div>
  );
}
