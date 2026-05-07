import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductVariants() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("admin_token");

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
        }
    }, [token, navigate]);

    // ✅ FETCH EXISTING VARIANTS
    const fetchVariants = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/admin/products`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            const product = data.find(p => p.id == id);

            if (product && product.variants.length > 0) {
                setVariants(product.variants);
            } else {
                setVariants([
                    { sku: "", color: "", size: "", storage: "", price: "", stock: "" }
                ]);
            }

        } catch (error) {
            console.error("Failed to load variants:", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchVariants();
    }, [token, id]);

    const addVariant = () => {
        setVariants([
            ...variants,
            { sku: "", color: "", size: "", storage: "", price: "", stock: "" }
        ]);
    };

    const removeVariant = (index) => {
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated);
    };

    const handleChange = (index, e) => {
        const updated = [...variants];
        updated[index][e.target.name] = e.target.value;
        setVariants(updated);
    };

    const saveVariants = async () => {

        setLoading(true);

        try {

            const res = await fetch(`http://127.0.0.1:8000/api/admin/products/${id}/variants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ variants })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                alert("Failed to save variants");
                setLoading(false);
                return;
            }

            alert("Variants updated successfully");

            fetchVariants();

        } catch (error) {
            console.error("Request failed:", error);
            alert("Network error");
        }

        setLoading(false);
    };

    const deleteVariant = async (variantId) => {

        if (!window.confirm("Delete this variant?")) return;

        try {

            const res = await fetch(`http://127.0.0.1:8000/api/admin/variants/${variantId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                alert("Failed to delete variant");
                return;
            }

            fetchVariants();

        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (

        <div className="container">

            <h3 className="my-4">Edit Product Variants</h3>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Storage</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th width="180">Action</th>
                    </tr>
                </thead>

                <tbody>

                    {variants.map((v, i) => (
                        <tr key={i}>

                            <td>
                                <input
                                    name="sku"
                                    value={v.sku || ""}
                                    placeholder={!v.id ? "e.g. IPHONE15-BLK-128" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td>
                                <input
                                    name="color"
                                    value={v.color || ""}
                                    placeholder={!v.id ? "Black / Silver" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td>
                                <input
                                    name="size"
                                    value={v.size || ""}
                                    placeholder={!v.id ? "15 inches" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td>
                                <input
                                    name="storage"
                                    value={v.storage || ""}
                                    placeholder={!v.id ? "128GB / 256GB" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td>
                                <input
                                    name="price"
                                    type="number"
                                    value={v.price || ""}
                                    placeholder={!v.id ? "280000" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td>
                                <input
                                    name="stock"
                                    type="number"
                                    value={v.stock || ""}
                                    placeholder={!v.id ? "10" : ""}
                                    onChange={(e) => handleChange(i, e)}
                                    className="form-control"
                                />
                            </td>

                            <td className="d-flex gap-2">

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeVariant(i)}
                                >
                                    Remove
                                </button>

                                {v.id && (
                                    <button
                                        className="btn btn-dark btn-sm"
                                        onClick={() => deleteVariant(v.id)}
                                    >
                                        Delete
                                    </button>
                                )}

                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>

            <button
                className="btn btn-secondary me-3"
                onClick={addVariant}
            >
                Add Variant
            </button>

            <button
                className="btn btn-success"
                onClick={saveVariants}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>

        </div>

    );
}
