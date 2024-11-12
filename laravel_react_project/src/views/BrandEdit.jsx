import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

import { useAlert } from "../contexts/AlertContext";
import {
    Button,
    CircularProgress,
    TextField,
    Card,
    Typography,
    Box,
} from "@mui/material";

import useBrand from "../hooks/useBrand";
import useBrandList from "../hooks/useBrandList";
// import useBrand from "../hooks/useBrand";

export default function BrandEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the brand ID from the URL

    //Hooks
    const { showAlert } = useAlert();
    const { brandDataList } = useBrandList();
    const { brandData, loadingBrand } = useBrand(id);
    const { token } = useStateContext(); // Get the auth token

    //User Input Handlers
    const [brandName, setBrandName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (brandData) {
            setBrandName(brandData.brand_name);
            setPrice(brandData.price);
        }
    }, [brandData, loadingBrand]);

    //Update Brand Name,Price
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (brandDataList && !loadingBrand) {
                const exists = brandDataList.some(
                    (item) =>
                        item.brand_name === brandName &&
                        parseInt(item.price) == parseInt(price)
                );

                if (exists) {
                    showAlert("Brand is already exists", "error");
                } else {
                    await axiosClient.put(
                        `/brands/${id}`,
                        { brand_name: brandName, price: price },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    showAlert("Brand updated successfully", "success");
                    navigate("/brands"); // Redirect to the brand list after updating
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Edit Brand
            </Typography>
            <form onSubmit={handleSubmit}>
                {loadingBrand ? (
                    <CircularProgress />
                ) : (
                    <div>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Brand Name"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                variant="outlined"
                                error={!!errors}
                                helperText={errors ? errors.brand_name : ""}
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Price"
                                value={price}
                                type="number"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    // Prevent entering negative numbers
                                    if (inputValue >= 0) {
                                        setPrice(inputValue);
                                    }
                                }}
                                variant="outlined"
                                error={!!errors}
                                helperText={errors ? errors.price : ""}
                                required
                            />
                        </Box>
                        <Button
                            disabled={loading}
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={
                                loading ? <CircularProgress size={24} /> : null
                            }
                        >
                            {loading ? "Updating..." : "Update Brand"}
                        </Button>
                    </div>
                )}
            </form>
        </Card>
    );
}
