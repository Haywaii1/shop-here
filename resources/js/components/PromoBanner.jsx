import { promoPlaceholder } from "../utils/placeholders";

export default function PromoBanner() {

    return (

        <div className="position-relative">

            <img
                src={promoPlaceholder}
                className="img-fluid"
            />

            <div
                className="position-absolute top-50 start-50 translate-middle text-center text-white"
            >

                <h2>20% OFF</h2>
                <h4>Mango Bag</h4>

                <button className="btn btn-warning mt-2">
                    Shop Now
                </button>

            </div>

        </div>

    )

}
