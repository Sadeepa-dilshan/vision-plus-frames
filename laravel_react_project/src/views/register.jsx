import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useAlert } from "../contexts/AlertContext";

export default function Register() {
    const { showAlert } = useAlert();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Clear any previous errors

        const payload = {
            name,
            email,
            password,
        };

        try {
            const { data } = await axiosClient.post("/register", payload);
            setUser(data.user);
            setToken(data.token);
            setLoading(false); // Stop loading
            showAlert("Registration successful!", "success");
        } catch (err) {
            console.log("Error:", err);
            setLoading(false); // Stop loading
            const response = err.response;
            console.log("Error response:", err.response); // Log the error response

            if (response && response.status === 422) {
                setError(response.data.message);
                showAlert(response.data.message, "error");
            } else {
                setError("An unexpected error occurred. Please try again.");
                showAlert(
                    "An unexpected error occurred. Please try again.",
                    "error"
                );
            }
        }
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{
                backgroundImage: 'url("/images/4676.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
                    zIndex: 1,
                }}
            />

            <Paper
                variant="elevation"
                elevation={3}
                sx={{
                    padding: "2rem",
                    width: {
                        xs: "90%",
                        sm: "80%",
                        md: "60%",
                        lg: "50%",
                        xl: "40%",
                    },
                    backgroundColor: "white",
                    zIndex: 2,
                }}
            >
                <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
                    <img
                        src="/images/logo2.png"
                        alt="Logo"
                        style={{
                            width: "70%",
                            marginBottom: "1rem",
                        }}
                    />
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    sx={{ textAlign: "center", marginBottom: "1rem" }}
                >
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: "1rem" }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        label="Name"
                        sx={{ width: "100%", marginTop: "1rem" }}
                        variant="outlined"
                        value={name}
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        sx={{ width: "100%", marginTop: "1rem" }}
                        variant="outlined"
                        value={email}
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        sx={{ width: "100%", marginTop: "1rem" }}
                        variant="outlined"
                        value={password}
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        sx={{
                            backgroundColor: "black",
                            color: "white",
                            position: "relative",
                            marginTop: "1rem",
                        }}
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? (
                            <CircularProgress
                                size={24}
                                sx={{ color: "white" }}
                            />
                        ) : (
                            "Register"
                        )}
                    </Button>

                    <Typography
                        variant="body1"
                        sx={{ marginTop: "1rem", textAlign: "center" }}
                    >
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid>
    );
}
