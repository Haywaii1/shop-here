import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumbers, setTrackingNumbers] = useState({});

  const token = localStorage.getItem("admin_token");

  const fetchOrders = async () => {
    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin/orders",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

    const trackingNumber = trackingNumbers[id]?.trim();

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/orders/${id}/out-for-delivery`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tracking_number: trackingNumber || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.message || "Something went wrong");
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
    return (
      <div className="text-center mt-4">
        Loading orders...
      </div>
    );
  }

  return (

    <div className="container mt-4">

      {/* ✅ BACK BUTTON */}
      <div className="mb-3">

        <Link
          to="/admin/dashboard"
          className="btn btn-outline-dark rounded-pill px-4"
        >
          ← Back to Admin Dashboard
        </Link>

      </div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="fw-bold mb-1">
            Orders
          </h3>

          <p className="text-muted mb-0">
            Manage customer orders & deliveries
          </p>

        </div>

        <span className="badge bg-dark fs-6">
          {orders.length} Orders
        </span>

      </div>

      {orders.length === 0 ? (

        <div className="alert alert-warning rounded-4">
          No orders found
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table align-middle">

            <thead className="table-light">

              <tr>
                <th>Order ID</th>
                <th>Tracking Ref</th>
                <th>Total</th>
                <th>Status</th>
                <th width="320">Action</th>
              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  <td className="fw-semibold">
                    {order.order_number || `#${order.id}`}
                  </td>

                  <td>
                    {order.tracking_number || "Pending"}
                  </td>

                  <td className="fw-bold">
                    ₦{Number(order.total).toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={`badge ${getStatusBadge(order.status)}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="d-flex flex-wrap gap-2">

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

                          {order.tracking_number ||
                            "Tracking number will be auto-generated"}

                        </small>

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            handleOutForDelivery(order.id)
                          }
                        >
                          Dispatch
                        </button>

                      </>

                    )}

                    {order.status === "out_for_delivery" && (

                      <span className="text-warning fw-semibold">
                        Waiting for customer confirmation...
                      </span>

                    )}

                    {order.status === "received" && (

                      <span className="text-success fw-bold">
                        Completed
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}