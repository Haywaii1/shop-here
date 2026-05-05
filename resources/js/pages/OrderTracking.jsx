import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderPlaceholder } from "../utils/placeholders";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
          throw new Error(data.message || "Failed to load order.");
        }

        return data;
      })
      .then((data) => setOrder(data))
      .catch((fetchError) => {
        console.error(fetchError);
        setError(fetchError.message || "Failed to load order.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmReceived = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/${order.id}/confirm-received`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to confirm order");
        return;
      }

      alert("Order marked as received ✅");

      // ✅ update UI instantly
      setOrder(data.order);

    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = () => {
    const firstProduct = order?.items?.[0]?.product;
    const mainImage = firstProduct?.images?.find((img) => img.is_main);
    const imagePath =
      mainImage?.image_path ||
      firstProduct?.images?.[0]?.image_path ||
      firstProduct?.image1;

    return imagePath
      ? `http://127.0.0.1:8000/storage/${imagePath}`
      : orderPlaceholder;
  };

  const getDeliveryText = () => {
    if (!order) {
      return "";
    }

    if (order.status === "delivered") {
      return "Delivered";
    }

    if (order.status === "cancelled") {
      return "Cancelled";
    }

    return "Estimated delivery in 2-5 working days";
  };

  const getTrackingSteps = () => {
    const currentStatus = order?.status;

    return [
      {
        label: "Order Received",
        active: Boolean(currentStatus),
      },
      {
        label: "Payment Confirmed",
        active: ["paid", "preparing_shipment", "out_for_delivery", "delivered", "received"].includes(currentStatus),
      },
      {
        label: "Preparing Shipment",
        active: ["preparing_shipment", "out_for_delivery", "delivered", "received"].includes(currentStatus),
      },
      {
        label: "Out for Delivery",
        active: ["out_for_delivery", "delivered", "received"].includes(currentStatus),
      },
      {
        label: "Delivered",
        active: ["delivered", "received"].includes(currentStatus),
      },
      {
        label: "Received",
        active: currentStatus === "received",
      },
    ];
  };

  if (loading) {
    return <div className="container my-5"><p>Loading tracking details...</p></div>;
  }

  if (error || !order) {
    return (
      <div className="container my-5">
        <Link to="/orders" className="btn btn-link px-0 mb-3">
          Back to Orders
        </Link>
        <div className="alert alert-danger mb-0">{error || "Order not found."}</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Link to="/orders" className="btn btn-link px-0 mb-3">
        Back to Orders
      </Link>

      <div className="border rounded shadow-sm p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3">
            <img
              src={getImageUrl()}
              alt={order.items?.[0]?.product?.name || "Order"}
              className="img-fluid rounded border"
              style={{ width: "220px", height: "220px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-5">
            <h3 className="mb-3">Track Order</h3>
            <p className="mb-1"><strong>Order ID:</strong> #{order.order_number}</p>
            <p className="mb-1"><strong>Name:</strong> {order.user?.name || "N/A"}</p>
            <p className="mb-1"><strong>Email:</strong> {order.user?.email || "N/A"}</p>
            <p className="mb-1"><strong>Amount:</strong> N{Number(order.total || 0).toLocaleString()}</p>
            <p className="mb-0"><strong>Delivery Duration:</strong> {getDeliveryText()}</p>
          </div>

          <div className="bg-light rounded p-3">
            <p className="mb-1">
              <strong>Current Status:</strong> {order.status}
            </p>

            <p className="mb-2 text-muted">
              Tracking reference: {order.payment_reference || "Pending"}
            </p>

            {/* ✅ CONFIRM RECEIVED BUTTON */}
            {(order.status === "out_for_delivery" || order.status === "delivered") && (
              <button
                className="btn btn-success btn-sm mt-2"
                onClick={handleConfirmReceived}
              >
                Confirm Received
              </button>
            )}

            {/* ✅ AFTER CONFIRMATION */}
            {order.status === "received" && (
              <div className="text-success mt-2 fw-bold">
                ✔ You have received this order
              </div>
            )}
          </div>


        </div>

        <hr className="my-4" />

        <h5 className="mb-3">Tracking Progress</h5>
        <div className="d-grid gap-2">
          {getTrackingSteps().map((step) => (
            <div
              key={step.label}
              className={`rounded border p-3 ${step.active ? "border-success bg-success-subtle" : "bg-light"}`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
