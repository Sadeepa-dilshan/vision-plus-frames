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
        setLoading(true);
        Object.values(selectedLenses).map(async (selectedLens) => {
            if (selectedLens) {
                const lensData = {
                    type_id: selectedLens.type_id,
                    price: parseInt(selectedLens.price),
                    quantity:
                        parseInt(selectedLens.lens_stock.qty) +
                        parseInt(selectedLens.ajustQty),
                    coating_id: selectedLens.coating_id,
                    lens_powers: selectedLens.powers.map((item) => ({
                        power_id: item.pivot.power_id,
                        value: parseFloat(item.pivot.value),
                        side: item.side,
                    })),
                };
                const lensDataEdit = {
                    type_id: selectedLens.type_id,
                    branch_id: branch.id,
                    price: parseInt(selectedLens.price),
                    quantity:
                        parseInt(selectedLens.lens_stock.qty) -
                        parseInt(selectedLens.ajustQty),
                    coating_id: selectedLens.coating_id,
                    lens_powers: selectedLens.powers.map((item) => ({
                        power_id: item.pivot.power_id,
                        value: parseFloat(item.pivot.value),
                        side: item.side,
                    })),
                };

                if (openQuantityAjust.openType === "remove") {
                    if (
                        selectedLens.lens_stock.qty - selectedLens.ajustQty <
                        0
                    ) {
                        showAlert(
                            "Quntity is lower than your Input, try again",
                            "error"
                        );
                        setLoading(false);
                    } else {
                        await sendData(lensDataEdit, selectedLens.id);
                    }
                } else if (openQuantityAjust.openType === "add") {
                    await sendData(lensData, selectedLens.id);
                }
            }
        });
    };

    const sendData = async (data, ID) => {
        try {
            setLoading(true);
            await axiosClient.put(`lenses/${ID}`, data, {
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
