import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import { fetchData } from "../hooks/useFetchData";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    FormHelperText,
    Typography,
    Card,
    CardContent,
    Grid,
} from "@mui/material";

export default function FrameEdit() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useStateContext();
    const [frame, setFrame] = useState({
        brand_id: "",
        code_id: "",
        color_id: "",
        price: "",
        size: "",
        image: "",
        quantity: "",
    });
    const [brands, setBrands] = useState([]);
    const [codes, setCodes] = useState([]);
    const [colors, setColors] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getFrameDetails();
        getBrands();
        getCodes();
        getColors();
    }, [id]);

    const getFrameDetails = () => {
        axiosClient
            .get(`/frames/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setFrame({
                    ...data,
                    quantity: data.stocks.length ? data.stocks[0].qty : "",
                });
                setImagePreview(
                    `${process.env.REACT_APP_API_URL}/images/frames/${data.image}`
                );
            })
            .catch(() => {
                console.error("Failed to fetch frame details");
            });
    };

    const getBrands = () => {
        axiosClient
            .get("/brands", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setBrands(data);
            });
    };

    const getCodes = () => {
        axiosClient
            .get("/codes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setCodes(data);
            });
    };

    const getColors = () => {
        axiosClient
            .get("/colors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("brand_id", frame.brand_id || "");
        formData.append("code_id", frame.code_id || "");
        formData.append("color_id", frame.color_id || "");
        formData.append("price", frame.price || "");
        formData.append("size", frame.size || "");
        formData.append("quantity", frame.quantity || "");
        if (frame.image instanceof File) {
            formData.append("image", frame.image);
        }

        try {
            const getData = await fetchData("/frames", token);
            if (getData.state) {
                const exists = getData["data"].some(
                    (item) => item.code_id === frame.code_id
                );
                if (exists) {
                    showAlert("Frame with this code already exists", "error");
                } else {
                    await axiosClient.post(`/frames/${id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    navigate("/frames");
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Edit Frame
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="brand_id-label">
                                    Select Brand
                                </InputLabel>
                                <Select
                                    labelId="brand_id-label"
                                    id="brand_id"
                                    name="brand_id"
                                    value={frame.brand_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>-- Select a Brand --</em>
                                    </MenuItem>
                                    {brands.map((brand) => (
                                        <MenuItem
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.brand_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {errors.brand_id}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="code_id-label">
                                    Select Code
                                </InputLabel>
                                <Select
                                    labelId="code_id-label"
                                    id="code_id"
                                    name="code_id"
                                    value={frame.code_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>-- Select a Code --</em>
                                    </MenuItem>
                                    {codes.map((code) => (
                                        <MenuItem key={code.id} value={code.id}>
                                            {code.code_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {errors.code_id}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="color_id-label">
                                    Select Color
                                </InputLabel>
                                <Select
                                    labelId="color_id-label"
                                    id="color_id"
                                    name="color_id"
                                    value={frame.color_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>-- Select a Color --</em>
                                    </MenuItem>
                                    {colors.map((color) => (
                                        <MenuItem
                                            key={color.id}
                                            value={color.id}
                                        >
                                            {color.color_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    {errors.color_id}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                id="price"
                                name="price"
                                type="number"
                                value={frame.price}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="size-label">
                                    Frame Shape
                                </InputLabel>
                                <Select
                                    labelId="size-label"
                                    id="size"
                                    name="size"
                                    value={frame.size}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>-- Select Frame Shape --</em>
                                    </MenuItem>
                                    <MenuItem value="Full">Full</MenuItem>
                                    <MenuItem value="Half">Half</MenuItem>
                                </Select>
                                <FormHelperText>{errors.size}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Quantity"
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={frame.quantity}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={!!errors.quantity}
                                helperText={errors.quantity}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        width="100"
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                                {errors.image && (
                                    <FormHelperText error>
                                        {errors.image}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <div style={{ marginTop: 20 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
