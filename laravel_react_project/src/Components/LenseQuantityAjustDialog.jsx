import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export default function LenseQuantityAjustDialog({ open, handleClose }) {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title2"
                aria-describedby="alert-dialog-description2"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Quantity Ajustment"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ width: "300px", m: 1 }}
                        autoFocus
                        id="name"
                        label="Quantity"
                        type="number"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color="success" onClick={handleClose} autoFocus>
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
LenseQuantityAjustDialog.propTypes = {
    open: PropTypes.bool.isRequired,

    handleClose: PropTypes.func.isRequired,
};
