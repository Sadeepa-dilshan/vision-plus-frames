import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
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
    Skeleton,
    Card,
    CircularProgress,
} from "@mui/material";
import useBrandList from "../hooks/useBrandList";
import useColorList from "../hooks/useColorList";
import useCodeList from "../hooks/useCodeList";
import DropdownInput from "../Components/DropdownInput";
import { useAlert } from "../contexts/AlertContext";
import { uploadSingleImages } from "../api/apiService";
export default function FrameCreate() {
    const { showAlert } = useAlert();
    const { token } = useStateContext(); // To handle the auth token

    //HOOKS
    const { brandDataList, loadingBrandList, refreshBrandList } =
        useBrandList();
    const { colorDataList, loadingColorList, refreshColorList } =
        useColorList();
    const { codeDataList, loadingCodeList, refreshCodeList } = useCodeList();

    const [loading, setLoading] = useState(false);

    //Handle inputs
    const [brandId, setBrandId] = useState(""); // Selected brand ID
    const [codeId, setCodeId] = useState(""); // Selected code ID
    const [colorId, setColorId] = useState(""); // Selected color ID
    const [price, setPrice] = useState(""); // Frame price
    const [frameShape, setFrameShape] = useState(""); // Frame shape (Full or Half)
    const [frameSpecies, setFrameSpecies] = useState("");
    const [image, setImage] = useState(null); // Frame image
    const [quantity, setQuantity] = useState(""); // Frame quantity

    const [errors, setErrors] = useState(null);
    const [filteredCodes, setfilterdCodes] = useState([]);

    const handleBrandListSelectionChange = (selectedValue) => {
        setBrandId(selectedValue);
    };
    const handleColorListSelectionChange = (selectedValue) => {
        setColorId(selectedValue);
    };
    const handleCodeListSelectionChange = (selectedValue) => {
        setCodeId(selectedValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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

            setBrandId(null);
            setCodeId(null);
            setColorId(null);
            setPrice("");
            setQuantity("");
            setFrameShape("");
            setFrameSpecies("");
            setImage(null);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
                showAlert("Fill All the frame details", "error");
            } else {
                showAlert("Refresh the page & try again", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setfilterdCodes(
            codeDataList.filter(
                (code) => code.brand_id === brandId // Properly filter codes
            )
        );
    }, [brandId, codeDataList]); // Include dependencies frameDataList

    return (
        <Container sx={{ mt: 2 }} maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Frame
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Brand Dropdown */}
                    <Grid item xs={12}>
                        <DropdownInput
                            //pass array list [{name: "Brand 1", id: 1}]
                            options={brandDataList.map((brand) => ({
                                name: brand.brand_name,
                                id: brand.id,
                            }))}
                            onChange={handleBrandListSelectionChange} // Will receive the selected brand's id
                            loading={loadingBrandList}
                            labelName="Select Brand"
                            defaultId={brandId} // Pass the Defalt value
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DropdownInput
                            options={filteredCodes.map((code) => ({
                                name: code.code_name,
                                id: code.id,
                            }))}
                            onChange={handleCodeListSelectionChange} // Will receive the selected brand's id
                            loading={loadingCodeList}
                            labelName="Select Code"
                            defaultId={codeId} // Pass the Defalt value
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DropdownInput
                            options={colorDataList.map((color) => ({
                                name: color.color_name,
                                id: color.id,
                            }))}
                            onChange={handleColorListSelectionChange} // Will receive the selected brand's id
                            loading={loadingColorList}
                            labelName="Select Color"
                            defaultId={colorId} // Pass the Defalt value
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="price"
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => {
                                if (e.target.value >= 0) {
                                    setPrice(e.target.value);
                                }
                            }}
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
                            onChange={(e) => {
                                if (e.target.value >= 0) {
                                    setQuantity(e.target.value);
                                }
                            }}
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

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} /> creating...
                                </>
                            ) : (
                                "Create Frame"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
