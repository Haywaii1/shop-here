import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  return (

    <div className="container my-4">

      <div
        className="position-relative overflow-hidden rounded"
        style={{
          height: "520px"
        }}
      >

        {/* IMAGE */}
        <img
          src="/images/advert1.jpg"
          alt="Fashion Banner"
          className="w-100 h-100"
          style={{
            objectFit: "cover"
          }}
        />

        {/* DARK OVERLAY */}
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
            maxWidth: "550px",
            paddingLeft: "60px"
          }}
        >

          <p
            className="text-warning fw-bold mb-2"
            style={{
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}
          >
            New Collection 2026
          </p>

          <h1
            className="fw-bold mb-3"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: "1.1"
            }}
          >
            iloveugly Fashion Clothing
          </h1>

          <h3 className="text-warning mb-4">
            Up to 40% OFF
          </h3>

          <p
            className="mb-4 text-light"
            style={{
              fontSize: "1.1rem"
            }}
          >
            Discover premium streetwear, modern fashion,
            and exclusive seasonal arrivals.
          </p>

          <button
            className="btn btn-warning btn-lg px-5 py-3 fw-bold"
            style={{
              borderRadius: "50px"
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