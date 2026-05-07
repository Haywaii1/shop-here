import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { wideProductPlaceholder } from "../utils/placeholders";

export default function DealOfTheDay() {
    const [deals, setDeals] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/deals")
            .then((res) => res.json())
            .then((data) => setDeals(data))
            .catch((err) => console.error("Deals error:", err));
    }, []);

    useEffect(() => {
        if (deals.length === 0) return;

        const slider = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === deals.length - 1 ? 0 : prev + 1
            );
        }, 4000);

        return () => clearInterval(slider);
    }, [deals]);

    useEffect(() => {
        if (deals.length === 0) return;

        const deal = deals[currentIndex];

        const updateTimer = () => {
            if (!deal?.deal_ends_at) {
                setTimeLeft(0);
                return;
            }

            const endTime = new Date(deal.deal_ends_at).getTime();
            const secondsLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

            setTimeLeft(secondsLeft);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [deals, currentIndex]);

    if (deals.length === 0) return null;

    const product = deals[currentIndex];
    const mainImage = product.images?.find((img) => img.is_main);

    const imagePath =
        mainImage?.image_path ||
        product.images?.[0]?.image_path;

    const image = imagePath
        ? `http://127.0.0.1:8000/storage/${imagePath}`
        : wideProductPlaceholder;

    const discountPercent = Number(product.deal_percentage || 0);
    const oldPrice = Number(product.price);
    const discountedPrice = oldPrice - ((oldPrice * discountPercent) / 100);

    return (
        <div className="container my-5">
            <div className="row align-items-center shadow p-4 rounded bg-light">
                <div className="col-md-6 text-center">
                    <img
                        src={image}
                        className="img-fluid"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                </div>

                <div className="col-md-6">
                    <h2 className="fw-bold mb-3">Deal of the Day</h2>

                    <h4>{product.name}</h4>

                    <p className="text-muted">{product.description}</p>

                    <div className="mb-3">
                        <span className="text-danger fs-4 fw-bold me-3">
                            N{discountedPrice.toLocaleString()}
                        </span>

                        <span className="text-muted text-decoration-line-through me-2">
                            N{oldPrice.toLocaleString()}
                        </span>

                        <span className="badge bg-danger">
                            -{discountPercent}%
                        </span>
                    </div>

                    <button
                        className="btn btn-dark px-4"
                        onClick={() => navigate(`/product/${product.slug}/${product.id}`)}
                    >
                        Shop Now
                    </button>

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
