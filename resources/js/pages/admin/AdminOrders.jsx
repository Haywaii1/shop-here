import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/orders", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        setOrders([]);
        return;
      }

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrepare = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/orders/${id}/prepare`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutForDelivery = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/orders/${id}/out-for-delivery`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to dispatch order");
        return;
      }

      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-secondary";
      case "paid":
        return "bg-success";
      case "preparing_shipment":
        return "bg-info";
      case "out_for_delivery":
        return "bg-warning text-dark";
      case "received":
        return "bg-success";
      default:
        return "bg-dark";
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading orders...</div>;
  }

  return (
    <div className="container mt-4">
      <h3>Orders</h3>

      {orders.length === 0 ? (
        <p className="text-muted mt-3">No orders found</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Tracking Ref</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number || `#${order.id}`}</td>
                <td>{order.tracking_number || "Pending"}</td>
                <td>N{order.total}</td>

                <td>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                <td className="d-flex gap-2">
                  {order.status === "paid" && (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handlePrepare(order.id)}
                    >
                      Prepare
                    </button>
                  )}

                  {order.status === "preparing_shipment" && (
                    <>
                      <small className="text-muted align-self-center">
                        {order.tracking_number || "Tracking number will be auto-generated"}
                      </small>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleOutForDelivery(order.id)}
                      >
                        Dispatch
                      </button>
                    </>
                  )}

                  {order.status === "out_for_delivery" && (
                    <span className="text-warning">
                      Waiting for customer confirmation...
                    </span>
                  )}

                  {order.status === "received" && (
                    <span className="text-success fw-bold">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
