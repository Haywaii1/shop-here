import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderPlaceholder } from "../utils/placeholders";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        if (!res.ok) {
          throw new Error(data.message || "Failed to load orders.");
        }

        return data;
      })
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (order) => {
    const firstProduct = order.items?.[0]?.product;
    const mainImage = firstProduct?.images?.find((img) => img.is_main);
    const imagePath =
      mainImage?.image_path ||
      firstProduct?.images?.[0]?.image_path ||
      firstProduct?.image1;

    return imagePath
      ? `http://127.0.0.1:8000/storage/${imagePath}`
      : orderPlaceholder;
  };

  const getProductNames = (order) => {
    const names = order.items?.map((item) => item.product?.name).filter(Boolean) || [];
    return names.length ? names.join(", ") : "Order items";
  };

  const getDeliveryText = (status) => {
    if (status === "delivered") {
      return "Delivered";
    }

    if (status === "cancelled") {
      return "Cancelled";
    }

    return "2-5 working days";
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">My Orders</h3>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <div className="border rounded p-4 bg-light">
          <p className="mb-0">You have not placed any orders yet.</p>
        </div>
      )}

      <div className="d-grid gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded p-3 shadow-sm"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/orders/${order.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/orders/${order.id}`);
              }
            }}
          >
            <div className="row align-items-center g-3">
              <div className="col-md-2">
                <img
                  src={getImageUrl(order)}
                  alt={getProductNames(order)}
                  className="img-fluid rounded border"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-6">
                <h5 className="mb-2">{getProductNames(order)}</h5>
                <p className="mb-1">
                  <strong>Order ID:</strong> #{order.order_number}
                </p>
                <p className="mb-1">
                  <strong>Name:</strong> {order.user?.name || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {order.user?.email || "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Status:</strong> {order.status}
                </p>
              </div>

              <div className="col-md-4 text-md-end">
                <p className="mb-2">
                  <strong>Amount:</strong> N{Number(order.total || 0).toLocaleString()}
                </p>
                <p className="mb-2">
                  <strong>Delivery Duration:</strong> {getDeliveryText(order.status)}
                </p>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/orders/${order.id}`);
                  }}
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
