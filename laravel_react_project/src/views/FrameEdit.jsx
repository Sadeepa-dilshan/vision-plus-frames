import { useEffect, useState } from "react";
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
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Typography,
    Autocomplete,
    Skeleton,
} from "@mui/material";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditLoading from "../Components/EditLoading";

export default function FrameEdit() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [loadinginitial, setLoadinginitial] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useStateContext();
    const [frame, setFrame] = useState({
        brand_id: "",
        code_id: "",
        color_id: "",
        price: "",
        size: "",
        species: "",
        image: "",
        quantity: "",
        branch: "",
    });
    const [defaltQuantity, setDefaltQuantity] = useState(0);
    const [brands, setBrands] = useState([]);

    const [codes, setCodes] = useState([]);
    const [colors, setColors] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const [filterCode, setFilterCode] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    getFrameDetails(),
                    getBrands(),
                    getCodes(),
                    getColors(),
                ]);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoadinginitial(false); // Set loading to false once data is fetched
            }
        };
        loadData();
    }, [id]);

    const uploadSingleImages = async (ID, image, index) => {
        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `images/${ID}/${index}`);

            // Upload the image file to Firebase Storage
            await uploadBytes(storageRef, image);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            return { success: true, downloadURL: downloadURL };
        } catch (error) {
            console.error("Error uploading image:", error);
            return { success: false, error: error.message };
        }
    };
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
                setImagePreview(data.image);
                setDefaltQuantity(data.stocks.length ? data.stocks[0].qty : 0);
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
        formData.append("species", frame.species || "");
        formData.append("quantity", frame.quantity || "");
        formData.append("branch", frame.branch || "");

        if (frame.code_id) {
            if (frame.image instanceof File) {
                const imageUploard = await uploadSingleImages(
                    frame.code_id,
                    frame.image,
                    frame.code_id
                );

                if (imageUploard && imageUploard.success) {
                    formData.append("image", imageUploard.downloadURL);
                } else {
                    formData.append("image", frame.image);
                }
            } else {
                formData.append("image", frame.image);
            }

            try {
                const getData = await fetchData("/frames", token);
                if (getData.state) {
                    const exists = getData["data"].some(
                        (item) => item.code_id === frame.code_id
                    );
                    if (!exists) {
                        showAlert(
                            "Frame with this code already exists",
                            "error"
                        );
                    } else {
                        //GET INPUT & FRAME TOTAL
                        formData.set("quantity", parseInt(frame.quantity));
                        formData.set("branch", "stock");
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
        }
    };
    useEffect(() => {
        if (frame.brand_id) {
            setFilterCode(
                codes.filter((code) => code.brand_id === frame.brand_id)
            );
        }
    }, [frame.brand_id, codes]);
    return (
        <Card>
            <CardHeader title="Edit Frame" />
            <CardContent>
                {loadinginitial ? (
                    <EditLoading />
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Brand Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="brand-label">
                                        Select Brand
                                    </InputLabel>
                                    <Select
                                        labelId="brand-label"
                                        id="brand_id"
                                        name="brand_id"
                                        label="Select Brand"
                                        value={frame.brand_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {brands.map((brand) => (
                                            <MenuItem
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.brand_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Code Selection */}

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="code-label">
                                        Select Code
                                    </InputLabel>
                                    <Select
                                        labelId="code-label"
                                        id="code_id"
                                        label="Select Code"
                                        name="code_id"
                                        value={frame.code_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {filterCode.map((code) => (
                                            <MenuItem
                                                key={code.id}
                                                value={code.id}
                                            >
                                                {code.code_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Color Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="color-label">
                                        Select Color
                                    </InputLabel>
                                    <Select
                                        labelId="color-label"
                                        id="color_id"
                                        name="color_id"
                                        label="Select Color"
                                        value={frame.color_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {colors.map((color) => (
                                            <MenuItem
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.color_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Price Input */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={frame.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            {/* Frame Shape Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="size-label">
                                        Frame Shape
                                    </InputLabel>
                                    <Select
                                        label="Frame Shape"
                                        labelId="size-label"
                                        id="size"
                                        name="size"
                                        value={frame.size}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <MenuItem value="Full">Full</MenuItem>
                                        <MenuItem value="Half">Half</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Frame Species Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="species-label">
                                        Frame Species
                                    </InputLabel>
                                    <Select
                                        label="Frame Species"
                                        labelId="species-label"
                                        id="species"
                                        name="species"
                                        value={frame.species}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <MenuItem value="">
                                            -- Select Frame Species --
                                        </MenuItem>
                                        <MenuItem value="Plastic">
                                            Plastic
                                        </MenuItem>
                                        <MenuItem value="Metal">Metal</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Quantity Input */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    id="quantity"
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    value={frame.quantity}
                                    onChange={handleInputChange}
                                    required
                                    disabled
                                />
                            </Grid>

                            {/* Add Select for selecting branch */}

                            {/* Image Upload */}
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal">
                                    <label htmlFor="image">
                                        <Typography variant="body1">
                                            Upload Image
                                        </Typography>
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleImageChange}
                                        style={{ marginTop: 10 }}
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            width="100"
                                            style={{ marginTop: 10 }}
                                        />
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                    fullWidth
                                    style={{ marginTop: 16 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
