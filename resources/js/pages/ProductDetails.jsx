import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productPlaceholder } from "../utils/placeholders";

export default function ProductDetails() {

    const { slug, sku } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {

                const found = data.find(p => p.slug === slug);
                setProduct(found);

                if (!found) return;

                if (found.images?.length > 0) {
                    const main = found.images.find(img => img.is_main);
                    setSelectedImage(main || found.images[0]);
                }

                if (found.variants?.length > 0) {
                    const variant =
                        found.variants.find(v => v.sku === sku) ||
                        found.variants[0];

                    setSelectedVariant(variant);
                }
            });

    }, [slug, sku]);

    if (!product) return <p className="p-5">Loading product...</p>;

    const price = Number(selectedVariant?.price || product.price);
    const stock = selectedVariant?.stock ?? product.stock ?? 0;

    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;

    const imageUrl = selectedImage
        ? `http://127.0.0.1:8000/storage/${selectedImage.image_path}`
        : productPlaceholder;

    // 🛒 ADD TO CART
    const handleAddToCart = () => {

        if (isOutOfStock) {
            alert("This product is out of stock");
            return;
        }

        if (quantity > stock) {
            alert("Not enough stock");
            return;
        }

        let cart = [];

        // ✅ SAFE PARSE
        try {
            const stored = localStorage.getItem("cart");
            cart = stored ? JSON.parse(stored) : [];

            if (!Array.isArray(cart)) cart = [];
        } catch {
            cart = [];
        }

        const productId = Number(product.id);
        const variantId = selectedVariant?.id ?? null;
        const finalPrice = Number(price);

        // 🚨 VALIDATION (VERY IMPORTANT)
        if (!productId) {
            alert("Invalid product");
            return;
        }

        const existing = cart.find(item =>
            Number(item.product_id) === productId &&
            (item.variant_id ?? null) === variantId
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                product_id: productId,
                variant_id: variantId,
                name: product.name,
                price: finalPrice,
                quantity,
                image: imageUrl
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // 🔥 SYNC HEADER / OTHER COMPONENTS
        window.dispatchEvent(new Event("cartUpdated"));

        alert("Added to cart 🛒");
    };

    const handleBuyNow = () => {

        if (isOutOfStock) {
            alert("This product is out of stock");
            return;
        }

        handleAddToCart();
        navigate("/checkout");
    };

    return (

        <div className="container my-5">

            <div className="row g-5">

                {/* 🔥 LEFT - IMAGES */}
                <div className="col-md-6">

                    <div className="border rounded p-3 bg-white">

                        <img
                            src={imageUrl}
                            className="img-fluid"
                            style={{ height: "400px", objectFit: "contain" }}
                        />

                    </div>

                    {/* THUMBNAILS */}
                    <div className="d-flex gap-2 mt-3">

                        {product.images?.map(img => (

                            <img
                                key={img.id}
                                src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    border: selectedImage?.id === img.id
                                        ? "2px solid #000"
                                        : "1px solid #ddd"
                                }}
                                onClick={() => setSelectedImage(img)}
                            />

                        ))}

                    </div>

                </div>

                {/* 🔥 RIGHT - DETAILS */}
                <div className="col-md-6">

                    <h3 className="fw-bold">{product.name}</h3>

                    {/* ⭐ RATING */}
                    <div className="mb-2 text-warning">
                        ⭐⭐⭐⭐☆ <small className="text-muted">(120 reviews)</small>
                    </div>

                    {/* 💰 PRICE */}
                    <h2 className="text-danger fw-bold">
                        ₦{Number(price).toLocaleString()}
                    </h2>

                    <p className="text-muted">{product.description}</p>

                    {/* 🚚 DELIVERY */}
                    <div className="bg-light p-3 rounded mb-3">
                        <p className="mb-1">🚚 Delivery: 2-5 working days</p>
                        <p className="mb-0">📍 Location: Nigeria</p>
                    </div>

                    {/* 🎨 VARIANTS */}
                    {product.variants?.length > 0 && (
                        <>
                            <h6>Choose Option:</h6>

                            <div className="d-flex flex-wrap gap-2 mb-3">

                                {product.variants.map(v => {

                                    const disabled = v.stock <= 0;

                                    return (
                                        <button
                                            key={v.id}
                                            disabled={disabled}
                                            className={`btn btn-sm ${selectedVariant?.id === v.id
                                                ? "btn-dark"
                                                : "btn-outline-dark"
                                                } ${disabled ? "opacity-50" : ""}`}
                                            onClick={() => !disabled && setSelectedVariant(v)}
                                        >
                                            {v.color || "Default"} {v.storage && `- ${v.storage}`}
                                            {disabled && " (Out)"}
                                        </button>
                                    );
                                })}

                            </div>
                        </>
                    )}

                    {/* 📦 STOCK STATUS */}
                    <p>
                        {isOutOfStock ? (
                            <span className="text-danger fw-bold">❌ Out of Stock</span>
                        ) : isLowStock ? (
                            <span className="text-warning fw-bold">
                                ⚠ Only {stock} left!
                            </span>
                        ) : (
                            <>Stock: <strong>{stock}</strong></>
                        )}
                    </p>

                    {/* 🔢 QUANTITY */}
                    <div className="mb-3">
                        <label className="mb-1">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max={stock}
                            value={quantity}
                            disabled={isOutOfStock}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="form-control"
                            style={{ width: "120px" }}
                        />
                    </div>

                    {/* 🔥 ACTIONS */}
                    <div className="d-flex gap-3">

                        <button
                            className="btn btn-warning w-50"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                        </button>

                        <button
                            className="btn btn-dark w-50"
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Unavailable" : "⚡ Buy Now"}
                        </button>

                    </div>

                    {/* 🔒 TRUST */}
                    <div className="mt-4 text-muted small">
                        ✔ Secure Payment <br />
                        ✔ 7 Days Return Policy <br />
                        ✔ 100% Original Products
                    </div>

                </div>

            </div>

            {/* 🔥 DESCRIPTION */}
            <div className="mt-5">

                <h4>Description</h4>
                <p>{product.description}</p>

            </div>

        </div>
    );
}
