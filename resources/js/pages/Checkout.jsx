import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function readStorageJson(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);

    if (!rawValue || rawValue === "undefined" || rawValue === "null") {
      return fallback;
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = readStorageJson("user", null);

  useEffect(() => {
    const storedCart = readStorageJson("cart", []);
    const token = localStorage.getItem("token");

    if (storedCart.length === 0) {
      navigate("/");
      return;
    }

    if (!token) {
      alert("Please login to continue checkout");
      navigate("/login");
      return;
    }

    setCart(storedCart);
  }, [navigate]);

  const total = cart.reduce(
    (sum, item) => sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  const parseResponse = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {
        message: "The server returned an invalid response.",
        raw: text,
      };
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payRes = await fetch("http://127.0.0.1:8000/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user?.email,
          amount: total,
          items: cart.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        }),
      });

      const payData = await parseResponse(payRes);

      if (!payRes.ok) {
        alert(payData.message || "Payment init failed");
        setLoading(false);
        return;
      }

      window.location.href = payData.data.authorization_url;
    } catch (err) {
      console.error(err);
      alert("Payment error");
    }

    setLoading(false);
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Checkout</h3>

      <p>
        Logged in as: <strong>{user?.name}</strong>
      </p>

      <div className="row">
        <div className="col-md-7">
          {cart.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between border p-3 mb-3 rounded"
            >
              <div>
                <h6>{item.name}</h6>
                <small>Qty: {item.quantity}</small>
              </div>

              <div>
                N{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-5">
          <div className="border p-4 rounded shadow-sm">
            <h5>Order Summary</h5>

            <hr />

            <p className="d-flex justify-content-between">
              <span>Total:</span>
              <strong>N{total.toLocaleString()}</strong>
            </p>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Redirecting..." : "Pay with Paystack"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
