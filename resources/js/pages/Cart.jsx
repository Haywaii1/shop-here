import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ SAFE LOAD CART
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart"));

      if (Array.isArray(storedCart)) {
        setCart(storedCart);
      } else {
        setCart([]);
      }

    } catch (error) {
      console.warn("Invalid cart data, resetting...", error);
      localStorage.removeItem("cart");
      setCart([]);
    }
  }, []);

  // ✅ UPDATE QUANTITY
  const updateQuantity = (index, quantity) => {
    const updated = [...cart];
    updated[index].quantity = quantity < 1 ? 1 : quantity;

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ REMOVE ITEM
  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ TOTAL (handles discount)
  const total = cart.reduce(
    (sum, item) =>
      sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
      localStorage.setItem("checkout_redirect", "true");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return <h4 className="text-center mt-5">Your cart is empty 🛒</h4>;
  }

  return (
    <div className="container my-5">

      <h3 className="mb-4">Your Cart</h3>

      {cart.map((item, index) => {

        const image = item.image || cartPlaceholder;

        const price = item.price;
        const finalPrice = item.finalPrice || price;
        const hasDiscount = item.discountPercent > 0;

        return (
          <div
            key={index}
            className="d-flex align-items-center justify-content-between border p-3 mb-3 rounded"
          >

            <img
              src={image}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />

            <div className="flex-grow-1 ms-3">
              <h6>{item.name}</h6>

              {hasDiscount ? (
                <>
                  <span className="text-danger fw-bold">
                    ₦{Number(finalPrice).toLocaleString()}
                  </span>
                  <br />
                  <small className="text-muted text-decoration-line-through">
                    ₦{Number(price).toLocaleString()}
                  </small>
                </>
              ) : (
                <p className="text-muted mb-0">
                  ₦{Number(price).toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(index, Number(e.target.value) || 1)
                }
                className="form-control"
                style={{ width: "80px" }}
              />
            </div>

            <button
              className="btn btn-danger ms-3"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>

          </div>
        );
      })}

      <div className="text-end mt-4">
        <h4>Total: ₦{total.toLocaleString()}</h4>

        <button className="btn btn-dark mt-2" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}
import { cartPlaceholder } from "../utils/placeholders";
