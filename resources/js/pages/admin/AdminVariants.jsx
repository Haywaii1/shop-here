import { useEffect, useState } from "react";

export default function AdminVariants() {

    const [variants, setVariants] = useState([]);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("admin_token");

    const fetchVariants = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/admin/variants", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

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
        <div className="container">

            <h3 className="my-4">All Variants</h3>

            {/* 🔍 SEARCH BAR */}
            <div className="input-group mb-3">
                <span className="input-group-text">🔍</span>
                <input
                    type="text"
                    placeholder="Search variants..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="card shadow-sm p-3">

                <table className="table">

                    <thead>
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
                                <td colSpan="6" className="text-center text-muted">
                                    No variants found
                                </td>
                            </tr>
                        ) : (
                            filtered.map(v => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>{v.product?.name || "-"}</td>
                                    <td>{v.name || "-"}</td>
                                    <td>{v.sku || "-"}</td>
                                    <td>₦{v.price}</td>
                                    <td>
                                        <span className={
                                            v.stock < 5 ? "text-danger fw-bold" : ""
                                        }>
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
    );
}