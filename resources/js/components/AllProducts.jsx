import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function AllProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ PAGINATION
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 12;

    useEffect(() => {

        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {

                // ✅ SHOW ALL PRODUCTS
                setProducts(data);

            })
            .catch(err => {
                console.error("Products error:", err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    // ✅ PAGINATION LOGIC
    const lastIndex =
        currentPage * productsPerPage;

    const firstIndex =
        lastIndex - productsPerPage;

    const currentProducts =
        products.slice(firstIndex, lastIndex);

    const totalPages =
        Math.ceil(products.length / productsPerPage);

    // ✅ CHANGE PAGE
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                Loading products...
            </div>
        );
    }

    return (

        <div className="container py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        All Products
                    </h2>

                    <p className="text-muted mb-0">
                        Browse our latest collection
                    </p>

                </div>

                <span className="badge bg-dark fs-6">
                    {products.length} Products
                </span>

            </div>

            {/* PRODUCTS */}
            <div className="row">

                {currentProducts.length === 0 ? (

                    <div className="col-12 text-center">
                        No products found
                    </div>

                ) : (

                    currentProducts.map((product) => {

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

            {/* ✅ PAGINATION */}
            {totalPages > 1 && (

                <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">

                    {/* PREVIOUS */}
                    <button
                        className="btn btn-outline-dark"
                        disabled={currentPage === 1}
                        onClick={() =>
                            paginate(currentPage - 1)
                        }
                    >
                        Prev
                    </button>

                    {/* PAGE NUMBERS */}
                    {[...Array(totalPages)].map((_, index) => (

                        <button
                            key={index}
                            className={`btn ${
                                currentPage === index + 1
                                    ? "btn-dark"
                                    : "btn-outline-dark"
                            }`}
                            onClick={() =>
                                paginate(index + 1)
                            }
                        >
                            {index + 1}
                        </button>

                    ))}

                    {/* NEXT */}
                    <button
                        className="btn btn-outline-dark"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            paginate(currentPage + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </div>

    );

}