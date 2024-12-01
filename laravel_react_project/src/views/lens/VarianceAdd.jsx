import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import AutoSelectField from "../../Components/AutoSelectField";
import useData from "../../hooks/useData";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { useAlert } from "../../contexts/AlertContext";

export default function VarianceAdd() {
    const { token } = useStateContext();
    const { showAlert } = useAlert();

    const navigate = useNavigate();
    const {
        data: lensTypeList,
        loading: loadingLenceType,
        // error: errorLenceType,
        refresh: refreshLenceType,
    } = useData("lens-types");
    console.log(lensTypeList);

    const {
        data: lenseCotingsList,
        loading: loadingLenseCoting,
        // error: errorLenceCoting,
        refresh: refreshLenceCoting,
    } = useData("lens-coatings");

    const [selectedValues, setSelectedValues] = useState({
        lensType: null,
        lensCoatings: null,
    });

    const handleSelectChange = (field, value) => {
        // setSelectedValues((prevValues) => ({ ...prevValues, [field]: value }));
        setSelectedValues((prevValues) => ({ ...prevValues, [field]: value }));
    };
    const handleDelete = async (id, field) => {
        if (field === "lensType") {
            try {
                const response = await axiosClient.delete(`/lens-types/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Optional: If your API requires authentication
                    },
                });

                showAlert("successfully Deleted", "success");
                refreshLenceType();
            } catch (error) {
                showAlert("Delete Failed try again", "error");
            }
        } else if (field === "lensCoatings") {
            console.log(id);

            try {
                const response = await axiosClient.delete(
                    `/lens-coatings/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Optional: If your API requires authentication
                        },
                    }
                );
                showAlert("successfully Deleted", "success");
                refreshLenceCoting();
            } catch (error) {
                showAlert("Delete Failed try again", "error");
            }
        }
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
                    loading: loadingLenceType,
                },
                {
                    label: "Lens Coatings",
                    options: lenseCotingsList,
                    selectedValue: selectedValues.lensCoatings,
                    field: "lensCoatings",
                    path: "lense_coating",
                    loading: loadingLenseCoting,
                },
            ].map((item, index) => (
                <Paper key={index} sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <AutoSelectField
                        label={item.label}
                        options={item.options}
                        loading={item.loading}
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
                        onDelete={() =>
                            item.field !== "lensType" &&
                            handleDelete(item.selectedValue, item.field)
                        }
                    />
                </Paper>
            ))}
        </Box>
    );
}
