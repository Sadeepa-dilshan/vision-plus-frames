/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";

import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import ImageModal from "../Components/ImageModal";
import {
    Add,
    AddRounded,
    Delete,
    Edit,
    History,
    LocalShipping,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FrameStockManageModel from "../Components/FrameStockManageModel";
import FrameAddByTable from "../Components/FrameAddByTable";

export default function FrameCountIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgFullView, setImgFullView] = useState("");
    const { token } = useStateContext(); // To handle the auth token
    const [open, setOpen] = useState(false);
    const [openAddByTable, setOpenAddByTable] = useState(false);
    const [modelType, setModelType] = useState("");

    const [selectedframeIDs, setSelectedframeIDs] = useState(false);
    const [openStockManageModel, setOpenStockManageModel] = useState(false);

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
    const handleCloseAddFrame = () => {
        setOpenAddByTable(false);
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

    const columns = [
        {
            accessorKey: "actions",
            header: "Actions",
            size: 25,
            Cell: ({ row }) => (
                <>
                    <IconButton
                        variant="contained"
                        color="info"
                        size="small"
                        // onClick={() => handleOpen()}
                        onClick={() => {
                            setSelectedframeIDs(row.original["frames"][0]);
                            setOpen(true);
                            setModelType("add");
                        }}
                    >
                        <AddRounded color="info" />
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
                    </IconButton>
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
            accessorKey: "code_name",
            header: "Frame Code",
            size: 50,
        },

        {
            accessorKey: "totalQty",
            header: "Total Qty",
            size: 50,
        },
    ];

    // Define the detail panel rendering logic
    const renderDetailPanel = ({ row }) => (
        <Box sx={{ padding: 2 }}>
            {row.original.frames.map((frame, index) => (
                <Box
                    key={index}
                    sx={{
                        marginBottom: 1,
                        display: "flex",

                        alignItems: "center",
                    }}
                >
                    <IconButton
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/frames/history/${frame.id}`)}
                    >
                        <History color="info" />
                    </IconButton>
                    <Typography variant="body2">
                        Frame Code: {frame.code.code_name} | Color:{" "}
                        {frame.color.color_name} | Stocks: {frame.stocks[0].qty}
                    </Typography>

                    {frame.image && (
                        <img
                            onClick={() => {
                                setImgFullView(frame.image);
                                handleOpen();
                                setModelType("img");
                            }}
                            src={frame.image}
                            alt={frame.color.code_name}
                            style={{
                                width: 50,
                                height: "auto",
                                cursor: "pointer",
                            }}
                        />
                    )}

                    <Divider />
                </Box>
            ))}
        </Box>
    );

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
            />
            <ImageModal
                open={open}
                imgFullVIew={imgFullView}
                handleClose={handleClose}
                selectedframeIDs={selectedframeIDs}
                modelType={modelType}
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
