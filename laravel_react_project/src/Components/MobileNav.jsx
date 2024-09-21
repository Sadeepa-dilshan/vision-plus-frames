import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

import DrawerList from "./DrawerList";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { Close, Menu } from "@mui/icons-material";

export default function MobileNav({ NavData }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleDrawerOpen = () => {
        setOpen(!open);
    };
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Box>
            {isMobile && !open && (
                <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{ position: "absolute", zIndex: 1201 }}
                >
                    <Menu />
                </IconButton>
            )}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        backgroundColor: "black",
                        color: "white",
                        boxSizing: "border-box",
                    },
                }}
                open={open}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: ".5em",
                    }}
                >
                    <img
                        src="/images/logo.png"
                        style={{ width: "100px" }}
                        alt="logo"
                    />
                    <IconButton onClick={toggleDrawer(false)}>
                        <Close sx={{ color: "white" }} />
                    </IconButton>
                </Box>
                <Divider />
                <DrawerList NavData={NavData} />
            </Drawer>
        </Box>
    );
}

// STYLES
