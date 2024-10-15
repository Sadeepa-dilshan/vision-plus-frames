import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";

import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

const drawerWidth = 240;

export default function DrawerList({ NavData, toggleDrawer }) {
    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get("/logout").then(() => {
            setUser(null);
            setToken(null);
        });
    };
    const handleOpenInNewTab = (path) => {
        window.open(path, "_blank", "noopener,noreferrer");
    };
    return (
        <Box>
            <Divider />
            <List>
                {NavData.map((item) => (
                    <ListItem
                        key={item.text}
                        disablePadding
                        sx={{ display: "block" }}
                        onClick={() =>
                            location.pathname !== item.path
                                ? navigate(item.path)
                                : null
                        }
                    >
                        <ListItemButton
                            onClick={toggleDrawer}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                color: "white",
                                backgroundColor:
                                    location.pathname === item.path
                                        ? "yellow"
                                        : "transparent", // Yellow background if active
                                "&:hover": {
                                    backgroundColor: "yellow", // Yellow background on hover
                                    color: "black", // Text color on hover
                                    "& .MuiListItemIcon-root": {
                                        color: "black", // Icon color on hover
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: "black", // Text color on hover
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                    color:
                                        location.pathname === item.path
                                            ? "black"
                                            : "white", // Black icon if active
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    color:
                                        location.pathname === item.path
                                            ? "black"
                                            : "white", // Black text if active
                                }}
                            />
                            <IconButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    color: "gray",
                                    backgroundColor:
                                        location.pathname === item.path
                                            ? "yellow"
                                            : "transparent", // Yellow background if active
                                    "&:hover": {
                                        backgroundColor: "yellow", // Yellow background on hover
                                        color: "black", // Text color on hover
                                        "& .MuiListItemIcon-root": {
                                            color: "black", // Icon color on hover
                                        },
                                    },
                                }}
                                onClick={() => handleOpenInNewTab(item.path)}
                            >
                                <OpenInNew />
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} /> {/* Filler to push Logout to bottom */}
            <List>
                <ListItem>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            color: "white",
                            "&:hover": {
                                backgroundColor: "yellow", // Yellow background on hover
                                color: "black", // Text color on hover
                                "& .MuiListItemIcon-root": {
                                    color: "black", // Icon color on hover
                                },
                                "& .MuiListItemText-primary": {
                                    color: "black", // Text color on hover
                                },
                            },
                        }}
                        onClick={onLogout}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                                color: "white",
                                "&:hover": {
                                    color: "black", // Icon color on hover
                                },
                            }}
                        >
                            <LogoutIcon
                                sx={{ color: "inherit" }}
                                onClick={onLogout}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={"LogOut"}
                            sx={{
                                opacity: open ? 1 : 0,
                                color: "inherit", // Text color on hover
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}
