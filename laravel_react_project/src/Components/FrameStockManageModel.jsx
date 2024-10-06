import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
    IconButton,
    useMediaQuery,
    useTheme,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

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
}) {
    //TODO
    const { token } = useStateContext(); // To handle the auth token
    const { showAlert } = useAlert();

    const [value, setValue] = React.useState("add");
    const [inputStockCount, setInputStockCount] = React.useState(0);
    const [branch, setBranch] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [frame, setFrame] = React.useState({
        brand_id: "",
        code_id: "",
        color_id: "",
        price: "",
        size: "",
        species: "",
        image: "",
        quantity: "",
        branch: "",
    });
    const handleChange = (event, newValue) => {
        if (newValue === "add") {
            setBranch("");
        }
        setValue(newValue);
    };
    React.useEffect(() => {
        // getFrameDetails();

        if (selectedframeIDs) {
            setFrame({
                brand_id: selectedframeIDs.brand_id,
                code_id: selectedframeIDs.code_id,
                color_id: selectedframeIDs.color_id,
                price: selectedframeIDs.price,
                size: selectedframeIDs.size,
                species: selectedframeIDs.species,
                image: selectedframeIDs.image,
                quantity: selectedframeIDs.stocks.length
                    ? selectedframeIDs.stocks[0].qty
                    : "",
                branch: "",
            });
        }
    }, [selectedframeIDs]);

    const handleInputChange = (e) => {
        setBranch(e.target.value);
    };
    const hadleStockSave = async () => {
        try {
            setLoading(true);
            const defaltQuantity =
                parseInt(selectedframeIDs.stocks[0].qty) || null; // Use 0 if quantity is NaN
            const inputQuantity = parseInt(inputStockCount) || null; // Use 0 if NaN

            if (value === "add") {
                await axiosClient.post(
                    `/frames/${selectedframeIDs.id}`,
                    {
                        ...frame,
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
            } else {
                if (branch) {
                    await axiosClient.post(
                        `/frames/${selectedframeIDs.id}`,
                        {
                            ...frame,
                            quantity: defaltQuantity - inputQuantity,
                            branch: branch,
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
                } else {
                    showAlert("Select A branch Before Saving", "error");
                }
            }
        } catch (error) {
            showAlert("Something went wrong", "error");
        } finally {
            setLoading(false);
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
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="wrapped label tabs example"
                        >
                            <Tab value="add" label="Add" wrapped />
                            <Tab value="remove" label="remove" />
                        </Tabs>
                        <TextField
                            sx={{ marginTop: 3 }}
                            onChange={(e) => {
                                setInputStockCount(e.target.value);
                            }}
                            type="number"
                            id="quantity"
                            label="Quantity"
                            variant="outlined"
                        />

                        {value === "add" ? (
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
                                            <MenuItem value="mathugama">
                                                Mathugama
                                            </MenuItem>
                                            <MenuItem value="aluthgama">
                                                Aluthgama
                                            </MenuItem>
                                            <MenuItem value="colombo">
                                                Kaluthara
                                            </MenuItem>
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
