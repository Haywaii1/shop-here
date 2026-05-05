import { Link } from "react-router-dom";

export default function CategorySidebar() {

    const categories = [
        "Best Seller",
        "New Arrivals",
        "Women",
        "Men",
        "Girls",
        "Boys",
        "Baby",
        "Sales & Deals"
    ];

    return (

        <div className="border p-3">

            <h6 className="fw-bold">
                Clothing & Apparel
            </h6>

            <ul className="list-unstyled mt-3">

                {categories.map((c, i) => (

                    <li key={i} className="mb-2">

                        <Link
                            to={`/category/${c.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-decoration-none text-muted"
                        >

                            {c}

                        </Link>

                    </li>

                ))}

            </ul>

        </div>

    );

}