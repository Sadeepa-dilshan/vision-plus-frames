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
    CircularProgress,
} from "@mui/material";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { useAlert } from "../../contexts/AlertContext";
import useData from "../../hooks/useData";

export default function AddLens() {
    const { token } = useStateContext();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const { data: lensTypeList, loading: loadingLensType } =
        useData("lens-types");
    const { data: lenseCotingsList, loading: loadingLenseCoting } =
        useData("lens-coatings");
    console.log(lensTypeList);

    const [formData, setFormData] = useState({
        lensType: "",
        sph: "",
        cyl: "",
        add: "",
        price: "",
        quantity: "",
        corting: "",
        side: null,
    });

    const [errors, setErrors] = useState({
        lensType: false,
        sph: false,
        cyl: false,
        add: false,
        price: false,
        quantity: false,
        corting: false,
        side: null,
    });
    console.log(lensTypeList);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formData.lensType !== 3) {
            setFormData((prev) => ({ ...prev, side: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            lensType: !formData.lensType,
            sph: !formData.sph,
            cyl: parseInt(formData.lensType) === 4 ? !formData.cyl : false,
            add:
                parseInt(formData.lensType) === 2 ||
                parseInt(formData.lensType) === 3
                    ? !formData.add
                    : false,
            price: !formData.price,
            quantity: !formData.quantity,
            corting: !formData.corting,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleAddLens = async () => {
        if (validateForm()) {
            const singleVisionPowers = [
                {
                    power_id: 1,
                    value: parseFloat(formData.sph),
                    side: formData.side,
                },
                {
                    power_id: 2,
                    value: parseFloat(formData.cyl),
                    side: formData.side,
                },
            ];
            const varifocalPowers = [
                {
                    power_id: 1,
                    value: parseFloat(formData.sph),
                    side: formData.side,
                },
                {
                    power_id: 3,
                    value: parseFloat(formData.add),
                    side: formData.side,
                },
            ];

            const lensData = {
                type_id: parseInt(formData.lensType),
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                coating_id: parseInt(formData.corting),

                lens_powers:
                    formData.lensType === 4
                        ? singleVisionPowers
                        : varifocalPowers,
            };

            try {
                setLoading(true);
                await axiosClient.post("/lenses", lensData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                showAlert("Lens created successfully", "success");
                setFormData({
                    lensType: "",
                    sph: "",
                    cyl: "",
                    add: "",
                    price: "",
                    quantity: "",
                    corting: "",
                });
            } catch (error) {
                showAlert("Network error, try again", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: { xs: "90%", sm: 600 },
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
                            name="lensType"
                            value={formData.lensType}
                            onChange={handleChange}
                            variant="outlined"
                            label="Lens Type"
                        >
                            {loadingLensType && (
                                <MenuItem disabled>Loading...</MenuItem>
                            )}
                            {!loadingLensType && lensTypeList.data
                                ? lensTypeList.data.map((item) => (
                                      <MenuItem key={item.id} value={item.id}>
                                          {item.name}
                                      </MenuItem>
                                  ))
                                : ""}
                        </Select>
                        {errors.lensType && (
                            <Typography variant="caption" color="error">
                                Lens type is required.
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

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
                            {formData.lensType ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="SPH"
                                            variant="outlined"
                                            fullWidth
                                            type="number"
                                            name="sph"
                                            value={formData.sph}
                                            onChange={handleChange}
                                            error={errors.sph}
                                            helperText={
                                                errors.sph
                                                    ? "SPH is required."
                                                    : ""
                                            }
                                        />
                                    </Grid>
                                    {parseInt(formData.lensType) === 4 && (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="CYL"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                name="cyl"
                                                value={formData.cyl}
                                                onChange={handleChange}
                                                error={errors.cyl}
                                                helperText={
                                                    errors.cyl
                                                        ? "CYL is required."
                                                        : ""
                                                }
                                            />
                                        </Grid>
                                    )}

                                    {(parseInt(formData.lensType) === 2 ||
                                        parseInt(formData.lensType) === 3) && (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="ADD"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                name="add"
                                                value={formData.add}
                                                onChange={handleChange}
                                                error={errors.add}
                                                helperText={
                                                    errors.add
                                                        ? `ADD is required for this lens type.`
                                                        : ""
                                                }
                                            />
                                        </Grid>
                                    )}
                                    {parseInt(formData.lensType) === 3 && (
                                        <Grid item xs={12}>
                                            <FormControl
                                                fullWidth
                                                error={errors.side}
                                            >
                                                <InputLabel id="lens-side-label">
                                                    Lens Side
                                                </InputLabel>
                                                <Select
                                                    labelId="lens-side-label"
                                                    name="side"
                                                    value={formData.side} // Bind value to formData.side
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    label="Lens Side"
                                                >
                                                    <MenuItem value="left">
                                                        Left
                                                    </MenuItem>
                                                    <MenuItem value="right">
                                                        Right
                                                    </MenuItem>
                                                </Select>
                                                {errors.side && (
                                                    <Typography
                                                        variant="caption"
                                                        color="error"
                                                    >
                                                        Lens side is required.
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                            ) : (
                                <Typography variant="caption" color="error">
                                    Select Lens Type to add lense Powers
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="Price"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="price"
                        inputProps={{ min: 0 }}
                        value={formData.price}
                        onChange={handleChange}
                        error={errors.price}
                        helperText={errors.price ? "Price is required." : ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Quantity"
                        variant="outlined"
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        error={errors.quantity}
                        helperText={
                            errors.quantity ? "Quantity is required." : ""
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth error={errors.corting}>
                        <InputLabel id="corting-label">Coating</InputLabel>
                        <Select
                            labelId="corting-label"
                            name="corting"
                            value={formData.corting}
                            onChange={handleChange}
                        >
                            {loadingLenseCoting && (
                                <MenuItem disabled>Loading...</MenuItem>
                            )}
                            {!loadingLenseCoting && lenseCotingsList
                                ? lenseCotingsList.map((item) => (
                                      <MenuItem key={item.id} value={item.id}>
                                          {item.name}
                                      </MenuItem>
                                  ))
                                : ""}
                        </Select>
                        {errors.corting && (
                            <Typography variant="caption" color="error">
                                Coating is required.
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
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Add Lens"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
