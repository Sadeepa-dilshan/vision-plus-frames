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
} from "@mui/material";
import { useAlert } from "../contexts/AlertContext";

export default function Login() {
    const { showAlert } = useAlert();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const { setUser, setToken } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const Submit = async (ev) => {
        ev.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Clear any previous errors

        const payload = {
            email,
            password,
        };

        try {
            const { data } = await axiosClient.post("/login", payload);
            setUser(data.user);
            setToken(data.token);
            setLoading(false); // Stop loading
            console.log(data);
            if (data.user) {
                showAlert(
                    data.user.name + " logged in successfully",
                    "success"
                );
            } else {
                showAlert(data.message, "error");
            }
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
            }
        }
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            height={"100vh"}
            style={backgroundImageStyle}
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
                elevation={2}
                sx={{
                    padding: "1rem",
                    width: {
                        xs: "96%",
                        sm: "70%",
                        md: "50%",
                        lg: "60%",
                        xl: "40%",
                    },
                    zIndex: 2,
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <img
                        src="/images/logo2.png"
                        style={{
                            padding: ".5rem",
                            borderRadius: "10px",
                            width: "80%",
                        }}
                        alt="Logo"
                    />
                </Box>

                <form onSubmit={Submit}>
                    <Typography
                        variant="h6"
                        component="h1"
                        fontWeight={"bold"}
                        sx={{ textAlign: "center", marginX: "1rem" }}
                        fontStyle={"revert-layer"}
                    >
                        Login
                    </Typography>

                    <TextField
                        label="Email"
                        sx={{ width: "100%", marginTop: "2rem" }}
                        variant="outlined"
                        value={email}
                        type="email"
                        placeholder="Enter your login email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        sx={{ width: "100%", marginY: "1rem" }}
                        variant="outlined"
                        value={password}
                        type="password"
                        placeholder="Enter your login password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        sx={{ backgroundColor: "black", position: "relative" }}
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
                            "Login"
                        )}
                    </Button>

                    <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                        Not Registered?{" "}
                        <Link to="/register">Create a new account</Link>
                    </Typography>
                </form>
            </Paper>
        </Grid>
    );
}

const backgroundImageStyle = {
    backgroundImage: 'url("/images/4676.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
};
