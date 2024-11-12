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
import useColorList from "../hooks/useColorList";

export default function ColorCreate() {
    const navigate = useNavigate();

    const { token } = useStateContext(); // To handle the auth token
    const { showAlert } = useAlert();

    //hadle Inputs
    const [loading, setLoading] = useState(false);
    const [colorName, setColorName] = useState(""); // Name of the color
    const [errors, setErrors] = useState(null);

    //Hook
    const { colorDataList, loadingColorList } = useColorList();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const exists = colorDataList.some(
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
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
                console.log(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            sx={{
                padding: 4,
                maxWidth: 500,
                margin: "auto",
                marginTop: 5,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Create New Color
            </Typography>
            {loadingColorList ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginBottom: 3 }}>
                        <TextField
                            fullWidth
                            label="Color Name"
                            value={colorName}
                            onChange={(e) => setColorName(e.target.value)}
                            variant="outlined"
                            error={!!errors}
                            helperText={errors ? errors.color_name : ""}
                            required
                            disabled={loading}
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
            )}
        </Card>
    );
}
