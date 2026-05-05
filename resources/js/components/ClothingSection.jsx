import CategorySidebar from "./CategorySidebar";
import PromoBanner from "./PromoBanner";
import ProductGrid from "./ProductGrid";

export default function ClothingSection() {

    return (

        <div className="container my-5">

            <div className="row">

                <div className="col-md-2">
                    <CategorySidebar />
                </div>

                <div className="col-md-4">
                    <PromoBanner />
                </div>

                <div className="col-md-6">
                    <ProductGrid />
                </div>

            </div>

        </div>

    )

}