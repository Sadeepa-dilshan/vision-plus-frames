import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import useUser from "../hooks/useUser";
import useUserList from "../hooks/useUserList";

export default function UserEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the user ID from the URL

    // Hooks
    const { showAlert } = useAlert();
    const { userDataList } = useUserList(); // List of users
    const { userData, loadingUser } = useUser(id); // Single user data
    const { token } = useStateContext(); // Get the auth token

    // User Input Handlers
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // For updating the password
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (userData) {
            setUserName(userData.username);
            setEmail(userData.email);
        }
    }, [userData, loadingUser]);

    // Update User Info
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (userDataList) {
                const exists = userDataList.some(
                    (item) => item.username === userName && item.email === email
                );

                if (exists) {
                    showAlert(
                        "User already exists with this username or email",
                        "error"
                    );
                } else {
                    await axiosClient.put(
                        `/users/${id}`,
                        {
                            username: userName,
                            email: email,
                            password: password || undefined,
                        }, // Send password only if it exists
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    showAlert("User updated successfully", "success");
                    navigate("/users"); // Redirect to the user list after updating
                }
            }
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
                Edit User
            </Typography>
            <form onSubmit={handleSubmit}>
                {loadingUser ? (
                    <CircularProgress />
                ) : (
                    <div>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                variant="outlined"
                                error={!!errors}
                                helperText={errors ? errors.username : ""}
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
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
                            startIcon={
                                loading ? <CircularProgress size={24} /> : null
                            }
                        >
                            {loading ? "Updating..." : "Update User"}
                        </Button>
                    </div>
                )}
            </form>
        </Card>
    );
}
