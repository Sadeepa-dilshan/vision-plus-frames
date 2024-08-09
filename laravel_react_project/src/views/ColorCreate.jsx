import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function ColorCreate() {
    const [colorName, setColorName] = useState(""); // Name of the color
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post("/colors", {
                color_name: colorName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate("/colors"); // Redirect to the color list after creation
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
            <h2>Create New Color</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="colorName">Color Name:</label>
                    <input
                        type="text"
                        id="colorName"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        required
                    />
                </div>
                {errors && <div className="error-message">{errors.color_name}</div>}
                <button type="submit" className="btn btn-primary">Create Color</button>
            </form>
        </div>
    );
}
