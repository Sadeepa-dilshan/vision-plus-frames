import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import NavBar from "./NavBar";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { NotificationImportant, Notifications } from "@mui/icons-material";
import StockAlertTable from "./StockAlertTable";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const location = useLocation();
    const isInLensPart = location.pathname.startsWith("/lens");

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
        <div>
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
                {isInLensPart && (
                    <IconButton onClick={() => setIsDialogOpen(true)}>
                        <Notifications color="error" />
                    </IconButton>
                )}
                <Avatar
                    alt={user.name}
                    src="/images/profile.png"
                    sx={{ width: 30, height: 30 }}
                    style={{ cursor: "pointer" }}
                />
                <Typography variant="body2">{user.name}</Typography>
                <StockAlertTable
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                />
            </Box>
        </div>
    );
}
