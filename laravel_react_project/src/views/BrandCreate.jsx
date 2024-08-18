import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function BrandCreate() {
    const [brandName, setBrandName] = useState("");
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post(
                "/brands",
                {
                    brand_name: brandName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/brands"); // Redirect to the brand list after creation
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div className="card">
            <h2>Create New Brand</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="brandName">Brand Name:</label>
                    <input
                        type="text"
                        id="brandName"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                    />
                </div>
                {errors && (
                    <div className="error-message">{errors.brand_name}</div>
                )}
                <button type="submit" className="btn btn-primary">
                    Create Brand
                </button>
            </form>
        </div>
    );
}
