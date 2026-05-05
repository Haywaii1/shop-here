import { Link } from "react-router-dom";

export default function Features() {

  const items = [
    { name: "Free Delivery", path: "/free-delivery" },
    { name: "30 Days Return", path: "/returns" },
    { name: "Secure Payment", path: "/secure-payment" },
    { name: "24/7 Support", path: "/support" }
  ];

  return (

    <div className="container my-4">

      <div className="row text-center">

        {items.map((item, i) => (

          <div className="col-md-3" key={i}>

            <Link
              to={item.path}
              className="text-decoration-none text-dark"
            >

              <div className="border p-3">

                <h6>{item.name}</h6>

              </div>

            </Link>

          </div>

        ))}

      </div>

    </div>

  );

}