import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminVariants() {

    const [variants, setVariants] = useState([]);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("admin_token");

    const fetchVariants = async () => {

        try {

            const res = await fetch(
                "http://127.0.0.1:8000/api/admin/variants",
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {

                console.error(data);

                setVariants([]);

                return;

            }

            setVariants(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

            setVariants([]);

        }

    };

    useEffect(() => {

        fetchVariants();

    }, []);

    // 🔍 FILTER
    const filtered = variants.filter(v =>

        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.sku?.toLowerCase().includes(search.toLowerCase()) ||
        v.product?.name?.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div className="container py-4">

            {/* 🔙 BACK BUTTON */}
            <div className="mb-3">

                <Link
                    to="/admin/dashboard"
                    className="btn btn-outline-dark rounded-pill px-4"
                >
                    ← Back to Admin Dashboard
                </Link>

            </div>

            {/* PAGE TITLE */}
            <div className="mb-4">

                <h3 className="fw-bold">
                    All Variants
                </h3>

                <p className="text-muted mb-0">
                    Manage all product variants in your store
                </p>

            </div>

            {/* 🔍 SEARCH BAR */}
            <div className="input-group mb-4 shadow-sm">

                <span className="input-group-text bg-white border-end-0">
                    🔍
                </span>

                <input
                    type="text"
                    placeholder="Search variants, SKU or products..."
                    className="form-control border-start-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* TABLE */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                <div className="table-responsive">

                    <table className="table align-middle mb-0">

                        <thead className="table-light">

                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Variant</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filtered.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-4"
                                    >
                                        No variants found
                                    </td>

                                </tr>

                            ) : (

                                filtered.map(v => (

                                    <tr key={v.id}>

                                        <td>
                                            #{v.id}
                                        </td>

                                        <td className="fw-semibold">
                                            {v.product?.name || "-"}
                                        </td>

                                        <td>
                                            {v.name || "-"}
                                        </td>

                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {v.sku || "-"}
                                            </span>
                                        </td>

                                        <td className="fw-bold">
                                            ₦{Number(v.price).toLocaleString()}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${
                                                    v.stock < 5
                                                        ? "bg-danger"
                                                        : "bg-success"
                                                }`}
                                            >
                                                {v.stock}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}