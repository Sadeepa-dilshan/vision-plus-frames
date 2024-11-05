import React, { useState } from "react";
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

export default function AddLens() {
    const [lensType, setLensType] = useState("");
    const [sph, setSph] = useState("");
    const [cyl, setCyl] = useState("");
    const [add, setAdd] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

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
    };

    const validateForm = () => {
        const newErrors = {
            lensType: !lensType,
            sph: !sph,
            cyl: !cyl,
            add:
                lensType === "Bifocal" || lensType === "Varifocal"
                    ? !add
                    : false,
            price: !price,
            quantity: !quantity,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleAddLens = () => {
        if (validateForm()) {
            console.log({
                lensType,
                sph,
                cyl,
                add: add,

                price,
                quantity,
            });

            //TODO SEND TO DATA BASE WITH AXIOS
            // Reset form after adding lens
            setLensType("");
            setSph("");
            setCyl("");
            setAdd("");
            setPrice("");
            setQuantity("");
            setErrors({
                lensType: false,
                sph: false,
                cyl: false,
                add: false,
                price: false,
                quantity: false,
            });
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
                            <MenuItem value="Single Vision">
                                Single Vision
                            </MenuItem>
                            <MenuItem value="Bifocal">Bifocal</MenuItem>
                            <MenuItem value="Varifocal">Varifocal</MenuItem>
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
                                {(lensType === "Bifocal" ||
                                    lensType === "Varifocal") && (
                                    <Grid item xs={12}>
                                        <TextField
                                            label="ADD"
                                            variant="outlined"
                                            fullWidth
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
