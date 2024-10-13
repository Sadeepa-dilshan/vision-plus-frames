/* eslint-disable no-unused-vars */

import { useEffect, useMemo, useState } from "react";

import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { MaterialReactTable } from "material-react-table";
import {
    Box,
    Typography,
    Divider,
    IconButton,
    Button,
    Skeleton,
    Grid,
} from "@mui/material";
import ImageModal from "../Components/ImageModal";
import {
    Add,
    AddRounded,
    ArrowForward,
    ColorLens,
    Delete,
    Edit,
    Fullscreen,
    History,
    Image,
    Inventory,
    LocalShipping,
    Preview,
    PreviewRounded,
    RemoveTwoTone,
    SailingSharp,
    ShoppingCart,
    ShoppingCartCheckout,
    Storage,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FrameStockManageModel from "../Components/FrameStockManageModel";
import FrameAddByTable from "../Components/FrameAddByTable";
import useFrameList from "../hooks/useFrameList";

export default function FrameCountIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgFullView, setImgFullView] = useState("");
    const { token } = useStateContext(); // To handle the auth token
    const [open, setOpen] = useState(false);
    const [frameQtyManage, setFrameQtyManage] = useState("add");
    const [modelType, setModelType] = useState("");
    const [colorList, setColorList] = useState([]);
    const [selectedframeIDs, setSelectedframeIDs] = useState(false);
    const [openStockManageModel, setOpenStockManageModel] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const { frameDataList, loadingFrameList, refreshFrameList } =
        useFrameList();
    const [handleRefresh, setHandleRefresh] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };
    const CloseStockManage = () => {
        setOpenStockManageModel(false);
    };
    const outputData = frames.reduce((acc, curr) => {
        const conbineIDS = `${curr.brand_id}_${curr.code_id}`;

        if (!acc[conbineIDS]) {
            acc[conbineIDS] = {
                code_name: curr.code.code_name,
                code_id: curr.code_id,
                brand_name: curr.brand.brand_name,
                totalQty: 0,
                frames: [],
            };
        }

        acc[conbineIDS].totalQty += curr.stocks[0]["qty"];
        acc[conbineIDS].frames.push(curr);

        return acc;
    }, {});

    const mappedOutput = Object.keys(outputData).map((key) => ({
        code_id: key,
        code_name: outputData[key].code_name,
        brand_name: outputData[key].brand_name,
        image: outputData[key]["frames"][0].image,
        totalQty: outputData[key].totalQty,
        frames: outputData[key]["frames"],
    }));

    const handleClose = () => {
        setOpen(false);
        setImgFullView("");
        setModelType("");
    };

    const handleRefreshTable = () => {
        setHandleRefresh(!handleRefresh);
    };
    useEffect(() => {
        getFrames();
    }, [handleRefresh]);

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

    const columns = useMemo(
        () => [
            {
                accessorKey: "actions",
                header: "Actions",
                size: 25,
                Cell: ({ row }) => (
                    <>
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            // onClick={() => handleOpen()}
                            onClick={() => {
                                setSelectedframeIDs(row.original["frames"][0]);
                                setOpen(true);
                                setModelType("add");
                                setColorList(
                                    row.original["frames"].map(
                                        (item) => item.color_id
                                    )
                                );
                            }}
                        >
                            <AddRounded />
                        </Button>
                        {/* <IconButton
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
                accessorKey: "brand_name",
                header: "Brand Name",
                size: 50,
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
                                width: 50,
                                height: 50,
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
                accessorKey: "code_name",
                header: "Frame Code",
                size: 50,
            },

            {
                accessorKey: "totalQty",
                header: "Total Qty",
                size: 50,
            },
        ],
        []
    );

    const renderDetailPanel = ({ row }) => {
        return (
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: "#f0f2f5", // Light background for clarity
                    borderRadius: 2,
                    boxShadow: 2,
                    width: "100%", // Ensure it takes full width
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ marginBottom: 1, fontWeight: "bold", color: "#333" }} // Darker color for contrast
                >
                    Frame Details
                </Typography>
                {row.original.frames.map((frame, index) => (
                    <Box
                        key={index}
                        sx={{
                            marginBottom: 2,
                            padding: 2,
                            border: "1px solid #ccc", // Border for separation
                            borderRadius: 1,
                            backgroundColor: "#fff", // White background for clarity
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            {/* Action Buttons */}
                            <Grid item xs={12} sm={4} md={3}>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => {
                                                setOpenStockManageModel(true);
                                                setFrameQtyManage("add");
                                                setSelectedframeIDs(frame);
                                            }}
                                        >
                                            <Add />
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => {
                                                setOpenStockManageModel(true);
                                                setFrameQtyManage("remove");
                                                setSelectedframeIDs(frame);
                                            }}
                                        >
                                            <RemoveTwoTone />
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            onClick={() =>
                                                navigate(
                                                    `/frames/history/${frame.id}`
                                                )
                                            }
                                        >
                                            <History />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Brand and Code */}
                            <Grid item xs={12} sm={8} md={5}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: "semibold",
                                        textTransform: "capitalize",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {frame.brand.brand_name} —{" "}
                                    {frame.code.code_name}
                                </Typography>
                            </Grid>

                            {/* Color Information */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <ColorLens sx={{ marginRight: 1 }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: "bold",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {frame.color.color_name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <ShoppingCart sx={{ marginRight: 1 }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: "bold",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {frame.stocks[0].qty}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Stock Information */}
                        </Grid>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                marginTop: 3,
                height: "100%",
                width: "100%",
                overflowX: "auto",
            }}
        >
            <MaterialReactTable
                columns={columns}
                data={mappedOutput}
                enablePagination
                enableColumnFilters
                enableSorting
                enableExpandAll={false}
                enableExpanding={false}
                enableToolbarInternalActions
                initialState={{ pagination: { pageSize: 20 } }}
                muiTableContainerProps={{
                    sx: { maxHeight: "calc(100vh - 200px)" },
                }}
                state={{ isLoading: loading }}
                renderDetailPanel={renderDetailPanel} // Add the detail panel function here
                muiTableProps={{
                    sx: {
                        "& .MuiTableCell-root": {
                            padding: ".5rem",
                        },
                        "& .MuiTableRow-root": {
                            height: ".5rem",
                        },
                    },
                }}
                renderTopToolbarCustomActions={() => (
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#5b08a7" }}
                    >
                        Frame Store
                    </Typography>
                )}
            />
            <ImageModal
                open={open}
                imgFullVIew={imgFullView}
                handleClose={handleClose}
                selectedframeIDs={selectedframeIDs}
                modelType={modelType}
                colorList={colorList}
                handleRefreshTable={handleRefreshTable}
            />
            <FrameStockManageModel
                open={openStockManageModel}
                handleClose={CloseStockManage}
                selectedframeIDs={selectedframeIDs}
                handleRefreshTable={handleRefreshTable}
                frameQtyManage={frameQtyManage}
            />
        </Box>
    );
}
