import { Link } from "react-router-dom";

export default function ProductGrid() {

    const products = [
        { id: 1, name: "Military Backpack", price: 45 },
        { id: 2, name: "Linen Shirt", price: 30 },
        { id: 3, name: "White Sneaker", price: 80 },
        { id: 4, name: "Rayban Sunglasses", price: 50 },
        { id: 5, name: "Running Shorts", price: 35 },
        { id: 6, name: "Leather Watch", price: 120 },
    ];

    return (

        <div className="row">

            {products.map((p) => (

                <div className="col-md-4 mb-4" key={p.id}>

                    <Link
                        to={`/product/${p.id}`}
                        className="text-decoration-none text-dark"
                    >

                        <div className="card border-0 text-center p-2 h-100">

                            <img
                                src={smallProductPlaceholder}
                                className="img-fluid"
                            />

                            <h6 className="mt-2">{p.name}</h6>

                            <p className="text-danger fw-bold">
                                ${p.price}
                            </p>

                            <div className="text-warning">
                                ★★★★★
                            </div>

                        </div>

                    </Link>

                </div>

            ))}

        </div>

    );

}
import { smallProductPlaceholder } from "../utils/placeholders";
