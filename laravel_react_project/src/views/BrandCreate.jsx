import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { fetchData } from "../hooks/useFetchData";
import { useAlert } from "../contexts/AlertContext";
import {
    Button,
    CircularProgress,
    TextField,
    Card,
    Typography,
    Box,
} from "@mui/material";

export default function BrandCreate() {
    const [brandName, setBrandName] = useState("");
    const [price, setPrice] = useState("");
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const getData = await fetchData("/brands", token);

            if (getData.state) {
                const exists = getData["data"].some(
                    (item) => item.brand_name === brandName
                );
                if (exists) {
                    showAlert("Brand already exists", "error");
                } else {
                    await axiosClient.post(
                        "/brands",
                        {
                            brand_name: brandName,
                            price: price,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    showAlert("Brand created successfully", "success");
                    navigate("/brands"); // Redirect to the brand list after creation
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
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Create New Brand
            </Typography>
            <form onSubmit={handleSubmit}>
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
                        onChange={(e) => setPrice(e.target.value)}
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
                    startIcon={loading ? <CircularProgress size={24} /> : null}
                >
                    {loading ? "Creating..." : "Create Brand"}
                </Button>
            </form>
        </Card>
    );
}
