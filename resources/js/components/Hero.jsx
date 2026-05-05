export default function Hero() {
  return (
    <div className="container my-4">
      <div className="row align-items-center bg-light p-4">

        <div className="col-md-6">
          <p className="text-danger">New Sale</p>
          <h2>iloveugly Fashion Clothing</h2>
          <h4 className="text-warning">40% OFF</h4>

          <button className="btn btn-warning mt-3">
            Shop Now
          </button>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="/images/hero-man.png"
            className="img-fluid"
          />
        </div>

      </div>
    </div>
  );
}