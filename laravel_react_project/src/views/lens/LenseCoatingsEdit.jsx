import React, { useState, useEffect } from "react";
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

export default function LenseCoatingsEdit() {
    const { id } = useParams(); // Get the lens coating ID from the URL
    const navigate = useNavigate();

    // Hooks
    const { showAlert } = useAlert();
    const { token } = useStateContext();

    // State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loadingCoating, setLoadingCoating] = useState(true);

    // Fetch Existing Lens Coating
    useEffect(() => {
        const fetchLensCoating = async () => {
            try {
                const response = await axiosClient.get(`/lens-coatings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(response.data.name);
                setDescription(response.data.description);
            } catch (err) {
                showAlert("Failed to load lens coating details", "error");
            } finally {
                setLoadingCoating(false);
            }
        };

        fetchLensCoating();
    }, [id, token]);

    // Update Lens Coating
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            await axiosClient.put(
                `/lens-coatings/${id}`,
                { name, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showAlert("Lens Coating updated successfully", "success");
            // navigate("/lens/add_variance");
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
                Edit Lens Coating
            </Typography>
            {loadingCoating ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginBottom: 3 }}>
                        <TextField
                            fullWidth
                            label="Lens Coating Name"
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
                        startIcon={
                            loading ? <CircularProgress size={24} /> : null
                        }
                    >
                        {loading ? "Updating..." : "Update Lens Coating"}
                    </Button>
                </form>
            )}
        </Card>
    );
}
