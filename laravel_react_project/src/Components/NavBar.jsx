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

import { Outlet, useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
const drawerWidth = 240;

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    // Navigation LIST
    const NavData = [
        {
            path: "/brands",
            text: "Brands",
            icon: <CategoryIcon />,
        },
        {
            path: "/brands/new",
            text: "New Brand",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/codes",
            text: "Codes",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/codes/new",
            text: "Add Code",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/colors",
            text: "Colours",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/colors/new",
            text: "Add Colour",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/frames",
            text: "Frames",
            icon: <AddToPhotosIcon />,
        },
        {
            path: "/frames/new",
            text: "New Frames",
            icon: <AddToPhotosIcon />,
        },
    ];

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    {open ? (
                        <img src="/1.jpg" style={{ width: "100px" }} />
                    ) : (
                        <></>
                    )}
                    <IconButton onClick={handleDrawerOpen}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {NavData.map((text, index) => (
                        <ListItem
                            key={text.text}
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={() => navigate(text.path)}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {text.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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