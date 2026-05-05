import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {

                const featured = data.filter(p => {
                    const name = p.name?.toLowerCase() || "";

                    return (
                        name.includes("apple laptop") ||
                        name.includes("iphone") ||
                        name.includes("hisense sound bar")
                    );
                });

                setProducts(featured);
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    // ✅ HANDLE CLICK (slug + sku)
    const handleClick = (product) => {

        // get first variant
        const variant = product.variants?.[0];

        if (variant) {
            navigate(`/product/${product.slug}/${variant.sku}`);
        } else {
            // fallback if no variant exists
            navigate(`/product/${product.slug}/default`);
        }
    };

    return (

        <div className="container my-5">

            <h3 className="mb-4">Featured Products</h3>

            <div className="row">

                {products.length === 0 && (
                    <p>No featured products found.</p>
                )}

                {products.map(product => {

                    // ✅ MAIN IMAGE
                    const mainImage = product.images?.find(img => img.is_main);

                    const imagePath =
                        mainImage?.image_path ||
                        product.images?.[0]?.image_path ||
                        null;

                    const image = imagePath
                        ? `http://127.0.0.1:8000/storage/${imagePath}`
                        : wideProductPlaceholder;

                    return (

                        <div key={product.id} className="col-md-4 mb-4">

                            <div
                                className="card h-100 shadow-sm product-card"
                                style={{ cursor: "pointer", transition: "0.3s" }}
                                onClick={() => handleClick(product)}
                            >

                                <img
                                    src={image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: "220px", objectFit: "cover" }}
                                />

                                <div className="card-body">

                                    <h5 className="mb-2">{product.name}</h5>

                                    <p className="text-danger fw-bold mb-2">
                                        ₦{Number(product.price).toLocaleString()}
                                    </p>

                                    {product.variants?.length > 0 && (
                                        <small className="text-success">
                                            {product.variants.length} variants available
                                        </small>
                                    )}

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}
import { wideProductPlaceholder } from "../utils/placeholders";
