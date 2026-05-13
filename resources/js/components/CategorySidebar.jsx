import { Link } from "react-router-dom";

export default function CategorySidebar() {

  const categories = [
    {
      name: "Best Seller",
      icon: "🔥"
    },
    {
      name: "New Arrivals",
      icon: "✨"
    },
    {
      name: "Women",
      icon: "👗"
    },
    {
      name: "Men",
      icon: "👕"
    },
    {
      name: "Girls",
      icon: "🎀"
    },
    {
      name: "Boys",
      icon: "🧢"
    },
    {
      name: "Baby",
      icon: "🍼"
    },
    {
      name: "Toys",
      icon: "🧸"
    },
    {
      name: "Sales & Deals",
      icon: "🏷️"
    }
  ];

  // ✅ CATEGORY ROUTES
  const getCategoryLink = (categoryName) => {

    switch (categoryName) {

      case "Men":
        return "/search?q=men";

      case "Women":
        return "/search?q=women";

      case "Girls":
        return "/search?q=girls";

      case "Boys":
        return "/search?q=boys";

      case "Baby":
        return "/search?q=baby";

      // ✅ TOYS PRODUCTS
      case "Toys":
        return "/search?q=toys";

      // ✅ PRODUCTS WITH DISCOUNTS / DEALS
      case "Sales & Deals":
        return "/deals";

      // ✅ BEST SELLERS
      case "Best Seller":
        return "/search?q=best";

      // ✅ NEWLY ADDED PRODUCTS
      case "New Arrivals":
        return "/search?q=latest";

      default:
        return `/category/${categoryName
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

    }

  };

  return (

    <div
      className="bg-white rounded-4 shadow-sm overflow-hidden"
      style={{
        border: "1px solid #f1f1f1"
      }}
    >

      {/* HEADER */}
      <div
        className="px-4 py-3 text-white"
        style={{
          background:
            "linear-gradient(135deg, #ffb300, #ff8f00)"
        }}
      >

        <h5 className="fw-bold mb-1">
          Clothing & Apparel
        </h5>

        <small className="text-light">
          Browse categories
        </small>

      </div>

      {/* CATEGORY LIST */}
      <div className="p-2">

        {categories.map((category, index) => (

          <Link
            key={index}
            to={getCategoryLink(category.name)}
            className="d-flex align-items-center justify-content-between text-decoration-none text-dark px-3 py-3 rounded-3 category-item"
            style={{
              transition: "0.3s"
            }}
          >

            <div className="d-flex align-items-center">

              <span
                className="me-3"
                style={{
                  fontSize: "1.1rem"
                }}
              >
                {category.icon}
              </span>

              <div>

                <span
                  className="fw-medium d-block"
                  style={{
                    fontSize: "0.95rem"
                  }}
                >
                  {category.name}
                </span>

                {/* SMALL LABELS */}
                {category.name === "Sales & Deals" && (
                  <small className="text-danger">
                    Discounted products
                  </small>
                )}

                {category.name === "New Arrivals" && (
                  <small className="text-success">
                    Newly added products
                  </small>
                )}

                {category.name === "Best Seller" && (
                  <small className="text-warning">
                    Trending products
                  </small>
                )}

                {category.name === "Toys" && (
                  <small className="text-primary">
                    Fun toys & games
                  </small>
                )}

              </div>

            </div>

            <span className="text-muted">
              ›
            </span>

          </Link>

        ))}

      </div>

      {/* HOVER STYLE */}
      <style>
        {`
          .category-item:hover {
            background: #fff8e1;
            transform: translateX(4px);
          }
        `}
      </style>

    </div>

  );

}