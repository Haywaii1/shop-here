export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-warning">
      <div className="container">

        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
          ☰
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav">

            <li className="nav-item">
              <a className="nav-link text-dark">Category</a>
            </li>

            <li className="nav-item">
              <a className="nav-link text-dark">Products</a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}