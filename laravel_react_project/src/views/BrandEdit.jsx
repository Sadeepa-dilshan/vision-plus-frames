import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function BrandEdit() {
    const { id } = useParams(); // Get the brand ID from the URL
    const [brandName, setBrandName] = useState("");
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // Get the auth token
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient
            .get(`/brands/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setBrandName(data.brand_name);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.put(
                `/brands/${id}`,
                {
                    brand_name: brandName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/brands"); // Redirect to the brand list after updating
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
            <h2>Edit Brand</h2>
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
                    Update Brand
                </button>
            </form>
        </div>
    );
}
