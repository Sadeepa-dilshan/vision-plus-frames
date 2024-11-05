// VarianceAdd.js
import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

import VarianceCRUD from "../../Components/VarianceCRUD";

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

export default function VarianceAdd() {
    // State to hold selected values for each auto-select field
    const [selectedLensType, setSelectedLensType] = useState(null);
    const [selectedCoating, setSelectedCoating] = useState(null);
    const [selectedSPH, setSelectedSPH] = useState(null);
    const [selectedCYL, setSelectedCYL] = useState(null);

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
                Lens Variance
            </Typography>
            <Paper sx={{ p: 2 }}>
                <VarianceCRUD
                    label="Lens Types"
                    options={lensTypes}
                    selectedValue={selectedLensType}
                    onChange={setSelectedLensType}
                    onAdd={() => console.log("Add Lens Type")}
                    onEdit={() => console.log("Edit Lens Type")}
                    onDelete={() => console.log("Delete Lens Type")}
                />
            </Paper>
            <Paper sx={{ p: 2 }}>
                <VarianceCRUD
                    label="Lens Coatings"
                    options={lensCoatings}
                    selectedValue={selectedCoating}
                    onChange={setSelectedCoating}
                    onAdd={() => console.log("Add Coating")}
                    onEdit={() => console.log("Edit Coating")}
                    onDelete={() => console.log("Delete Coating")}
                />
            </Paper>
            <Paper sx={{ p: 2 }}>
                <VarianceCRUD
                    label="Lens SPH"
                    options={lensSPHOptions}
                    selectedValue={selectedSPH}
                    onChange={setSelectedSPH}
                    onAdd={() => console.log("Add SPH")}
                    onEdit={() => console.log("Edit SPH")}
                    onDelete={() => console.log("Delete SPH")}
                />
            </Paper>

            <Paper sx={{ p: 2 }}>
                <VarianceCRUD
                    label="Lens CYL"
                    options={lensCYLOptions}
                    selectedValue={selectedCYL}
                    onChange={setSelectedCYL}
                    onAdd={() => console.log("Add CYL")}
                    onEdit={() => console.log("Edit CYL")}
                    onDelete={() => console.log("Delete CYL")}
                />
            </Paper>
        </Box>
    );
}
