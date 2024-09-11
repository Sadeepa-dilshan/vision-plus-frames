import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { fetchData } from "../hooks/useFetchData";
import { useAlert } from "../contexts/AlertContext";
import {
    Card,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";

export default function ColorEdit() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // Get the color ID from the URL
    const [colorName, setColorName] = useState(""); // Name of the color
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the color details to pre-fill the form
        axiosClient
            .get(`/colors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setColorName(data.color_name);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, token]);

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
                    await axiosClient.put(
                        `/colors/${id}`,
                        {
                            color_name: colorName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    showAlert("Color updated successfully", "success");

                    navigate("/colors"); // Redirect to the color list after updating
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
                Edit Color
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
                    {loading ? "Updating..." : "Update Color"}
                </Button>
            </form>
        </Card>
    );
}
