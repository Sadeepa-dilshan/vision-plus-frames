import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";

export default function StockAlertDialog({ id, open, onClose }) {
    const [stockAlert, setStockAlert] = useState("");
    const { token } = useStateContext();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    // Handle the stock alert value change
    const handleInputChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setStockAlert(value); // Only allow positive numbers
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axiosClient.post(
                `/lens-stocks/${id}/set-limit`,
                {
                    limit: stockAlert,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showAlert("Lens Alert successfully Updated", "success");
            onClose();
        } catch (error) {
            showAlert("Network error, try again", "error");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Set Stock Alert</DialogTitle>
            <DialogContent>
                <TextField
                    label="Stock Alert"
                    type="number"
                    value={stockAlert}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0 }}
                    helperText="Enter your stock alert level"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

StockAlertDialog.propTypes = {
    id: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
