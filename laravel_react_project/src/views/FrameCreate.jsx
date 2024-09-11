import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    InputLabel,
    FormControl,
    Select,
    CircularProgress,
    FormHelperText,
    Card,
    CardContent,
    Alert,
    Skeleton,
} from "@mui/material";
import { fetchData } from "../hooks/useFetchData";
import { useAlert } from "../contexts/AlertContext";

export default function FrameCreate() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [codes, setCodes] = useState([]);
    const [filteredCodes, setfilterdCodes] = useState([]);
    const [colors, setColors] = useState([]);
    const [brandId, setBrandId] = useState("");
    const [codeId, setCodeId] = useState("");
    const [colorId, setColorId] = useState("");
    const [price, setPrice] = useState("");
    const [frameShape, setFrameShape] = useState("");
    const [image, setImage] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [errors, setErrors] = useState({});
    const { token } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const [brandsRes, codesRes, colorsRes] = await Promise.all([
                    axiosClient.get("/brands", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axiosClient.get("/codes", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axiosClient.get("/colors", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setBrands(brandsRes.data);
                setCodes(codesRes.data);
                setColors(colorsRes.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDataAsync();
    }, [token]);

    const uploadSingleImage = async (ID, image) => {
        try {
            const storageRef = ref(storage, `images/${ID}`);
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);
            return { success: true, downloadURL };
        } catch (error) {
            console.error("Error uploading image:", error);
            return { success: false, error: error.message };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const getData = await fetchData("/frames", token);
            if (getData.state) {
                const exists = getData.data.some(
                    (item) => item.code_id === codeId
                );
                if (exists) {
                    showAlert("Frame with this code already exists", "error");
                    return;
                }

                const formData = new FormData();
                formData.append("brand_id", brandId);
                formData.append("code_id", codeId);
                formData.append("color_id", colorId);
                formData.append("price", price);
                formData.append("size", frameShape);
                formData.append("quantity", quantity);
                if (image) {
                    const imgURL = await uploadSingleImage(brandId, image);
                    if (imgURL.success) {
                        formData.append("image", imgURL.downloadURL);
                    } else {
                        showAlert(
                            "Error uploading image: " + imgURL.error,
                            "error"
                        );
                        return;
                    }
                }

                await axiosClient.post("/frames", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                navigate("/frames");
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

    useEffect(() => {
        setfilterdCodes(codes.filter((code) => code.brand_id === brandId));
    }, [brandId]);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Frame
            </Typography>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    error={!!errors.brand_id}
                                >
                                    <InputLabel id="brandId-label">
                                        Select Brand
                                    </InputLabel>
                                    <Select
                                        labelId="brandId-label"
                                        id="brandId"
                                        value={brandId}
                                        label="Select Brand"
                                        onChange={(e) =>
                                            setBrandId(e.target.value)
                                        }
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
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.code_id}>
                                    <InputLabel id="codeId-label">
                                        Select Code
                                    </InputLabel>
                                    <Select
                                        labelId="codeId-label"
                                        id="codeId"
                                        value={codeId}
                                        label="Select Code"
                                        onChange={(e) =>
                                            setCodeId(e.target.value)
                                        }
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>-- Select a Code --</em>
                                        </MenuItem>
                                        {filteredCodes.map((code) => (
                                            <MenuItem
                                                key={code.id}
                                                value={code.id}
                                            >
                                                {code.code_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>
                                        {errors.code_id}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    error={!!errors.color_id}
                                >
                                    <InputLabel id="colorId-label">
                                        Select Color
                                    </InputLabel>
                                    <Select
                                        labelId="colorId-label"
                                        id="colorId"
                                        value={colorId}
                                        label="Select Color"
                                        onChange={(e) =>
                                            setColorId(e.target.value)
                                        }
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="price"
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    error={!!errors.price}
                                    helperText={errors.price}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.size}>
                                    <InputLabel id="frameShape-label">
                                        Frame Shape
                                    </InputLabel>
                                    <Select
                                        labelId="frameShape-label"
                                        id="frameShape"
                                        value={frameShape}
                                        label="Frame Shape"
                                        onChange={(e) =>
                                            setFrameShape(e.target.value)
                                        }
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>-- Select Frame Shape --</em>
                                        </MenuItem>
                                        <MenuItem value="Full">Full</MenuItem>
                                        <MenuItem value="Half">Half</MenuItem>
                                    </Select>
                                    <FormHelperText>
                                        {errors.size}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="quantity"
                                    label="Quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    required
                                    error={!!errors.quantity}
                                    helperText={errors.quantity}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{ p: 2 }} variant="outlined">
                                    {image ? (
                                        <img
                                            style={{
                                                maxWidth: "200px",
                                                height: "200px",
                                                objectFit: "contain",
                                            }}
                                            src={URL.createObjectURL(image)}
                                            alt="Image Preview"
                                        />
                                    ) : (
                                        <Skeleton size={200} />
                                    )}

                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Upload Image
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) =>
                                                setImage(e.target.files[0])
                                            }
                                        />
                                    </Button>
                                </Card>
                            </Grid>
                            {errors.general && (
                                <Grid item xs={12}>
                                    <Alert severity="error">
                                        {errors.general}
                                    </Alert>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Create Frame"
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}
