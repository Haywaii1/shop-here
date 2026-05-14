import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function SearchResults() {

    const location = useLocation();
    const navigate = useNavigate();

    const query =
        new URLSearchParams(location.search).get("q");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {

                // ✅ SPLIT SEARCH KEYWORDS
                const keywords =
                    query
                        ?.toLowerCase()
                        .split(" ")
                        .filter(Boolean) || [];

                const filtered = data.filter(product => {

                    const name =
                        product.name?.toLowerCase() || "";

                    const category =
                        product.category?.name?.toLowerCase() || "";

                    const description =
                        product.description?.toLowerCase() || "";

                    // ✅ MATCH ANY KEYWORD
                    return keywords.some(keyword =>

                        name.includes(keyword) ||
                        category.includes(keyword) ||
                        description.includes(keyword)

                    );

                });

                setProducts(filtered);

            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [query]);

    if (loading) {
        return (
            <div className="container py-5">
                Loading...
            </div>
        );
    }

    return (

        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="fw-bold mb-1">
                        Search Results
                    </h3>

                    <p className="text-muted mb-0">
                        Showing results for "{query}"
                    </p>

                </div>

                <span className="badge bg-dark">
                    {products.length} Products
                </span>

            </div>

            {products.length === 0 ? (

                <div className="alert alert-warning rounded-4">
                    No matching products found.
                </div>

            ) : (

                <div className="row">

                    {products.map(product => {

                        const mainImage = product.images?.find(
                            img => img.is_main
                        );

                        const imagePath =
                            mainImage?.image_path ||
                            product.images?.[0]?.image_path;

                        const image = imagePath
                            ? `http://127.0.0.1:8000/storage/${imagePath}`
                            : smallProductPlaceholder;

                        // ✅ DEAL LOGIC
                        const discountPercent =
                            product.is_deal
                                ? product.deal_percentage || 0
                                : 0;

                        const oldPrice =
                            Number(product.price);

                        const discountedPrice =
                            oldPrice -
                            (oldPrice * discountPercent / 100);

                        return (

                            <div
                                key={product.id}
                                className="col-md-4 col-lg-3 mb-4"
                            >

                                <div
                                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                                    style={{
                                        cursor: "pointer",
                                        transition: "0.3s"
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/product/${product.slug}/${product.id}`
                                        )
                                    }
                                >

                                    {/* IMAGE */}
                                    <div
                                        className="position-relative"
                                        style={{
                                            height: "230px",
                                            background: "#f8f8f8"
                                        }}
                                    >

                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-100 h-100"
                                            style={{
                                                objectFit: "contain",
                                                padding: "12px"
                                            }}
                                        />

                                        {/* DEAL BADGE */}
                                        {product.is_deal && (
                                            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                                                -{discountPercent}%
                                            </span>
                                        )}

                                    </div>

                                    {/* BODY */}
                                    <div className="card-body">

                                        <small className="text-muted d-block mb-1">
                                            {product.category?.name}
                                        </small>

                                        <h6
                                            className="fw-bold"
                                            style={{
                                                minHeight: "48px"
                                            }}
                                        >
                                            {product.name}
                                        </h6>

                                        {/* PRICE */}
                                        {product.is_deal ? (

                                            <div>

                                                <span className="fw-bold text-danger fs-5 me-2">
                                                    ₦{discountedPrice.toLocaleString()}
                                                </span>

                                                <span className="text-muted text-decoration-line-through">
                                                    ₦{oldPrice.toLocaleString()}
                                                </span>

                                            </div>

                                        ) : (

                                            <div className="fw-bold text-dark fs-5">
                                                ₦{oldPrice.toLocaleString()}
                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}