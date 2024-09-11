import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import { fetchData } from "../hooks/useFetchData";
import {
    Card,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";

export default function ColorCreate() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [colorName, setColorName] = useState(""); // Name of the color
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const getData = await fetchData("/colors", token);

            if (getData.state) {
                const exists = getData["data"].some(
                    (item) => item.color_name === colorName
                );

                if (exists) {
                    showAlert("Color already exists", "error");
                } else {
                    await axiosClient.post(
                        "/colors",
                        {
                            color_name: colorName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    navigate("/colors"); // Redirect to the color list after creation
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
                Create New Color
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Color Name"
                        value={colorName}
                        onChange={(e) =>
                            setColorName(e.target.value.toLowerCase())
                        }
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.color_name : ""}
                        required
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={24} />}
                    fullWidth
                >
                    {loading ? "Creating..." : "Create Color"}
                </Button>
            </form>
        </Card>
    );
}
