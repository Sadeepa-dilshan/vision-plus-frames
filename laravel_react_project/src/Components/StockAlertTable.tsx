import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

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
    console.log(lensStocks);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Stock Alert Table</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Lens Type</TableCell>
                                    <TableCell>Coating</TableCell>
                                    <TableCell>SPH</TableCell>
                                    <TableCell>CYL</TableCell>
                                    <TableCell>Add</TableCell>
                                    <TableCell>R/L</TableCell>
                                    <TableCell>Limit</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lensStocks.map((stock, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{stock.lens_type}</TableCell>
                                        <TableCell>{stock.coating}</TableCell>
                                        <TableCell>{stock.sph}</TableCell>
                                        <TableCell>{stock.cyl}</TableCell>
                                        <TableCell>{stock.add}</TableCell>
                                        <TableCell>{stock["r/l"]}</TableCell>
                                        <TableCell>{stock.limit}</TableCell>
                                        <TableCell>{stock.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>
    );
}
