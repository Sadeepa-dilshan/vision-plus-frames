import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
} from "@mui/material";
import AutoSelectField from "../../Components/AutoSelectField";

// Sample data for auto-select fields
const lensTypes = [
    "Single Vision",
    "Bifocal",
    "Progressive",
    "Reading",
    "Photochromic",
];
const lensCoatings = [
    "Anti-Reflective",
    "Scratch Resistant",
    "Blue Light Blocking",
    "UV Protection",
    "Hydrophobic",
];
const lensSPHOptions = [-2.0, -1.5, -1.0, -2.5, -1.25];
const lensCYLOptions = [-0.5, -0.75, -1.0, 0.0, -0.25];
const lensADDOptions = [-0.5, -0.75, -1.0, 0.0, -0.25];

export default function VarianceAdd() {
    const [selectedValues, setSelectedValues] = useState({
        lensType: null,
        coating: null,
        SPH: null,
        CYL: null,
        ADD: null,
    });

    const [options, setOptions] = useState({
        lensTypes,
        lensCoatings,
        lensSPHOptions,
        lensCYLOptions,
        lensADDOptions,
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [currentItem, setCurrentItem] = useState("");
    const [newItem, setNewItem] = useState("");

    const handleSelectChange = (field, value) => {
        setSelectedValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    const handleAddOpen = (field) => {
        setCurrentField(field);
        setIsEditing(false);
        setNewItem("");
        setDialogOpen(true);
    };

    const handleEditOpen = (field, item) => {
        setCurrentField(field);
        setIsEditing(true);
        setCurrentItem(item);
        setNewItem(item);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewItem("");
    };

    const handleAddItem = () => {
        handleDialogClose();
    };

    const handleEditItem = () => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            [currentField]: prevOptions[currentField].map((item) =>
                item === currentItem ? newItem : item
            ),
        }));
        handleDialogClose();
    };

    return (
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ color: "primary.main", fontWeight: "bold" }}
            >
                Lens Variance
            </Typography>

            {[
                {
                    label: "Lens Types",
                    options: options.lensTypes,
                    selectedValue: selectedValues.lensType,
                    field: "lensType",
                },
                {
                    label: "Lens Coatings",
                    options: options.lensCoatings,
                    selectedValue: selectedValues.coating,
                    field: "lensCoatings",
                },
                {
                    label: "Lens SPH",
                    options: options.lensSPHOptions,
                    selectedValue: selectedValues.SPH,
                    field: "lensSPHOptions",
                },
                {
                    label: "Lens CYL",
                    options: options.lensCYLOptions,
                    selectedValue: selectedValues.CYL,
                    field: "lensCYLOptions",
                },
                {
                    label: "Lens ADD",
                    options: options.lensADDOptions,
                    selectedValue: selectedValues.ADD,
                    field: "lensADDOptions",
                },
            ].map((item, index) => (
                <Paper key={index} sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <AutoSelectField
                        label={item.label}
                        options={item.options}
                        selectedValue={item.selectedValue}
                        onChange={(value) =>
                            handleSelectChange(item.field, value)
                        }
                        onAdd={() => handleAddOpen(item.field)}
                        onEdit={() =>
                            handleEditOpen(item.field, item.selectedValue)
                        }
                        onDelete={() => console.log(`Delete ${item.label}`)}
                    />
                </Paper>
            ))}

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                    {isEditing ? `Edit ${currentField}` : `Add ${currentField}`}
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        label={
                            isEditing
                                ? `Edit ${currentField} Value`
                                : `New ${currentField} Value`
                        }
                        fullWidth
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions
                    sx={{ display: "flex", justifyContent: "center", p: 2 }}
                >
                    <Button
                        onClick={handleDialogClose}
                        color="secondary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={isEditing ? handleEditItem : handleAddItem}
                        color="primary"
                        variant="contained"
                    >
                        {isEditing ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
