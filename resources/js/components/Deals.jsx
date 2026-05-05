import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Deals() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then(res => res.json())
      .then(data => {

        const deals = data.filter(p => {
          const name = p.name?.toLowerCase() || "";

          return (
            name.includes("jbl") ||
            name.includes("macbook") ||
            name.includes("hisense") ||
            name.includes("drone") ||
            name.includes("watch")
          );
        });

        setProducts(deals);
      })
      .catch(err => console.error(err));

  }, []);

  if (products.length === 0) {
    return (
      <div className="container my-5">
        <h4>Deals Of The Day 🔥</h4>
        <p>Loading deals...</p>
      </div>
    );
  }

  return (

    <div className="container my-5">

      <h4 className="mb-4 fw-bold">Deals Of The Day 🔥</h4>

      <div className="row">

        {products.map(product => {

          // ✅ IMAGE
          const mainImage = product.images?.find(img => img.is_main);

          const imagePath =
            mainImage?.image_path ||
            product.images?.[0]?.image_path ||
            product.image1;

          const image = imagePath
            ? `http://127.0.0.1:8000/storage/${imagePath}`
            : smallProductPlaceholder;

          // ✅ VARIANT (for routing)
          const variant = product.variants?.[0];

          const url = variant
            ? `/product/${product.slug}/${variant.sku}`
            : `/product/${product.slug}`;

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
                    cursor: "pointer"
                  }}
                >

                  {/* IMAGE */}
                  <img
                    src={image}
                    className="card-img-top"
                    style={{
                      height: "180px",
                      objectFit: "cover"
                    }}
                    alt={product.name}
                  />

                  <div className="card-body">

                    {/* NAME */}
                    <h6 className="mb-2" style={{ minHeight: "40px" }}>
                      {product.name}
                    </h6>

                    {/* PRICE (NO DISCOUNT) */}
                    <span className="text-dark fw-bold">
                      ₦{Number(product.price).toLocaleString()}
                    </span>

                    {/* VARIANTS */}
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
import { smallProductPlaceholder } from "../utils/placeholders";
