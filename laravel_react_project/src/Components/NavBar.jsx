import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
const drawerWidth = 240;
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PinIcon from "@mui/icons-material/Pin";
import { Add } from "@mui/icons-material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import QueueIcon from "@mui/icons-material/Queue";
export default function MiniDrawer() {
    const { setUser, setToken } = useStateContext();

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get("/logout").then(() => {
            setUser(null);
            setToken(null);
        });
    };

    const NavData = [
        {
            path: "/dashboard",
            text: "Dashboard",
            icon: <DashboardIcon />,
        },
        {
            path: "/brands",
            text: "Brands",
            icon: <FolderCopyIcon />,
        },
        {
            path: "/brands/new",
            text: "New Brand",
            icon: <CreateNewFolderIcon />,
        },
        {
            path: "/codes",
            text: "Codes",
            icon: <PinIcon />,
        },
        {
            path: "/codes/new",
            text: "Add Code",
            icon: <Add />,
        },
        {
            path: "/colors",
            text: "Colours",
            icon: <ColorLensIcon />,
        },
        {
            path: "/colors/new",
            text: "Add Colour",
            icon: <FormatColorFillIcon />,
        },
        {
            path: "/frames",
            text: "Frames",
            icon: <RemoveRedEyeIcon />,
        },
        {
            path: "/frames/new",
            text: "New Frames",
            icon: <QueueIcon />,
        },
    ];

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
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
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon style={{ color: "white" }} />
                        ) : (
                            <ChevronLeftIcon style={{ color: "white" }} />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {NavData.map((item) => (
                        <ListItem
                            key={item.text}
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemButton
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
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ flexGrow: 1 }} />{" "}
                {/* Filler to push Logout to bottom */}
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
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, margin: ".5rem" }}>
                <Outlet />
            </Box>
        </Box>
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

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
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
