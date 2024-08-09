import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function CodeCreate() {
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
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post("/codes", {
                brand_id: brandId,
                code_name: codeName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/codes"); // Redirect to the code list after creation
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
            <h2>Create New Code</h2>
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
                <button type="submit" className="btn btn-primary">Create Code</button>
            </form>
        </div>
    );
}
