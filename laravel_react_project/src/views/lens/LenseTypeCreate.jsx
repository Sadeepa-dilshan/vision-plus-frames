import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function LensTypeCreate() {
    const navigate = useNavigate();

    // Hooks
    const { showAlert } = useAlert();
    const { token } = useStateContext(); // Get the auth token

    // User Input Handlers
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Create Lens Type
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            await axiosClient.post(
                `/lens-types`, // Updated endpoint for Lens Type
                { name, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showAlert("Lens Type created successfully", "success");
            navigate("/lens/lens_store"); // Adjust the redirect as needed
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
                Create Lens Type
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
                    {loading ? "Creating..." : "Create Lens Type"}
                </Button>
            </form>
        </Card>
    );
}
