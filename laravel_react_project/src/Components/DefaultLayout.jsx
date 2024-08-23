import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import NavBar from "./NavBar";
import { Avatar, Box, Typography } from "@mui/material";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get("/logout").then(() => {
            setUser(null);
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <NavBar />
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                    position: "absolute",
                    top: 6, // Adjust position from the top
                    right: 16, // Adjust position from the right
                }}
            >
                <Avatar
                    alt={user.name}
                    src="/images/profile.png"
                    sx={{ width: 30, height: 30 }}
                    style={{ cursor: "pointer" }}
                />
                <Typography variant="body2">{user.name}</Typography>
            </Box>
        </div>
    );
}
