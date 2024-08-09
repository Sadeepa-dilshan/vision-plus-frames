import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function CodeEdit() {
    const { id } = useParams(); // Get the code ID from the URL
    const [brands, setBrands] = useState([]); // For storing the list of brands
    const [brandId, setBrandId] = useState(""); // Selected brand ID
    const [codeName, setCodeName] = useState(""); // Name of the code
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all brands to populate the dropdown
        axiosClient.get('/brands', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setBrands(data);
        })
        .catch((err) => {
            console.error(err);
        });

        // Fetch the code details to pre-fill the form
        axiosClient.get(`/codes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setBrandId(data.brand_id);
            setCodeName(data.code_name);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.put(`/codes/${id}`, {
                brand_id: brandId,
                code_name: codeName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/codes"); // Redirect to the code list after updating
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
            <h2>Edit Code</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="brandId">Select Brand:</label>
                    <select
                        id="brandId"
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Brand --</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.brand_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="codeName">Code Name:</label>
                    <input
                        type="text"
                        id="codeName"
                        value={codeName}
                        onChange={(e) => setCodeName(e.target.value)}
                        required
                    />
                </div>
                {errors && <div className="error-message">{errors.code_name}</div>}
                <button type="submit" className="btn btn-primary">Update Code</button>
            </form>
        </div>
    );
}
