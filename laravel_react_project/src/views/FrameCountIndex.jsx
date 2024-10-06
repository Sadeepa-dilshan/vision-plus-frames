/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";

import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Divider } from "@mui/material";
import ImageModal from "../Components/ImageModal";

export default function FrameCountIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imgFullView, setImgFullView] = useState("");
    const { token } = useStateContext(); // To handle the auth token
    const [open, setOpen] = useState(false);

    const [selectedframeIDs, setSelectedframeIDs] = useState(false);

    const [handleRefresh, setHandleRefresh] = useState(false);

    const handleOpen = () => {
        setOpen(true);
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
        acc[conbineIDS].frames.push({
            code: curr.code.code_name,
            color: curr.color.color_name,
            image: curr.image,
            stocks: curr.stocks[0]["qty"],
        });

        return acc;
    }, {});

    const mappedOutput = Object.keys(outputData).map((key) => ({
        code_id: key,
        code_name: outputData[key].code_name,
        brand_name: outputData[key].brand_name,
        totalQty: outputData[key].totalQty,
        frames: outputData[key]["frames"], // Ensure this is the right field name
    }));

    const handleClose = () => {
        setOpen(false);
        setImgFullView("");
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
            accessorKey: "brand_name",
            header: "Brand Name",
            size: 50,
        },
        {
            accessorKey: "code_name",
            header: "Code Name",
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
            <Typography variant="h6">Frame Details:</Typography>
            {row.original.frames.map((frame, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                    <Typography variant="body2">
                        Frame Code: {frame.code} | Color: {frame.color} |
                        Stocks: {frame.stocks}
                    </Typography>
                    {frame.image && (
                        <img
                            onClick={() => {
                                setImgFullView(frame.image);
                                handleOpen();
                            }}
                            src={frame.image}
                            alt={frame.color}
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
            />
        </Box>
    );
}
