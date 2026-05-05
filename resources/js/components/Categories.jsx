import { Link } from "react-router-dom";

export default function Categories() {

  const categories = [
    { name: "iPhone", price: "$249" },
    { name: "Leather Chair", price: "$199" },
    { name: "Nutri Blender", price: "$149" }
  ];

  return (

    <div className="container my-4">

      <div className="row">

        {categories.map((cat, i) => (

          <div className="col-md-4" key={i}>

            <Link
              to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-decoration-none text-dark"
            >

              <div className="border p-3 text-center">

                <h5>{cat.name}</h5>

                <p>{cat.price}</p>

              </div>

            </Link>

          </div>

        ))}

      </div>

    </div>

  );

}