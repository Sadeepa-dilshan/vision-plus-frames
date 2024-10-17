/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
    IconButton,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";
import useBranchList from "../hooks/useBranchList";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: 4,
    width: "auto",
};

export default function FrameStockManageModel({
    open,
    handleClose,
    selectedframeIDs,
    handleRefreshTable,
    frameQtyManage,
}) {
    //TODO
    const { token } = useStateContext(); // To handle the auth token
    const { showAlert } = useAlert();

    const [inputStockCount, setInputStockCount] = React.useState(0);
    const { branchDataList, loadingBranchList } = useBranchList();

    const [branch, setBranch] = React.useState("");

    const [loading, setLoading] = React.useState(false);

    const handleInputChange = (e) => {
        setBranch(e.target.value);
    };
    React.useEffect(() => {
        if (!open) {
            setInputStockCount(0);
            setBranch("");
            setLoading(false);
        }
    }, [open]);

    const hadleStockSave = async () => {
        if (inputStockCount && parseInt(inputStockCount) > 0) {
            try {
                setLoading(true);

                const defaltQuantity =
                    parseInt(selectedframeIDs.stocks[0].qty) || null; // Use 0 if quantity is NaN
                const inputQuantity = parseInt(inputStockCount) || null; // Use 0 if NaN

                if (frameQtyManage === "add") {
                    await axiosClient.post(
                        `/frames/${selectedframeIDs.id}`,
                        {
                            brand_id: selectedframeIDs.brand_id,
                            code_id: selectedframeIDs.code_id,
                            color_id: selectedframeIDs.color_id,
                            price: selectedframeIDs.price,
                            size: selectedframeIDs.size,
                            species: selectedframeIDs.species,
                            image: selectedframeIDs.image,
                            quantity: defaltQuantity + inputQuantity,
                            branch: "stock",
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    showAlert("Stock Updated sucessfully", "sucess");
                    handleRefreshTable();
                    handleClose();
                } else if (frameQtyManage === "remove") {
                    if (branch) {
                        if (defaltQuantity - inputQuantity >= 0) {
                            await axiosClient.post(
                                `/frames/${selectedframeIDs.id}`,
                                {
                                    brand_id: selectedframeIDs.brand_id,
                                    code_id: selectedframeIDs.code_id,
                                    color_id: selectedframeIDs.color_id,
                                    price: selectedframeIDs.price,
                                    size: selectedframeIDs.size,
                                    species: selectedframeIDs.species,
                                    image: selectedframeIDs.image,
                                    quantity: defaltQuantity - inputQuantity,
                                    branch_id: branch.id,
                                    branch: branch.name,
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "multipart/form-data",
                                    },
                                }
                            );
                            showAlert("Stock Updated sucessfully", "sucess");
                            setInputStockCount(0);
                            handleRefreshTable();
                            handleClose();
                        } else {
                            showAlert(
                                "Only aviable " + defaltQuantity,
                                "error"
                            );
                        }
                    } else {
                        showAlert("Select A branch Before Saving", "error");
                    }
                }
            } catch (error) {
                showAlert("Something went wrong", "error");
                console.log(error);

                setInputStockCount(0);
            } finally {
                setLoading(false);
                setInputStockCount(0);
            }
        } else {
            showAlert("Fill The Input", "error");
        }
    };
    //TODO
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        color="error"
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                    <Box sx={{ width: "100%" }}>
                        <TextField
                            value={inputStockCount}
                            sx={{ marginTop: 3 }}
                            onChange={(e) => {
                                setInputStockCount(e.target.value);
                            }}
                            type="number"
                            id="quantity"
                            label="Quantity"
                            variant="outlined"
                        />

                        {frameQtyManage === "add" ? (
                            <div>
                                <Box></Box>
                            </div>
                        ) : (
                            <div>
                                <Box>
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        required
                                    >
                                        <InputLabel>Select Branch</InputLabel>
                                        <Select
                                            id="branch"
                                            name="branch"
                                            value={branch}
                                            onChange={handleInputChange}
                                            label="Select Branch"
                                        >
                                            {branchDataList.map((branch) => (
                                                <MenuItem
                                                    key={branch.id}
                                                    value={{
                                                        id: branch.id,
                                                        name: branch.name,
                                                    }}
                                                >
                                                    {branch.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </div>
                        )}

                        <Button
                            onClick={hadleStockSave}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            style={{ marginTop: 16 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
