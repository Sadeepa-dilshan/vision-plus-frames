import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import AutoSelectField from "../../Components/AutoSelectField";
import useData from "../../hooks/useData";
import { useNavigate } from "react-router-dom";

export default function VarianceAdd() {
    const navigate = useNavigate();
    const {
        data: lensTypeList,
        loading: loadingLenceType,
        // error: errorLenceType,
        // refresh: refreshLenceType,
    } = useData("lens-types");
    const {
        data: lenseCotingsList,
        loading: loadingLenseCoting,
        // error: errorLenceCoting,
        // refresh: refreshLenceCoting,
    } = useData("lens-coatings");

    const [selectedValues, setSelectedValues] = useState({
        lensType: null,
        lensCoatings: null,
    });

    const handleSelectChange = (field, value) => {
        // setSelectedValues((prevValues) => ({ ...prevValues, [field]: value }));
        setSelectedValues((prevValues) => ({ ...prevValues, [field]: value }));
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
                    options: lensTypeList?.data || [],
                    selectedValue: selectedValues.lensType,
                    field: "lensType",
                    path: "lense_type",
                },
                {
                    label: "Lens Coatings",
                    options: lenseCotingsList,
                    selectedValue: selectedValues.lensCoatings,
                    field: "lensCoatings",
                    path: "lense_coating",
                },
            ].map((item, index) => (
                <Paper key={index} sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <AutoSelectField
                        label={item.label}
                        options={item.options}
                        loading={loadingLenceType}
                        selectedValue={item.selectedValue}
                        onChange={(value) => {
                            handleSelectChange(item.field, value);
                        }}
                        onAdd={() => {
                            navigate(`/lens/${item.path}/new/`);
                        }}
                        onEdit={() =>
                            navigate(
                                `/lens/${item.path}/edit/${item.selectedValue}`
                            )
                        }
                        onDelete={() => console.log(`Delete ${item.label}`)}
                    />
                </Paper>
            ))}
        </Box>
    );
}
