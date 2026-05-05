import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DealOfTheDay() {

    const [deals, setDeals] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(86400); // 24 hours

    // ⏱ Countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 📦 Fetch products
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(data => {

                const filtered = data.filter(p => {
                    const name = p.name?.toLowerCase() || "";

                    return (
                        name.includes("jbl") ||
                        name.includes("macbook") ||
                        name.includes("hisense")
                    );
                });

                setDeals(filtered);
            });
    }, []);

    // 🔄 Auto-slide every 4 seconds
    useEffect(() => {
        if (deals.length === 0) return;

        const slider = setInterval(() => {
            setCurrentIndex(prev =>
                prev === deals.length - 1 ? 0 : prev + 1
            );
        }, 4000);

        return () => clearInterval(slider);
    }, [deals]);

    if (deals.length === 0) return null;

    const product = deals[currentIndex];

    // ✅ IMAGE
    const mainImage = product.images?.find(img => img.is_main);

    const imagePath =
        mainImage?.image_path ||
        product.images?.[0]?.image_path;

    const image = imagePath
        ? `http://127.0.0.1:8000/storage/${imagePath}`
        : wideProductPlaceholder;

    // 💰 DISCOUNT LOGIC
    const discountPercent = 20;
    const oldPrice = Number(product.price);
    const discountedPrice = oldPrice - (oldPrice * discountPercent / 100);

    return (

        <div className="container my-5">

            <div className="row align-items-center shadow p-4 rounded bg-light">

                {/* 🔥 IMAGE */}
                <div className="col-md-6 text-center">

                    <img
                        src={image}
                        className="img-fluid"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                    />

                </div>

                {/* 🔥 DETAILS */}
                <div className="col-md-6">

                    <h2 className="fw-bold mb-3">
                        Deal of the Day 🔥
                    </h2>

                    <h4>{product.name}</h4>

                    <p className="text-muted">
                        {product.description}
                    </p>

                    {/* 💰 PRICES */}
                    <div className="mb-3">

                        <span className="text-danger fs-4 fw-bold me-3">
                            ₦{discountedPrice.toLocaleString()}
                        </span>

                        <span className="text-muted text-decoration-line-through me-2">
                            ₦{oldPrice.toLocaleString()}
                        </span>

                        <span className="badge bg-danger">
                            -{discountPercent}%
                        </span>

                    </div>

                    {/* 🔥 CTA */}
                    <button
                        className="btn btn-dark px-4"
                        onClick={() =>
                            navigate(`/product/${product.slug}/${product.id}`)
                        }
                    >
                        Shop Now
                    </button>

                    {/* ⏱ TIMER */}
                    <p className="text-danger fw-bold mt-3">
                        Ends in: {Math.floor(timeLeft / 3600)}h{" "}
                        {Math.floor((timeLeft % 3600) / 60)}m{" "}
                        {timeLeft % 60}s
                    </p>

                </div>

            </div>

        </div>
    );
}
import { wideProductPlaceholder } from "../utils/placeholders";
