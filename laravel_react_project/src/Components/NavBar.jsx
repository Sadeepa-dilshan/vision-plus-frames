import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
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
import { AddHome, Home, People } from "@mui/icons-material";

export default function MiniDrawer() {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Toggle Drawer Open/Close State

    // Navigation Data
    const NavData = [
        { path: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
        { path: "/brands", text: "Brands", icon: <FolderCopyIcon /> },

        {
            path: "/brands/new",
            text: "New Brand",
            icon: <CreateNewFolderIcon />,
        },
        { path: "/codes", text: "Codes", icon: <PinIcon /> },
        { path: "/codes/new", text: "Add Code", icon: <Add /> },
        { path: "/colors", text: "Colours", icon: <ColorLensIcon /> },
        {
            path: "/colors/new",
            text: "Add Colour",
            icon: <FormatColorFillIcon />,
        },
        { path: "/frames", text: "Frames", icon: <RemoveRedEyeIcon /> },
        {
            path: "/frames-store",
            text: "Frames Store",
            icon: <RemoveRedEyeIcon />,
        },
        { path: "/frames/new", text: "New Frames", icon: <QueueIcon /> },

        { path: "/branches", text: "Branch", icon: <Home /> },
        // { path: "/branches/new", text: "New Branch", icon: <AddHome /> },

        { path: "/users", text: "Users", icon: <People /> },
    ];

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            {/* Icon to Toggle Drawer for Mobile */}

            {/* Drawer for Desktop and Mobile */}
            {isMobile ? (
                <MobileNav NavData={NavData} />
            ) : (
                <DesktopNav NavData={NavData} />
            )}

            {/* Main Content */}
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
