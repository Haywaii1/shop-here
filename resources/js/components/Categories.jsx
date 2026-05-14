import { Link } from "react-router-dom";

export default function Categories() {

  // ✅ STORE CATEGORIES WITH REAL DB KEYWORDS
  const categories = [
    {
      name: "Phones",
      icon: "📱",
      description: "Smartphones & accessories",
      color: "#e3f2fd",
      search: "iphone samsung infinix tecno redmi phone mobile"
    },
    {
      name: "Electronics",
      icon: "💻",
      description: "Gadgets & electronics",
      color: "#ede7f6",
      search: "electronics laptop computer headset speaker charger tv macbook jbl hisense"
    },

    // ✅ MEN + WOMEN COMBINED
    {
      name: "Fashion",
      icon: "👕",
      description: "Men & women fashion",
      color: "#fce4ec",
      search: "fashion men women shirt gown jeans bag shoe sneakers hoodie wrist watch wear fossil jordan"
    },

    // ✅ BABY REPLACED WITH KITCHEN
    {
      name: "Kitchen",
      icon: "🍳",
      description: "Kitchen essentials",
      color: "#fff3e0",
      search: "kitchen blender plate spoon cooker microwave pot"
    },

    {
      name: "Toys",
      icon: "🧸",
      description: "Fun toys for kids",
      color: "#fff8e1",
      search: "toys teddy doll car game kids bicycle boys girls bike"
    }
  ];

  return (

    <div className="container my-5">

      {/* HEADER */}
      <div className="text-center mb-5">

        <span
          className="badge rounded-pill px-3 py-2 mb-3"
          style={{
            background: "#fff3cd",
            color: "#ff9800",
            fontSize: "0.85rem"
          }}
        >
          Featured Categories
        </span>

        <h2 className="fw-bold">
          Shop By Category
        </h2>

        <p
          className="text-muted mx-auto"
          style={{
            maxWidth: "500px"
          }}
        >
          Discover trending products across multiple categories
          curated specially for you.
        </p>

      </div>

      {/* CATEGORY GRID */}
      <div className="row g-4">

        {categories.map((category, index) => (

          <div
            className="col-lg-2 col-md-4 col-6"
            key={index}
          >

            {/* ✅ SEARCH USING KEYWORDS */}
            <Link
              to={`/search?q=${encodeURIComponent(category.search)}`}
              className="text-decoration-none"
            >

              <div
                className="card border-0 h-100 featured-card"
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
                }}
              >

                {/* TOP */}
                <div
                  className="position-relative"
                  style={{
                    background: category.color,
                    padding: "35px 20px"
                  }}
                >

                  <div
                    className="text-center"
                    style={{
                      fontSize: "3rem"
                    }}
                  >
                    {category.icon}
                  </div>

                </div>

                {/* BODY */}
                <div className="p-3 text-center">

                  <h6
                    className="fw-bold text-dark mb-1"
                  >
                    {category.name}
                  </h6>

                  <small
                    className="text-muted d-block"
                    style={{
                      minHeight: "38px",
                      fontSize: "0.82rem"
                    }}
                  >
                    {category.description}
                  </small>

                  {/* BUTTON */}
                  <div className="mt-3">

                    <span
                      className="btn btn-light btn-sm rounded-pill px-3"
                      style={{
                        fontSize: "0.8rem"
                      }}
                    >
                      Explore →
                    </span>

                  </div>

                </div>

              </div>

            </Link>

          </div>

        ))}

      </div>

      {/* HOVER EFFECT */}
      <style>
        {`
                    .featured-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 30px rgba(0,0,0,0.12);
                    }

                    .featured-card:hover .btn {
                        background: #ff9800;
                        color: white;
                        border-color: #ff9800;
                    }
                `}
      </style>

    </div>

  );

}