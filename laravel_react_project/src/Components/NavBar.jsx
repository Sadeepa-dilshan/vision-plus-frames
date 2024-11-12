import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PinIcon from "@mui/icons-material/Pin";
import Add from "@mui/icons-material/Add";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import QueueIcon from "@mui/icons-material/Queue";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import {
    AddCard,
    AddHome,
    AddOutlined,
    CategorySharp,
    History,
    Home,
    Lens,
    LensBlur,
    People,
    Store,
    StoreMallDirectory,
    SwitchLeft,
    SwitchRight,
} from "@mui/icons-material";

export default function MiniDrawer() {
    const theme = useTheme();
    const location = useLocation();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Toggle Drawer Open/Close State

    // Navigation Data
    const NavData = [
        { path: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
        { path: "/brands", text: "Brands", icon: <FolderCopyIcon /> },

        // {
        //     path: "/brands/new",
        //     text: "New Brand",
        //     icon: <CreateNewFolderIcon />,
        // },
        { path: "/codes", text: "Codes", icon: <PinIcon /> },
        // { path: "/codes/new", text: "Add Code", icon: <Add /> },
        { path: "/colors", text: "Colours", icon: <ColorLensIcon /> },
        // {
        //     path: "/colors/new",
        //     text: "Add Colour",
        //     icon: <FormatColorFillIcon />,
        // },
        { path: "/frames", text: "Frames", icon: <RemoveRedEyeIcon /> },
        {
            path: "/frames-store",
            text: "Frames Store",
            icon: <Store />,
        },
        { path: "/frames/new", text: "New Frames", icon: <QueueIcon /> },

        { path: "/branches", text: "Branch", icon: <Home /> },
        // { path: "/branches/new", text: "New Branch", icon: <AddHome /> },

        { path: "/users", text: "Users", icon: <People /> },
        { path: "/lens/dashboard", text: "Lens", icon: <SwitchLeft /> },
    ];
    const NavDataForLens = [
        { path: "/lens/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
        { path: "/lens/add_lens", text: "Add Lens", icon: <AddOutlined /> },
        {
            path: "/lens/lens_store",
            text: "Lens Store",
            icon: <StoreMallDirectory />,
        },
        {
            path: "/lens/add_variance",
            text: "Add Variance",
            icon: <CategorySharp />,
        },
        // { path: "/lens/", text: "Lens", icon: <LensBlur /> },
        // { path: "/lens/history/", text: "History", icon: <History /> },
        { path: "/dashboard", text: "Frame", icon: <SwitchRight /> },
    ];

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            {isMobile && location.pathname !== "/" ? (
                <MobileNav
                    NavData={
                        location.pathname.startsWith("/lens")
                            ? NavDataForLens
                            : NavData
                    }
                />
            ) : !isMobile && location.pathname !== "/" ? (
                <DesktopNav
                    NavData={
                        location.pathname.startsWith("/lens")
                            ? NavDataForLens
                            : NavData
                    }
                />
            ) : (
                <></>
            )}

            <Box
                component="main"
                sx={{ flexGrow: 1, marginTop: "1.5em", marginX: ".5em" }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

// STYLES
