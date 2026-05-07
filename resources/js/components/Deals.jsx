import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function Deals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/deals")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  if (products.length === 0) {
    return (
      <div className="container my-5">
        <h4>Deals Of The Day</h4>
        <p>Loading deals...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h4 className="mb-4 fw-bold">Deals Of The Day</h4>

      <div className="row">
        {products.map((product) => {
          const mainImage = product.images?.find((img) => img.is_main);

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
            : `/product/${product.slug}`;

          const oldPrice = Number(product.price);
          const discountPercent = Number(product.deal_percentage || 0);
          const discountedPrice = oldPrice - (oldPrice * discountPercent) / 100;

          return (
            <div className="col-md-3 mb-4" key={product.id}>
              <Link
                to={url}
                className="text-decoration-none text-dark"
              >
                <div
                  className="card h-100 shadow-sm product-card"
                  style={{
                    transition: "0.3s",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={image}
                    className="card-img-top"
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                    alt={product.name}
                  />

                  <div className="card-body">
                    <h6 className="mb-2" style={{ minHeight: "40px" }}>
                      {product.name}
                    </h6>

                    <span className="text-dark fw-bold d-block">
                      N{discountedPrice.toLocaleString()}
                    </span>

                    <small className="text-muted text-decoration-line-through d-block">
                      N{oldPrice.toLocaleString()}
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
