import { Link } from "react-router-dom";

export default function Features() {

  const items = [
    {
      name: "Free Delivery",
      description: "On orders above ₦50,000",
      icon: "🚚",
      path: "/free-delivery",
      color: "#e3f2fd"
    },
    {
      name: "30 Days Return",
      description: "Easy return policy",
      icon: "🔄",
      path: "/returns",
      color: "#fce4ec"
    },
    {
      name: "Secure Payment",
      description: "100% protected checkout",
      icon: "💳",
      path: "/secure-payment",
      color: "#e8f5e9"
    },
    {
      name: "24/7 Support",
      description: "We're always available",
      icon: "🎧",
      path: "/support",
      color: "#fff8e1"
    }
  ];

  return (

    <div className="container my-5">

      <div className="row g-4">

        {items.map((item, i) => (

          <div
            className="col-lg-3 col-md-6"
            key={i}
          >

            <Link
              to={item.path}
              className="text-decoration-none"
            >

              <div
                className="feature-card h-100 p-4"
                style={{
                  borderRadius: "22px",
                  background: "#fff",
                  transition: "0.35s ease",
                  border: "1px solid #f1f1f1",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
                }}
              >

                {/* ICON */}
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "18px",
                    background: item.color,
                    fontSize: "2rem"
                  }}
                >
                  {item.icon}
                </div>

                {/* TITLE */}
                <h5
                  className="fw-bold text-dark mb-2"
                >
                  {item.name}
                </h5>

                {/* DESCRIPTION */}
                <p
                  className="text-muted mb-0"
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.6"
                  }}
                >
                  {item.description}
                </p>

              </div>

            </Link>

          </div>

        ))}

      </div>

      {/* HOVER EFFECT */}
      <style>
        {`
          .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          }
        `}
      </style>

    </div>

  );

}