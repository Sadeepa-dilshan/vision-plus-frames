import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function FrameEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useStateContext();
    const [frame, setFrame] = useState({
        brand_id: '',
        code_id: '',
        color_id: '',
        price: '',
        size: '',
        image: '',
        quantity: '',
    });
    const [brands, setBrands] = useState([]);
    const [codes, setCodes] = useState([]);
    const [colors, setColors] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        getFrameDetails();
        getBrands();
        getCodes();
        getColors();
    }, [id]);

    const getFrameDetails = () => {
        axiosClient.get(`/frames/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setFrame({
                ...data,
                quantity: data.stocks.length ? data.stocks[0].qty : '',
            });
            setImagePreview(`${process.env.REACT_APP_API_URL}/images/frames/${data.image}`);
        })
        .catch(() => {
            console.error('Failed to fetch frame details');
        });
    };

    const getBrands = () => {
        axiosClient.get('/brands', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setBrands(data);
        });
    };

    const getCodes = () => {
        axiosClient.get('/codes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setCodes(data);
        });
    };

    const getColors = () => {
        axiosClient.get('/colors', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setColors(data);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFrame({ ...frame, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFrame({ ...frame, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand_id', frame.brand_id || '');
        formData.append('code_id', frame.code_id || '');
        formData.append('color_id', frame.color_id || '');
        formData.append('price', frame.price || '');
        formData.append('size', frame.size || '');
        formData.append('quantity', frame.quantity || '');
        if (frame.image instanceof File) {
            formData.append('image', frame.image);
        }

        try {
            await axiosClient.post(`/frames/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            navigate('/frames'); // Redirect to frame list after editing
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
            <h2>Edit Frame</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="brand_id">Select Brand:</label>
                    <select
                        id="brand_id"
                        name="brand_id"
                        value={frame.brand_id}
                        onChange={handleInputChange}
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
                    <label htmlFor="code_id">Select Code:</label>
                    <select
                        id="code_id"
                        name="code_id"
                        value={frame.code_id}
                        onChange={handleInputChange}
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
                    <label htmlFor="color_id">Select Color:</label>
                    <select
                        id="color_id"
                        name="color_id"
                        value={frame.color_id}
                        onChange={handleInputChange}
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
                        name="price"
                        value={frame.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="size">Frame Shape:</label>
                    <select
                        id="size"
                        name="size"
                        value={frame.size}
                        onChange={handleInputChange}
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
                        name="quantity"
                        value={frame.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                    />
                    {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
                </div>
                {errors && <div className="error-message">{errors.message}</div>}
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}
