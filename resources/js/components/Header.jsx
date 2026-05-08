import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { smallProductPlaceholder } from "../utils/placeholders";

export default function Header() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const cartTimeoutRef = useRef();
  const menuRef = useRef();
  const searchRef = useRef();

  // ✅ LOAD CART
  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      setCart(Array.isArray(stored) ? stored : []);
    } catch {
      setCart([]);
    }
  };

  // ✅ LOAD USER
  const loadUser = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  };

  // ✅ SEARCH PRODUCTS
  useEffect(() => {

    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {

      fetch("http://127.0.0.1:8000/api/products")
        .then(res => res.json())
        .then(data => {

          const filtered = data.filter(product =>
            product.name
              ?.toLowerCase()
              .includes(search.toLowerCase())
          );

          setSearchResults(filtered.slice(0, 6));

        })
        .catch(err => console.error(err));

    }, 300);

    return () => clearTimeout(debounce);

  }, [search]);

  // ✅ INITIAL LOAD
  useEffect(() => {

    loadCart();
    loadUser();

    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };

  }, []);

  // ✅ CLOSE USER MENU
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowSearchResults(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.finalPrice || item.price) * item.quantity,
    0
  );

  // ✅ REMOVE ITEM
  const removeItem = (index) => {

    const updated = [...cart];

    updated.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(updated));

    setCart(updated);

    window.dispatchEvent(new Event("storage"));

  };

  // ✅ LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };

  // ✅ SEARCH BUTTON
  // ✅ SEARCH BUTTON
  const handleSearch = () => {

    if (!search.trim()) return;

    navigate(
      `/search?q=${encodeURIComponent(search)}`
    );

    setShowSearchResults(false);

  };

  return (

    <div className="container py-3">

      <div className="row align-items-center">

        {/* LOGO */}
        <div className="col-md-3">

          <h3
            className="fw-bold text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            martfury
          </h3>

        </div>

        {/* SEARCH */}
        <div className="col-md-6">

          <div
            style={{ position: "relative" }}
            ref={searchRef}
          >

            <div className="input-group">

              <input
                className="form-control"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearchResults(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                className="btn btn-warning"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {/* SEARCH RESULTS */}
            {showSearchResults && searchResults.length > 0 && (

              <div
                className="shadow bg-white"
                style={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 2000,
                  borderRadius: "8px",
                  marginTop: "5px",
                  maxHeight: "350px",
                  overflowY: "auto"
                }}
              >

                {searchResults.map(product => {

                  const mainImage = product.images?.find(
                    img => img.is_main
                  );

                  const imagePath =
                    mainImage?.image_path ||
                    product.images?.[0]?.image_path;

                  const image = imagePath
                    ? `http://127.0.0.1:8000/storage/${imagePath}`
                    : smallProductPlaceholder;

                  return (

                    <div
                      key={product.id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => {

                        navigate(
                          `/product/${product.slug}/${product.id}`
                        );

                        setShowSearchResults(false);

                        setSearch("");

                      }}
                    >

                      <img
                        src={image}
                        alt={product.name}
                        style={{
                          width: "55px",
                          height: "55px",
                          objectFit: "cover",
                          borderRadius: "6px"
                        }}
                      />

                      <div className="ms-3">

                        <div className="fw-semibold">
                          {product.name}
                        </div>

                        <small className="text-danger">
                          ₦{Number(product.price).toLocaleString()}
                        </small>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

        </div>

        {/* ACTIONS */}
        <div className="col-md-3 d-flex justify-content-end align-items-center gap-4">

          {/* ❤️ Wishlist */}
          <span style={{ cursor: "pointer" }}>
            ❤
          </span>

          {/* 🛒 CART */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => {

              clearTimeout(cartTimeoutRef.current);

              setShowCart(true);

            }}
            onMouseLeave={() => {

              cartTimeoutRef.current = setTimeout(() => {
                setShowCart(false);
              }, 400);

            }}
          >

            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >

              🛒

              {totalItems > 0 && (

                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "12px",
                    padding: "2px 6px"
                  }}
                >
                  {totalItems}
                </span>

              )}

            </div>

            {/* CART DROPDOWN */}
            {showCart && (

              <div
                className="shadow bg-white p-3"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "35px",
                  width: "320px",
                  zIndex: 1000,
                  borderRadius: "8px"
                }}
                onMouseEnter={() => {
                  clearTimeout(cartTimeoutRef.current);
                }}
                onMouseLeave={() => {
                  cartTimeoutRef.current = setTimeout(() => {
                    setShowCart(false);
                  }, 400);
                }}
              >

                <h6 className="mb-3">
                  Shopping Cart
                </h6>

                {cart.length === 0 ? (

                  <p className="text-muted">
                    Cart is empty
                  </p>

                ) : (

                  <>

                    <div
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto"
                      }}
                    >

                      {cart.map((item, index) => {

                        const price = item.price;

                        const finalPrice =
                          item.finalPrice || price;

                        const hasDiscount =
                          item.discountPercent > 0;

                        return (

                          <div
                            key={index}
                            className="d-flex align-items-center mb-3"
                          >

                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px"
                              }}
                            />

                            <div className="ms-2 flex-grow-1">

                              <small className="fw-bold d-block">
                                {item.name}
                              </small>

                              {hasDiscount ? (

                                <>

                                  <small className="text-danger fw-bold d-block">
                                    ₦{Number(finalPrice).toLocaleString()} x {item.quantity}
                                  </small>

                                  <small className="text-muted text-decoration-line-through">
                                    ₦{Number(price).toLocaleString()}
                                  </small>

                                  <small className="text-success d-block">
                                    -{item.discountPercent}% OFF
                                  </small>

                                </>

                              ) : (

                                <small className="text-muted">
                                  ₦{Number(price).toLocaleString()} x {item.quantity}
                                </small>

                              )}

                            </div>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeItem(index)}
                            >
                              ✕
                            </button>

                          </div>

                        );

                      })}

                    </div>

                    <div className="border-top pt-2 mt-2">

                      <div className="d-flex justify-content-between mb-2">

                        <strong>Subtotal:</strong>

                        <strong>
                          ₦{subtotal.toLocaleString()}
                        </strong>

                      </div>

                      <button
                        className="btn btn-warning w-100"
                        onClick={() => navigate("/cart")}
                      >
                        View Cart
                      </button>

                    </div>

                  </>

                )}

              </div>

            )}

          </div>

          {/* 👤 USER */}
          <div
            ref={menuRef}
            style={{ position: "relative" }}
          >

            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                setShowUserMenu(prev => !prev)
              }
            >
              👤 {user ? user.name.split(" ")[0] : ""}
            </span>

            {showUserMenu && (

              <div
                className="shadow bg-white p-2"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "40px",
                  width: "180px",
                  borderRadius: "8px",
                  zIndex: 1000
                }}
              >

                {user ? (

                  <>

                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </button>

                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                  </>

                ) : (

                  <>

                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </button>

                  </>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}