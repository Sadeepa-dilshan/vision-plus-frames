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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Delete, Edit, History, LocalShipping } from "@mui/icons-material";
import ImageModal from "../Components/ImageModal";
import FrameStockManageModel from "../Components/FrameStockManageModel";

export default function FrameIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgFullVIew, setImgFullView] = useState("");
    const { token } = useStateContext(); // To handle the auth token
    const [open, setOpen] = useState(false);
    const [openStockManageModel, setOpenStockManageModel] = useState(false);
    const [selectedframeIDs, setSelectedframeIDs] = useState(false);
    const [handleRefresh, setHandleRefresh] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const handleOpen = () => {
        setOpen(true);
    };
    const outputData = frames.reduce((acc, curr) => {
        if (!acc[curr.code_id]) {
            acc[curr.code_id] = [];
        }
        acc[curr.code_id].push(curr);
        return acc;
    }, {});

    const mappedOutput = Object.keys(outputData).map((key) => ({
        code_id: key,
        frames: outputData[key],
    }));
    console.log(mappedOutput);

    const handleClose = () => {
        setOpen(false);
        setImgFullView("");
    };
    const CloseStockManage = () => {
        setOpenStockManageModel(false);
    };
    const navigate = useNavigate();

    useEffect(() => {
        getFrames();
    }, [handleRefresh]);
    const handleRefreshTable = () => {
        setHandleRefresh(!handleRefresh);
    };
    const getFrames = () => {
        setLoading(true);
        axiosClient
            .get("/frames", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setFrames(data);
            })
            .catch(() => {
                setLoading(false);
            });
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
                getFrames(); // Refresh the frame list after deletion
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
                    {/* Add History Button */}
                    {/* <IconButton
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() =>
                            navigate(`/frames/history/${row.original.id}`)
                        }
                    >
                        <History color="info" />
                    </IconButton>
                    <IconButton
                        variant="contained"
                        color="info"
                        size="small"
                        // onClick={() => handleOpen()}
                        onClick={() => {
                            setSelectedframeIDs(row.original);
                            setOpenStockManageModel(true);
                        }}
                    >
                        <LocalShipping color="info" />
                    </IconButton> */}
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
            }}
        >
            <Box sx={{ width: isSmallScreen ? "96vw" : "100%" }}>
                <MaterialReactTable
                    columns={columns}
                    data={frames}
                    enableRowSelection={false}
                    enablePagination
                    enableColumnFilters
                    enableSorting
                    enableToolbarInternalActions
                    initialState={{ pagination: { pageSize: 20 } }}
                    muiToolbarAlertBannerProps={{
                        color: "primary",
                    }}
                    muiTableContainerProps={{
                        sx: { maxHeight: "calc(100vh - 200px)" },
                    }}
                    state={{ isLoading: loading }}
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
                />
            </Box>
            <ImageModal
                open={open}
                imgFullVIew={imgFullVIew}
                handleClose={handleClose}
                selectedframeIDs={selectedframeIDs}
            />
            <FrameStockManageModel
                open={openStockManageModel}
                handleClose={CloseStockManage}
                selectedframeIDs={selectedframeIDs}
                handleRefreshTable={handleRefreshTable}
            />
        </Box>
    );
}
