import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your payment...");
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return undefined;
    }

    hasVerifiedRef.current = true;

    const token = localStorage.getItem("token");
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    let timer;

    if (!reference) {
      setMessage("Missing payment reference.");
      return undefined;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/payment/verify/${reference}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          if (response.status === 502) {
            setMessage("Payment completed, but verification is temporarily unavailable. Please refresh this page in a moment.");
            return;
          }

          throw new Error(data.message || "Payment verification failed.");
        }

        try {
          await fetch("http://127.0.0.1:8000/api/cart/clear", {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (clearError) {
          console.error(clearError);
        }

        localStorage.removeItem("cart");
        localStorage.removeItem("checkout_redirect");
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cartUpdated"));
        setMessage("Payment successful. Redirecting to your orders...");

        timer = setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 2000);
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Payment verification failed.");
      }
    };

    verifyPayment();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [navigate, searchParams]);

  return (
    <div className="text-center mt-5">
      <h3>Payment Status</h3>
      <p>{message}</p>
    </div>
  );
}
