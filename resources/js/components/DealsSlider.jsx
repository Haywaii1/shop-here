import { Link } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function DealsSlider() {

    const products = [
        { name: "DJI Phantom 4", price: 900, sold: 77 },
        { name: "Apple MacBook Display", price: 500, sold: 94 },
        { name: "Samsung UHD TV", price: 350, sold: 45 },
        { name: "Linen Shirt", price: 30, sold: 158 },
        { name: "Marshall Speaker", price: 250, sold: 110 },
    ];

    return (

        <div className="container my-5">

            <div className="row text-center">

                {products.map((p, i) => (

                    <div className="col-md-2" key={i}>

                        <Link
                            to={`/product/${i}`}
                            className="text-decoration-none text-dark"
                        >

                            <div className="card border-0">

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

                                <small>Sold: {p.sold}</small>

                            </div>

                        </Link>

                    </div>

                ))}

            </div>

        </div>

    )

}
