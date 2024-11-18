import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Button,
    CircularProgress,
    TextField,
    Card,
    Typography,
    Box,
} from "@mui/material";
import { useAlert } from "../../contexts/AlertContext";
import { useStateContext } from "../../contexts/contextprovider";
import axiosClient from "../../axiosClient";

export default function LensTypeEdit() {
    const { id } = useParams(); // Get the lens type ID from the URL
    const navigate = useNavigate();

    // Hooks
    const { showAlert } = useAlert();
    const { token } = useStateContext(); // Get the auth token

    // State variables
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [fetching, setFetching] = useState(true); // State for initial data fetch

    // Fetch lens type data
    useEffect(() => {
        const fetchLensType = async () => {
            try {
                const { data } = await axiosClient.get(`/lens-types/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(data.name);
                setDescription(data.description);
            } catch (err) {
                showAlert(
                    "Failed to fetch lens type data. Please try again.",
                    "error"
                );
                navigate("/lens/lens_store"); // Redirect if fetching fails
            } finally {
                setFetching(false);
            }
        };
        fetchLensType();
    }, [id, token, navigate, showAlert]);

    // Update Lens Type
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            await axiosClient.patch(
                `/lens-types/${id}`, // Endpoint to update the lens type
                { name, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showAlert("Lens Type updated successfully", "success");
            navigate("/lens/add_variance"); // Redirect after successful update
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                showAlert(
                    "An error occurred while updating the lens type.",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ textAlign: "center", marginTop: 5 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Loading lens type data...
                </Typography>
            </Box>
        );
    }

    return (
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Edit Lens Type
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Lens Type Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name : ""}
                        required
                    />
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={4}
                        error={!!errors?.description}
                        helperText={
                            errors?.description ? errors.description : ""
                        }
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
                    {loading ? "Updating..." : "Update Lens Type"}
                </Button>
            </form>
        </Card>
    );
}
