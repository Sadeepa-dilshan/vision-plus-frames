import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import axios from "axios";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";
import { MaterialReactTable } from "material-react-table";

export default function StockAlertTable({ open, onClose }) {
    const [lensStocks, setLensStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (open) {
            const fetchLensStocks = async () => {
                try {
                    setLoading(true);
                    const response = await axiosClient.get("/lens-stocks");
                    setLensStocks(response.data);
                    setError(null);
                } catch (err) {
                    showAlert(
                        "Network error occurred. Please try again.",
                        "error"
                    );
                } finally {
                    setLoading(false);
                }
            };

            fetchLensStocks();
        }
    }, [open]);

    // Memoize the columns configuration
    const columns = useMemo(
        () => [
            {
                header: "Lens Type",
                accessorKey: "lens_type", // Accessor for lens type
            },
            {
                header: "Coating",
                accessorKey: "coating", // Accessor for coating
            },
            {
                header: "Lens Powers",
                accessorKey: "id", // Custom rendering
                Cell: ({ row }) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* {row.original.powers?.map((power, index) => (
                            <div key={index}>{power}</div>
                        ))} */}
                        {row.original["powers"]?.map((power, index) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                }}
                                my={1}
                                key={index}
                            >
                                <div style={{ textTransform: "capitalize" }}>
                                    {" "}
                                    {power.name}
                                </div>
                                <div> {power.value}</div>
                            </Box>
                        ))}
                    </div>
                ),
            },
            {
                header: "R/L",
                accessorKey: "r/l", // Accessor for right/left
                Cell: ({ row }) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* {row.original.powers?.map((power, index) => (
                            <div key={index}>{power}</div>
                        ))} */}
                        {row.original["powers"] &&
                            row.original["powers"].length > 0 && (
                                <Typography
                                    sx={{ textTransform: "capitalize" }}
                                    variant="body1"
                                    color="textPrimary"
                                >
                                    {row.original["powers"][0]["side"]}
                                </Typography>
                            )}
                    </div>
                ),
            },
            {
                header: "Limit",
                accessorKey: "limit", // Accessor for limit
            },
            {
                header: "Quantity",
                accessorKey: "quantity", // Accessor for quantity
            },
        ],
        [] // Dependency array, empty because columns don't change
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Stock Alert Table</DialogTitle>
            <DialogContent>
                <MaterialReactTable
                    columns={columns}
                    data={lensStocks}
                    enablePagination
                    enableSorting
                />
            </DialogContent>
        </Dialog>
    );
}
