import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function Deals() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/deals")
      .then((res) => res.json())
      .then((data) => {

        // ✅ SHOW ONLY FIRST 4 DEALS
        setProducts(data.slice(0, 4));

      })
      .catch((err) => console.error(err));

  }, []);

  if (products.length === 0) {

    return (

      <div className="container my-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="fw-bold mb-0">
            Deals Of The Day
          </h4>

          <Link
            to="/deals"
            className="text-decoration-none fw-semibold"
          >
            View More →
          </Link>

        </div>

        <p>Loading deals...</p>

      </div>

    );

  }

  return (

    <div className="container my-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h4 className="fw-bold mb-0">
          Deals Of The Day
        </h4>

        <Link
          to="/deals"
          className="text-decoration-none fw-semibold text-warning"
        >
          View More →
        </Link>

      </div>

      <div className="row">

        {products.map((product) => {

          const mainImage = product.images?.find(
            (img) => img.is_main
          );

          const imagePath =
            mainImage?.image_path ||
            product.images?.[0]?.image_path ||
            product.image1;

          const image = imagePath
            ? `http://127.0.0.1:8000/storage/${imagePath}`
            : smallProductPlaceholder;

          const variant = product.variants?.[0];

          const url = variant
            ? `/product/${product.slug}/${variant.sku}`
            : `/product/${product.slug}/${product.id}`;

          const oldPrice = Number(product.price);

          const discountPercent = Number(
            product.deal_percentage || 0
          );

          const discountedPrice =
            oldPrice -
            (oldPrice * discountPercent) / 100;

          return (

            <div
              className="col-md-3 mb-4"
              key={product.id}
            >

              <Link
                to={url}
                className="text-decoration-none text-dark"
              >

                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    transition: "0.3s",
                    cursor: "pointer",
                    overflow: "hidden"
                  }}
                >

                  {/* IMAGE */}
                  <div
                    style={{
                      height: "220px",
                      overflow: "hidden",
                      position: "relative"
                    }}
                  >

                    <img
                      src={image}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover"
                      }}
                      alt={product.name}
                    />

                    {/* DISCOUNT BADGE */}
                    <span
                      className="badge bg-danger position-absolute"
                      style={{
                        top: "10px",
                        left: "10px"
                      }}
                    >
                      -{discountPercent}%
                    </span>

                  </div>

                  {/* BODY */}
                  <div className="card-body">

                    <h6
                      className="mb-2"
                      style={{
                        minHeight: "45px"
                      }}
                    >
                      {product.name}
                    </h6>

                    <span className="text-danger fw-bold d-block fs-5">
                      ₦{discountedPrice.toLocaleString()}
                    </span>

                    <small className="text-muted text-decoration-line-through d-block">
                      ₦{oldPrice.toLocaleString()}
                    </small>

                    {product.variants?.length > 0 && (

                      <small className="text-success d-block mt-1">
                        {product.variants.length} options
                      </small>

                    )}

                  </div>

                </div>

              </Link>

            </div>

          );

        })}

      </div>

    </div>

  );

}