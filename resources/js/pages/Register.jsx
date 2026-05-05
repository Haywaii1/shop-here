import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: ""
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

            const res = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Registered successfully!");

            navigate("/");

        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    };

    return (

        <div className="container my-5" style={{ maxWidth: "500px" }}>

            <h3 className="mb-4">Create Account</h3>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

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

                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <button className="btn btn-warning w-100">
                    Register
                </button>

            </form>

            <p className="mt-3 text-center">
                Already have an account?{" "}
                <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => navigate("/login")}
                >
                    Login
                </span>
            </p>

        </div>
    );
}