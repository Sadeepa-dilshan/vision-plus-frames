import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

export default function login() {
    const [passwordRef, setPassword] = useState("");
    const [emailRef, setEmail] = useState("");

    const { setUser, setToken } = useStateContext();

    const Submit = (ev) => {
        ev.preventDefault();
        console.log(emailRef, passwordRef);

        const payload = {
            email: emailRef,
            password: passwordRef,
        };
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
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
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
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
                        value={emailRef}
                        type="email"
                        placeholder="Enter your login email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        sx={{ width: "100%", marginY: "1rem" }}
                        variant="outlined"
                        value={passwordRef}
                        type="password"
                        placeholder="Enter your login password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        sx={{ backgroundColor: "black" }}
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Login
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
