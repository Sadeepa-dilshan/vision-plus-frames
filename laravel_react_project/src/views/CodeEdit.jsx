import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import {
    Card,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import useCodeList from "../hooks/useCodeList";
import useBrandList from "../hooks/useBrandList";
import useCode from "../hooks/useCode";
import DropdownInput from "../Components/DropdownInput";

export default function CodeEdit() {
    const navigate = useNavigate();

    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // Get the code ID from the URL

    const [brandId, setBrandId] = useState(""); // Selected brand ID
    const [codeName, setCodeName] = useState(""); // Name of the code
    const [errors, setErrors] = useState(null);
    const { token } = useStateContext(); // To handle the auth token

    const { brandDataList, loadingBrandList } = useBrandList();
    const { codeDataList } = useCodeList();
    const { codeData, loadingCode } = useCode(id);

    useEffect(() => {
        if (codeData) {
            setBrandId(codeData.brand_id);
            setCodeName(codeData.code_name);
        }
    }, [id, token, codeData]);
    const handleBrandListSelectionChange = (selectedValue) => {
        setBrandId(selectedValue);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);
        try {
            if (codeDataList) {
                const exists = codeDataList?.some(
                    (item) =>
                        item.brand_id === brandId && item.code_name === codeName
                );

                if (exists) {
                    showAlert("Code already exists", "error");
                } else {
                    await axiosClient.put(
                        `/codes/${id}`,
                        {
                            brand_id: brandId,
                            code_name: codeName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    showAlert("Code updated successfully", "success");
                    navigate("/codes");
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Edit Code
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ marginBottom: 3 }}>
                    <DropdownInput
                        //pass array list [{name: "Brand 1", id: 1}]
                        options={brandDataList.map((brand) => ({
                            name: brand.brand_name,
                            id: brand.id,
                        }))}
                        onChange={handleBrandListSelectionChange} // Will receive the selected brand's id
                        loading={loadingBrandList}
                        labelName="Select Brand"
                        defaultId={brandId} // Pass the Defalt value
                    />
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        fullWidth
                        label="Code Name"
                        value={codeName}
                        onChange={(e) => setCodeName(e.target.value)}
                        variant="outlined"
                        error={!!errors}
                        helperText={errors ? errors.code_name : ""}
                        required
                        InputProps={{
                            endAdornment: loadingCode ? (
                                <CircularProgress size={24} />
                            ) : null, // Show spinner when loading
                        }}
                        disabled={loadingCode}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        disabled={loading}
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={
                            loading ? <CircularProgress size={24} /> : null
                        }
                    >
                        {loading ? "Updating..." : "Update Code"}
                    </Button>
                </Box>
            </form>
        </Card>
    );
}
