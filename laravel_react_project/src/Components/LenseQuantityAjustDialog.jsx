import { useEffect } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import axiosClient from "../axiosClient";
import useBranchList from "../hooks/useBranchList";

export default function LenseQuantityAjustDialog({
    openQuantityAjust,
    handleClose,
    selectedLenses,
    refreshLenses,
    setQtyAjust,
}) {
   
    const { token } = useStateContext();
    const { showAlert } = useAlert();
    const { branchDataList, loadingBranchList } = useBranchList();

    const [branch, setBranch] = React.useState("");

    const [loading, setLoading] = React.useState(false);
    const [quantity, setQuantity] = React.useState();
    const handleInputChange = (e) => {
        const selectedBranch = JSON.parse(e.target.value); // Parse the value to get id and name

        setBranch(selectedBranch);
    };
    useEffect(() => {
        if (openQuantityAjust.open === false) {
            setBranch("");
        }
    }, [openQuantityAjust.open]);


    const addQty = async () => {
        try {
            setLoading(true);
    
            // Resolve all async operations
            const data = await Promise.all(Object.values(selectedLenses).map(async (selectedLens) => ({
                lens_id: selectedLens.id,
                change_qty: openQuantityAjust.openType === "remove" ? -Math.abs(selectedLens.ajustQty) : selectedLens.ajustQty,
                branch_id: openQuantityAjust.openType === "remove" ? branch.id : null
            })));
    
            console.log(data); // Ensure this logs resolved data, not promises
    
            if (openQuantityAjust.openType === "remove") {
                await sendData(data);
            } else if (openQuantityAjust.openType === "add") {
                await sendData(data);
            }
        } catch (error) {
            console.error("Error in addQty:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const sendData = async (data) => {
        try {
            setLoading(true);
            await axiosClient.put(`lenses/bulk-stock-update`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert("Lens Updated successfully", "success");
            refreshLenses();
            handleClose();
            setBranch("");
        } catch (error) {
            showAlert("Network error, try again", "error");
            console.log("Error creating lens:", error);
            setLoading(false);
            setQtyAjust({});
        } finally {
            setLoading(false);
            setBranch("");
            setQtyAjust({});
        }
    };
    return (
        <React.Fragment>
            <Dialog
                open={openQuantityAjust.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title2"
                aria-describedby="alert-dialog-description2"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Quantity Ajustment"}
                </DialogTitle>
                <DialogContent>
                    {openQuantityAjust.openType === "add" && (
                        <Box>
                            <Typography color={"error"}>
                                Plese Confim New Quantity changes of{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {Object.keys(selectedLenses).length}
                                </span>{" "}
                                lenses Items
                            </Typography>
                        </Box>
                    )}
                    {loading && (
                        <Typography color={"gold"}>
                            "Updating Please Wait...
                        </Typography>
                    )}
                    {openQuantityAjust.openType === "remove" && (
                        <Box>
                            <FormControl
                                sx={{ width: "300px" }}
                                margin="normal"
                                required
                            >
                                <InputLabel>Select Branch</InputLabel>
                                <Select
                                    fullWidth
                                    id="branch"
                                    name="branch"
                                    value={branch ? JSON.stringify(branch) : ""}
                                    onChange={handleInputChange}
                                    label="Select Branch"
                                >
                                    {branchDataList.map((branch) => (
                                        <MenuItem
                                            key={branch.id}
                                            value={JSON.stringify({
                                                id: branch.id,
                                                name: branch.name,
                                            })} // Store both id and name as a JSON string
                                        >
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button color="success" onClick={addQty} autoFocus>
                            Change
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
