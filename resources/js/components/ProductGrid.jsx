import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function ProductGrid() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => {
                console.error("Products error:", err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                Loading products...
            </div>
        );
    }

    return (

        <div className="row">

            {products.length === 0 ? (

                <div className="col-12 text-center">
                    No products found
                </div>

            ) : (

                products.map((product) => {

                    // ✅ Main image
                    const mainImage = product.images?.find(
                        img => img.is_main
                    );

                    const imagePath =
                        mainImage?.image_path ||
                        product.images?.[0]?.image_path;

                    const image = imagePath
                        ? `http://127.0.0.1:8000/storage/${imagePath}`
                        : smallProductPlaceholder;

                    // ✅ Deal logic
                    const discountPercent =
                        product.is_deal
                            ? product.deal_percentage || 0
                            : 0;

                    const oldPrice = Number(product.price);

                    const discountedPrice =
                        oldPrice -
                        (oldPrice * discountPercent / 100);

                    return (

                        <div
                            className="col-md-4 col-lg-3 mb-4"
                            key={product.id}
                        >

                            <Link
                                to={`/product/${product.slug}/${product.id}`}
                                className="text-decoration-none text-dark"
                            >

                                <div className="card border-0 shadow-sm p-2 h-100 product-card">

                                    {/* IMAGE */}
                                    <div className="position-relative">

                                        <div
                                            className="overflow-hidden rounded"
                                            style={{
                                                height: "250px",
                                                width: "100%",
                                                backgroundColor: "#f8f8f8"
                                            }}
                                        >

                                            <img
                                                src={image}
                                                alt={product.name}
                                                className="w-100 h-100"
                                                style={{
                                                    objectFit: "contain",
                                                    padding: "10px"
                                                }}
                                            />

                                        </div>

                                        {/* DEAL BADGE */}
                                        {product.is_deal && (
                                            <span
                                                className="badge bg-danger position-absolute top-0 start-0 m-2"
                                            >
                                                -{discountPercent}%
                                            </span>
                                        )}

                                    </div>

                                    {/* DETAILS */}
                                    <div className="pt-3">

                                        <h6
                                            className="fw-semibold"
                                            style={{
                                                minHeight: "45px"
                                            }}
                                        >
                                            {product.name}
                                        </h6>

                                        {/* PRICE */}
                                        {product.is_deal ? (

                                            <div>

                                                <span className="text-danger fw-bold fs-5 me-2">
                                                    ₦{discountedPrice.toLocaleString()}
                                                </span>

                                                <span className="text-muted text-decoration-line-through">
                                                    ₦{oldPrice.toLocaleString()}
                                                </span>

                                            </div>

                                        ) : (

                                            <p className="text-danger fw-bold fs-5">
                                                ₦{oldPrice.toLocaleString()}
                                            </p>

                                        )}

                                        {/* RATING */}
                                        <div className="text-warning">
                                            ★★★★★
                                        </div>

                                    </div>

                                </div>

                            </Link>

                        </div>

                    );

                })

            )}

        </div>

    );

}