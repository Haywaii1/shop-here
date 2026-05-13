import { useNavigate } from "react-router-dom";
import { promoPlaceholder } from "../utils/placeholders";

export default function PromoBanner() {

  const navigate = useNavigate();

  return (

    <div className="container my-5">

      <div
        className="position-relative overflow-hidden rounded-4 shadow"
        style={{
          height: "360px"
        }}
      >

        {/* IMAGE */}
        <img
          src={promoPlaceholder}
          alt="Promo Banner"
          className="w-100 h-100"
          style={{
            objectFit: "cover"
          }}
        />

        {/* OVERLAY */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.2))"
          }}
        />

        {/* CONTENT */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y text-white"
          style={{
            padding: "0 40px",
            maxWidth: "420px",
            width: "100%"
          }}
        >

          <span
            className="badge bg-warning text-dark px-3 py-2 mb-2"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "1px"
            }}
          >
            LIMITED OFFER
          </span>

          <h2
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
              lineHeight: "1.2"
            }}
          >
            20% OFF
            <br />
            Mango Bag
          </h2>

          <p
            className="text-light mb-3"
            style={{
              fontSize: "0.95rem",
              lineHeight: "1.6"
            }}
          >
            Discover elegant handbags crafted for
            modern fashion lovers at amazing prices.
          </p>

          <button
            className="btn btn-warning fw-semibold px-4 py-2"
            style={{
              borderRadius: "40px",
              fontSize: "0.95rem"
            }}
            onClick={() => navigate("/deals")}
          >
            Shop Now
          </button>

        </div>

      </div>

    </div>

  );

}