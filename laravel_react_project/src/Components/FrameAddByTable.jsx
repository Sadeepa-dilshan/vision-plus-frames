import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

export default function FramestockAjusmentModel({ selectedframeIDs }) {
    const { token } = useStateContext(); // To handle the auth token

    const [value, setValue] = React.useState("add");
    const [inputStockCount, setInputStockCount] = React.useState(0);
    const [branch, setBranch] = React.useState("");
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
    console.log(frame);

    const handleInputChange = (e) => {
        setBranch(e.target.value);
    };
    const hadleStockSave = async () => {
        try {
            const defaltQuantity =
                parseInt(selectedframeIDs.stocks[0].qty) || null; // Use 0 if quantity is NaN
            const inputQuantity = parseInt(inputStockCount) || null; // Use 0 if NaN
            if (value === "add") {
                await axiosClient.post(
                    `/frames/${selectedframeIDs.id}`,
                    { frame },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
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
                }
            }
        } catch (error) {}
    };

    return (
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
                sx={{ margin: 1 }}
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
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Select Branch</InputLabel>
                            <Select
                                id="branch"
                                name="branch"
                                value={frame.branch}
                                onChange={handleInputChange}
                                label="Select Branch"
                            >
                                <MenuItem value="mathugama">Mathugama</MenuItem>
                                <MenuItem value="aluthgama">Aluthgama</MenuItem>
                                <MenuItem value="colombo">Kaluthara</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
            )}
            <Button onClick={hadleStockSave} variant="contained">
                Save
            </Button>
        </Box>
    );
}
