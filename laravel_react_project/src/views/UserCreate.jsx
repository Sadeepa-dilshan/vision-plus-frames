import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function UserCreate() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { token } = useStateContext(); // Get the auth token

    // User state
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle form submission for creating a new user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null); // Reset any previous errors

        axiosClient
            .post("/users", user, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                showAlert("User created successfully", "success");
                navigate("/users"); // Redirect to the user list after creation
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Create New User
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.name : ""}
                        required
                    />
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        type="email"
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.email : ""}
                        required
                    />
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        type="password"
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.password : ""}
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
                    {loading ? "Creating..." : "Create User"}
                </Button>
            </form>
        </Card>
    );
}
