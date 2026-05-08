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

                const filtered = data.filter(product => {

                    const name =
                        product.name?.toLowerCase() || "";

                    const category =
                        product.category?.name?.toLowerCase() || "";

                    const searchText =
                        query?.toLowerCase() || "";

                    return (
                        name.includes(searchText) ||
                        category.includes(searchText)
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

            <h3 className="mb-4">
                Search Results for "{query}"
            </h3>

            {products.length === 0 ? (

                <div className="alert alert-warning">
                    No products found.
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

                        return (

                            <div
                                key={product.id}
                                className="col-md-3 mb-4"
                            >

                                <div
                                    className="card h-100 border-0 shadow-sm"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(
                                            `/product/${product.slug}/${product.id}`
                                        )
                                    }
                                >

                                    <div
                                        style={{
                                            height: "220px",
                                            overflow: "hidden",
                                            background: "#f8f8f8"
                                        }}
                                    >

                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-100 h-100"
                                            style={{
                                                objectFit: "contain"
                                            }}
                                        />

                                    </div>

                                    <div className="card-body">

                                        <h6 className="fw-bold">
                                            {product.name}
                                        </h6>

                                        <small className="text-muted d-block mb-2">
                                            {product.category?.name}
                                        </small>

                                        <div className="text-danger fw-bold">
                                            ₦{Number(product.price).toLocaleString()}
                                        </div>

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