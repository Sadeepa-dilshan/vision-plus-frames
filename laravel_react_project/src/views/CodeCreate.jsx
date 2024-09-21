import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { fetchData } from "../hooks/useFetchData";
import { useAlert } from "../contexts/AlertContext";
import {
    Card,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Box,
} from "@mui/material";

export default function CodeCreate() {
    const { showAlert } = useAlert();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [brandId, setBrandId] = useState("");
    const [codeName, setCodeName] = useState("");
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all brands to populate the dropdown
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
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const getData = await fetchData("/codes", token);
            if (getData.state) {
                const exists = getData["data"].some(
                    (item) =>
                        item.brand_id === brandId && item.code_name === codeName
                );
                if (exists) {
                    showAlert("Code already exists", "error");
                } else {
                    await axiosClient.post(
                        "/codes",
                        {
                            brand_id: brandId,
                            code_name: codeName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    showAlert("Code created successfully", "success");
                    navigate("/codes");
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
                Create New Code
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Brand</InputLabel>
                        <Select
                            label="Select Brand"
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            required
                        >
                            <MenuItem value="">
                                <em>-- Select a Brand --</em>
                            </MenuItem>
                            {brands.map((brand) => (
                                <MenuItem
                                    sx={{ textTransform: "capitalize" }}
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.brand_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Code Name"
                        value={codeName}
                        onChange={(e) => setCodeName(e.target.value)}
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.code_name : ""}
                        required
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        disabled={loading}
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={
                            loading ? <CircularProgress size={24} /> : null
                        }
                    >
                        {loading ? "Creating..." : "Create Code"}
                    </Button>
                </Box>
            </form>
        </Card>
    );
}
