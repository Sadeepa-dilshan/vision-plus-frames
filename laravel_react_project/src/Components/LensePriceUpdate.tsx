import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Box,
} from "@mui/material";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

export default function LensePriceUpdate({ open, onClose, refresh }) {
    const [price, setPrice] = useState(open?.data?.price || ""); // Initial price from data
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleSubmit = async () => {
        if (!price || price <= 0) {
            showAlert("Please enter a valid price.", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.put(`/lenses/${open.id}`, {
                ...open.data,
                price: price,
            });
            showAlert("Price updated successfully!", "success");
            setPrice("");
            refresh();
            onClose(); // Close the dialog
        } catch (error) {
            console.error(error);
            showAlert("Failed to update the price. Please try again.", "error");
            setPrice("");
        } finally {
            setLoading(false);
            setPrice("");
        }
    };
    const hadleclose = () => {
        onClose();
        setPrice("");
    };
    return (
        <Dialog open={open.open} onClose={hadleclose} fullWidth maxWidth="sm">
            <DialogTitle>Update Lens Price</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    noValidate
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <TextField
                        label="Price"
                        type="number"
                        variant="outlined"
                        value={price}
                        onChange={handlePriceChange}
                        fullWidth
                        required
                        InputProps={{
                            startAdornment: <span>Rs. </span>, // Optional currency symbol
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={hadleclose}
                    color="secondary"
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
