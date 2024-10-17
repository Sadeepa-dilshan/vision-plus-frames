/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { MaterialReactTable } from "material-react-table";
import {
    Box,
    IconButton,
    Skeleton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Delete, Edit, History, LocalShipping } from "@mui/icons-material";
import ImageModal from "../Components/ImageModal";
import FrameStockManageModel from "../Components/FrameStockManageModel";
import useFrameList from "../hooks/useFrameList";

export default function FrameIndex() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    //Image Popup state hadles
    const [imgFullVIew, setImgFullView] = useState("");
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    //Modal Open state
    const [open, setOpen] = useState(false);

    const { frameDataList, loadingFrameList, refreshFrameList } =
        useFrameList();

    //Modal Open Handler
    const handleOpen = () => {
        setOpen(true);
    };
    //Modal close Handler
    const handleClose = () => {
        setOpen(false);
        setImgFullView("");
    };

    const handleDelete = (frameId) => {
        if (!window.confirm("Are you sure you want to delete this frame?")) {
            return;
        }

        axiosClient
            .delete(`/frames/${frameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshFrameList(); // Refresh the frame list after deletion
            });
    };

    const columns = [
        {
            accessorKey: "actions",
            header: "Actions",
            size: 50,
            Cell: ({ row }) => (
                <>
                    <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                            navigate(`/frames/edit/${row.original.id}`)
                        }
                        style={{ marginRight: 10 }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <Delete color="error" />
                    </IconButton>
                </>
            ),
        },
        {
            accessorKey: "image",
            header: "Image",
            size: 100,
            Cell: ({ cell }) =>
                cell.getValue() ? (
                    <img
                        onClick={() => {
                            handleOpen();
                            setImgFullView(cell.getValue());
                        }}
                        src={cell.getValue()}
                        alt="Frame"
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "contain",
                            cursor: "pointer",
                        }}
                    />
                ) : (
                    <Skeleton
                        animation="pulse"
                        variant="rectangular"
                        width={50}
                        height={50}
                    />
                ),
        },
        {
            accessorKey: "brand.brand_name",
            header: "Brand",
            size: 50,
        },
        {
            accessorKey: "code.code_name",
            header: "Code",
            size: 50,
        },

        {
            accessorKey: "price",
            header: "Price",
            size: 50,
        },
        {
            accessorKey: "species",
            header: "Species",
            size: 50,
        },
        {
            accessorKey: "size",
            header: "Shape",
            size: 50,
        },
    ];

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                overflowX: "auto", // Allow horizontal scroll if needed
                marginTop: 2,
            }}
        >
            <Box sx={{ width: isSmallScreen ? "96vw" : "100%" }}>
                <MaterialReactTable
                    columns={columns}
                    data={frameDataList}
                    enableRowSelection={false}
                    enablePagination
                    enableColumnFilters
                    enableSorting
                    enableToolbarInternalActions
                    initialState={{
                        pagination: { pageSize: 10, pageIndex: 0 },
                    }}
                    muiPaginationProps={{
                        color: "primary", // Customize pagination button color
                        shape: "rounded", // Change button shape to rounded
                        showRowsPerPage: true, // Hide rows per page selector
                        variant: "outlined", // Set button variant to outlined
                    }}
                    muiToolbarAlertBannerProps={{
                        color: "primary",
                    }}
                    muiTableContainerProps={{
                        sx: { maxHeight: "calc(100vh - 200px)" },
                    }}
                    state={{ isLoading: loadingFrameList }}
                    muiTableProps={{
                        sx: {
                            "& .MuiTableCell-root": {
                                padding: ".5rem", // Reduce padding for smaller density
                            },
                            "& .MuiTableRow-root": {
                                height: ".5rem", // Reduce row height for smaller density
                            },
                        },
                    }}
                    renderTopToolbarCustomActions={() => (
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#5b08a7" }}
                        >
                            All Frames
                        </Typography>
                    )}
                />
            </Box>
            <ImageModal
                open={open}
                imgFullVIew={imgFullVIew}
                handleClose={handleClose}
                selectedframeIDs={false}
            />
        </Box>
    );
}
