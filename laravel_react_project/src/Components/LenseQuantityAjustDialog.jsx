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
} from "@mui/material";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import axiosClient from "../axiosClient";
import useBranchList from "../hooks/useBranchList";

export default function LenseQuantityAjustDialog({
    openQuantityAjust,
    handleClose,
    selectedLens,
    refreshLenses,
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
        setLoading(true);

        if (selectedLens) {
            const lensData = {
                type_id: selectedLens.type_id,
                price: parseInt(selectedLens.price),
                quantity:
                    parseInt(selectedLens.lens_stock.qty) + parseInt(quantity),
                coating_id: selectedLens.coating_id,
                lens_powers: selectedLens.powers.map((item) => ({
                    power_id: item.pivot.power_id,
                    value: parseFloat(item.pivot.value),
                })),
            };
            const lensDataEdit = {
                type_id: selectedLens.type_id,
                branch_id: branch.id,
                price: parseInt(selectedLens.price),
                quantity:
                    parseInt(selectedLens.lens_stock.qty) - parseInt(quantity),
                coating_id: selectedLens.coating_id,
                lens_powers: selectedLens.powers.map((item) => ({
                    power_id: item.pivot.power_id,
                    value: parseFloat(item.pivot.value),
                })),
            };

            if (openQuantityAjust.openType === "remove") {
                if (selectedLens.lens_stock.qty - quantity < 0) {
                    showAlert(
                        "Quntity is lower than your Input, try again",
                        "error"
                    );
                    setLoading(false);
                } else {
                    await sendData(lensDataEdit);
                }
            } else if (openQuantityAjust.openType === "add") {
                await sendData(lensData);
            }
        }
    };

    const sendData = async (data) => {
        try {
            setLoading(true);
            await axiosClient.patch(`lenses/${selectedLens.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert("Lens created successfully", "success");
            refreshLenses();
            handleClose();
            setBranch("");
        } catch (error) {
            showAlert("Network error, try again", "error");
            console.log("Error creating lens:", error);
            setLoading(false);
        } finally {
            setLoading(false);
            setBranch("");
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
                    <TextField
                        sx={{ width: "300px", m: 1 }}
                        autoFocus
                        id="name"
                        label="Quantity"
                        type="number"
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
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
