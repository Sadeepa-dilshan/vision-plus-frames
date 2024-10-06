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
    Alert,
    Skeleton,
    Card,
} from "@mui/material";
export default function FrameCreate() {
    //! TODO SAVE IMG  INSIDE FIREBASE
    const uploadSingleImages = async (ID, image, index) => {
        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `images/${ID}/${index}`);

            // Upload the image file to Firebase Storage
            await uploadBytes(storageRef, image);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            return { success: true, downloadURL };
        } catch (error) {
            console.error("Error uploading image:", error);
            return { success: false, error: error.message };
        }
    };

    //! TODO SAVE IMG  INSIDE FIREBASE
    const [brands, setBrands] = useState([]); // For storing the list of brands
    const [codes, setCodes] = useState([]); // For storing the list of codes
    const [colors, setColors] = useState([]); // For storing the list of colors
    const [brandId, setBrandId] = useState(""); // Selected brand ID
    const [codeId, setCodeId] = useState(""); // Selected code ID
    const [colorId, setColorId] = useState(""); // Selected color ID
    const [price, setPrice] = useState(""); // Frame price
    const [frameShape, setFrameShape] = useState(""); // Frame shape (Full or Half)
    const [frameSpecies, setFrameSpecies] = useState("");
    const [image, setImage] = useState(null); // Frame image
    const [quantity, setQuantity] = useState(""); // Frame quantity

    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const [filteredCodes, setfilterdCodes] = useState([]);
    const [frames, setFrames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all brands, codes, and colors to populate the dropdowns
        axiosClient
            .get("/brands", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setBrands(data);
            })
            .catch((err) => {
                console.error(err);
            });

        axiosClient
            .get("/codes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setCodes(data);
            })
            .catch((err) => {
                console.error(err);
            });

        axiosClient
            .get("/colors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setColors(data);
            })
            .catch((err) => {
                console.error(err);
            });

        axiosClient
            .get("/frames", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setFrames(data);
            })
            .catch(() => {});
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("brand_id", brandId);
        formData.append("code_id", codeId);
        formData.append("color_id", colorId);
        formData.append("price", price);
        formData.append("size", frameShape);
        formData.append("species", frameSpecies);
        formData.append("quantity", quantity);

        if (image) {
            //TODO SAVE IMG  INSIDE FIREBASE
            const imgURL = await uploadSingleImages(codeId, image, codeId);

            if (imgURL.success) {
                formData.append("image", imgURL["downloadURL"]);
            } else {
                console.log(imgURL);
            }
        }

        try {
            await axiosClient.post("/frames", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
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

    useEffect(() => {
        setfilterdCodes(
            codes.filter(
                (code) => code.brand_id === brandId // Properly filter codes
            )
        );
    }, [brandId, frames, codes]); // Include dependencies

    return (
        <Container sx={{ mt: 2 }} maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Frame
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="brandId-label">
                                Select Brand
                            </InputLabel>
                            <Select
                                labelId="brandId-label"
                                id="brandId"
                                value={brandId}
                                label="Select Brand"
                                onChange={(e) => {
                                    setBrandId(e.target.value);
                                    const selectedBrand = brands.filter(
                                        (brand) => brand.id === e.target.value
                                    );
                                    setPrice(selectedBrand[0].price);
                                }}
                                required
                            >
                                {brands.map((brand) => (
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.brand_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="codeId-label">
                                Select Code
                            </InputLabel>
                            <Select
                                labelId="codeId-label"
                                id="codeId"
                                value={codeId}
                                label="Select Code"
                                onChange={(e) => setCodeId(e.target.value)}
                                required
                            >
                                {filteredCodes.map((code) => (
                                    <MenuItem key={code.id} value={code.id}>
                                        {code.code_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="colorId-label">
                                Select Color
                            </InputLabel>
                            <Select
                                labelId="colorId-label"
                                id="colorId"
                                value={colorId}
                                label="Select Color"
                                onChange={(e) => setColorId(e.target.value)}
                                required
                            >
                                <MenuItem value="">
                                    <em>-- Select a Color --</em>
                                </MenuItem>
                                {colors.map((color) => (
                                    <MenuItem key={color.id} value={color.id}>
                                        {color.color_name}
                                    </MenuItem>
                                ))}
                            </Select>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="frameShape-label">
                                Frame Shape
                            </InputLabel>
                            <Select
                                labelId="frameShape-label"
                                id="frameShape"
                                value={frameShape}
                                label="Frame Shape"
                                onChange={(e) => setFrameShape(e.target.value)}
                                required
                            >
                                <MenuItem value="">
                                    <em>-- Select Frame Shape --</em>
                                </MenuItem>
                                <MenuItem value="Full">Full</MenuItem>
                                <MenuItem value="Half">Half</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="frameSpecies-label">
                                Frame Species
                            </InputLabel>
                            <Select
                                labelId="frameSpecies-label"
                                id="frameSpecies"
                                value={frameSpecies}
                                label="Frame Species"
                                onChange={(e) =>
                                    setFrameSpecies(e.target.value)
                                }
                                required
                            >
                                <MenuItem value="">
                                    <em>-- Select Frame Species --</em>
                                </MenuItem>
                                <MenuItem value="Plastic">Plastic</MenuItem>
                                <MenuItem value="Metal">Metal</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="quantity"
                            label="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
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
                                <Skeleton
                                    variant="rectangular"
                                    width="200px"
                                    height="200px"
                                />
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
                    {errors && (
                        <Grid item xs={12}>
                            <Alert severity="error">{errors.message}</Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Create Frame
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
