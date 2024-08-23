import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function FrameCreate() {
    const [brands, setBrands] = useState([]); // For storing the list of brands
    const [codes, setCodes] = useState([]); // For storing the list of codes
    const [colors, setColors] = useState([]); // For storing the list of colors
    const [brandId, setBrandId] = useState(""); // Selected brand ID
    const [codeId, setCodeId] = useState(""); // Selected code ID
    const [colorId, setColorId] = useState(""); // Selected color ID
    const [price, setPrice] = useState(""); // Frame price
    const [frameShape, setFrameShape] = useState(""); // Frame shape (Full or Half)
    const [image, setImage] = useState(null); // Frame image
    const [quantity, setQuantity] = useState(""); // Frame quantity
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all brands, codes, and colors to populate the dropdowns
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

        axiosClient.get('/codes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setCodes(data);
        })
        .catch((err) => {
            console.error(err);
        });

        axiosClient.get('/colors', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setColors(data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('brand_id', brandId);
        formData.append('code_id', codeId);
        formData.append('color_id', colorId);
        formData.append('price', price);
        formData.append('size', frameShape); // Changed to frameShape
        formData.append('quantity', quantity);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axiosClient.post("/frames", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            navigate("/frames"); // Redirect to the frame list after creation
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
            <h2>Create New Frame</h2>
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
                    <label htmlFor="codeId">Select Code:</label>
                    <select
                        id="codeId"
                        value={codeId}
                        onChange={(e) => setCodeId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Code --</option>
                        {codes.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.code_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="colorId">Select Color:</label>
                    <select
                        id="colorId"
                        value={colorId}
                        onChange={(e) => setColorId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a Color --</option>
                        {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.color_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="frameShape">Frame Shape:</label>
                    <select
                        id="frameShape"
                        value={frameShape}
                        onChange={(e) => setFrameShape(e.target.value)}
                        required
                    >
                        <option value="">-- Select Frame Shape --</option>
                        <option value="Full">Full</option>
                        <option value="Half">Half</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                {errors && <div className="error-message">{errors.message}</div>}
                <button type="submit" className="btn btn-primary">Create Frame</button>
            </form>
        </div>
    );
}
