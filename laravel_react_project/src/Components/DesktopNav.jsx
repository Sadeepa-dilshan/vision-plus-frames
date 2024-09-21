import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

import DrawerList from "./DrawerList";
export default function DesktopNav({ NavData }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                {open ? (
                    <img
                        src="/images/logo.png"
                        style={{ width: "100px" }}
                        alt="logo"
                    />
                ) : null}
                <IconButton onClick={handleDrawerOpen}>
                    {open ? (
                        <ChevronRightIcon style={{ color: "white" }} />
                    ) : (
                        <ChevronLeftIcon style={{ color: "white" }} />
                    )}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <DrawerList NavData={NavData} />
        </Drawer>
    );
}

// STYLES
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: "black", // Drawer background color when open
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    backgroundColor: "black", // Drawer background color when closed
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));
