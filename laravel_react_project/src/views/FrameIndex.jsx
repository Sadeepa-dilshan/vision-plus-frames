/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    IconButton,
    Skeleton,
} from "@mui/material";
import { Delete, Edit, Fullscreen } from "@mui/icons-material";

export default function FrameIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getFrames();
    }, []);

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
            size: 200,
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
                        src={cell.getValue()}
                        alt="Frame"
                        style={{ width: 50, height: 50, objectFit: "contain" }}
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
            size: 150,
        },
        {
            accessorKey: "code.code_name",
            header: "Code",
            size: 150,
        },
        {
            accessorKey: "color.color_name",
            header: "Color",
            size: 150,
        },
        {
            accessorKey: "price",
            header: "Price",
            size: 100,
        },
        {
            accessorKey: "species",
            header: "Species",
            size: 100,
        },
        {
            accessorKey: "size",
            header: "Shape",
            size: 100,
        },
        {
            accessorKey: "stocks",
            header: "Quantity",
            size: 120,
            Cell: ({ row }) => {
                const stock = row.original.stocks?.[0]; // Access the first element of the stocks array
                return stock ? stock.qty : "N/A"; // Return the qty or "N/A" if stocks is empty
            },
        },
    ];
    console.log(frames);

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <h2>Frames</h2>

            <MaterialReactTable
                columns={columns}
                data={frames}
                enableRowSelection
                enablePagination
                enableColumnFilters
                enableSorting
                enableToolbarInternalActions
                initialState={{ pagination: { pageSize: 5 } }}
                muiToolbarAlertBannerProps={{
                    color: "primary",
                }}
                muiTableContainerProps={{
                    sx: { maxHeight: 400 },
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
    );
}
