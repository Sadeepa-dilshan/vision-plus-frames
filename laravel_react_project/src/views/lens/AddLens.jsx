import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Select,
    InputLabel,
    FormControl,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { useAlert } from "../../contexts/AlertContext";

export default function AddLens() {
    const { token } = useStateContext();
    const { showAlert } = useAlert();

    const [lensType, setLensType] = useState("");
    const [sph, setSph] = useState("");
    const [cyl, setCyl] = useState("");
    const [add, setAdd] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [corting, setCorting] = useState("");

    const [errors, setErrors] = useState({
        lensType: false,
        sph: false,
        cyl: false,
        add: false,
        price: false,
        quantity: false,
    });

    const handleLensTypeChange = (event) => {
        setLensType(event.target.value);
        setSph("");
        setCyl("");
        setAdd("");
        setCorting("");
    };
    const handleLenscortingChange = (event) => {
        setCorting(event.target.value);
    };

    const validateForm = () => {
        const newErrors = {
            lensType: !lensType,
            sph: !sph,
            cyl: !cyl,
            add: lensType === "2" || lensType === "3" ? !add : false,
            price: !price,
            quantity: !quantity,
            corting: !corting,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleAddLens = async () => {
        if (validateForm()) {
            // Construct the lens data based on the lens type
            const lensData = {
                type_id: parseInt(lensType),
                price: parseFloat(price),
                quantity: parseInt(quantity),
                coating_id: parseInt(corting),
                lens_powers: [
                    { power_id: 1, value: parseFloat(sph) }, // SPH
                    { power_id: 2, value: parseFloat(cyl) }, // CYL
                ],
            };

            // If it's a bifocal or varifocal lens, include the ADD power
            if (lensType === "2" || lensType === "3") {
                lensData.lens_powers.push({
                    power_id: 3,
                    value: parseFloat(add),
                });
            }

            // Send data to DB
            await sendDataToDB(lensData);
        }
    };

    const sendDataToDB = async (data) => {
        console.log(data);

        try {
            // Send the POST request to create a new lens
            const response = await axiosClient.post("/lenses", data, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure the token is included for authorization
                },
            });

            // On success, show success alert and reset form
            showAlert("Lens created successfully", "success");
            setLensType("");
            setSph("");
            setCyl("");
            setAdd("");
            setPrice("");
            setCorting("");
            setQuantity("");
            setErrors({
                lensType: false,
                sph: false,
                cyl: false,
                add: false,
                price: false,
                quantity: false,
                corting: false,
            });
        } catch (error) {
            // Handle error and show error alert
            showAlert("Network error, try again", "error");
            console.error("Error creating lens:", error);
            console.log(data);
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: { xs: "90%", sm: 600 }, // Responsive width
                mx: "auto",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "background.paper",
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                align="center"
                color="primary"
            >
                Add Lens
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth error={errors.lensType}>
                        <InputLabel id="lens-type-label">Lens Type</InputLabel>
                        <Select
                            labelId="lens-type-label"
                            value={lensType}
                            onChange={handleLensTypeChange}
                            variant="outlined"
                            label="Lens Type"
                        >
                            <MenuItem value="1">Single Vision</MenuItem>
                            <MenuItem value="2">Bifocal</MenuItem>
                            <MenuItem value="3">Varifocal</MenuItem>
                        </Select>
                        {errors.lensType && (
                            <Typography variant="caption" color="error">
                                Lens type is required.
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                {/* Lens Power Section */}
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ elevation: 3 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                align="center"
                            >
                                Lens Power
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="SPH"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        value={sph}
                                        onChange={(e) => setSph(e.target.value)}
                                        margin="normal"
                                        error={errors.sph}
                                        helperText={
                                            errors.sph ? "SPH is required." : ""
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="CYL"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        value={cyl}
                                        onChange={(e) => setCyl(e.target.value)}
                                        margin="normal"
                                        error={errors.cyl}
                                        helperText={
                                            errors.cyl ? "CYL is required." : ""
                                        }
                                    />
                                </Grid>
                                {(lensType === "2" || lensType === "3") && (
                                    <Grid item xs={12}>
                                        <TextField
                                            label="ADD"
                                            variant="outlined"
                                            fullWidth
                                            type="number"
                                            value={add}
                                            onChange={(e) =>
                                                setAdd(e.target.value)
                                            }
                                            margin="normal"
                                            error={errors.add}
                                            helperText={
                                                errors.add
                                                    ? `ADD is required for ${lensType}`
                                                    : ""
                                            }
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Price and Quantity Fields */}
                <Grid item xs={12}>
                    <TextField
                        label="Price"
                        variant="outlined"
                        fullWidth
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        margin="normal"
                        error={errors.price}
                        helperText={errors.price ? "Price is required." : ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Quantity"
                        variant="outlined"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        type="number"
                        margin="normal"
                        error={errors.quantity}
                        helperText={
                            errors.quantity ? "Quantity is required." : ""
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth error={errors.corting}>
                        <InputLabel id="lens-type-label">Corting</InputLabel>
                        <Select
                            labelId="Corting"
                            value={corting}
                            onChange={handleLenscortingChange}
                            variant="outlined"
                            label="Corting"
                        >
                            <MenuItem value="1">Multicoated</MenuItem>
                            <MenuItem value="2">Bluecut</MenuItem>
                            <MenuItem value="3">Bluecut Photocromic</MenuItem>
                        </Select>
                        {errors.lensType && (
                            <Typography variant="caption" color="error">
                                corting is required.
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddLens}
                        fullWidth
                        sx={{ mt: 2, padding: "10px" }}
                    >
                        Add Lens
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
