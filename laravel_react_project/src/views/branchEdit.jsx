import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

import { useAlert } from "../contexts/AlertContext";
import {
    Button,
    CircularProgress,
    TextField,
    Card,
    Typography,
    Box,
} from "@mui/material";

import useBranch from "../hooks/useBranch";
import useBranchList from "../hooks/useBranchList";

export default function BranchEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the branch ID from the URL

    //Hooks
    const { showAlert } = useAlert();
    const { branchDataList } = useBranchList();
    const { branchData, loadingBranch } = useBranch(id);
    const { token } = useStateContext(); // Get the auth token

    //User Input Handlers
    const [branchName, setBranchName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (branchData) {
            setBranchName(branchData.branch_name);
            setPrice(branchData.price);
        }
    }, [branchData, loadingBranch]);

    //Update Branch Name,Price
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (branchDataList) {
                const exists = branchDataList.some(
                    (item) =>
                        item.branch_name === branchName &&
                        parseInt(item.price) == parseInt(price)
                );

                if (exists) {
                    showAlert("Branch is already exists", "error");
                } else {
                    await axiosClient.put(
                        `/branchs/${id}`,
                        { branch_name: branchName, price: price },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    showAlert("Branch updated successfully", "success");
                    navigate("/branchs"); // Redirect to the branch list after updating
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ padding: 4, maxWidth: 500, margin: "auto", marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                Edit Branch
            </Typography>
            <form onSubmit={handleSubmit}>
                {loadingBranch ? (
                    <CircularProgress />
                ) : (
                    <div>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Branch Name"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                variant="outlined"
                                error={!!errors}
                                helperText={errors ? errors.branch_name : ""}
                                required
                            />
                        </Box>
                        <Box sx={{ marginBottom: 3 }}>
                            <TextField
                                fullWidth
                                label="Price"
                                value={price}
                                type="number"
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    // Prevent entering negative numbers
                                    if (inputValue >= 0) {
                                        setPrice(inputValue);
                                    }
                                }}
                                variant="outlined"
                                error={!!errors}
                                helperText={errors ? errors.price : ""}
                                required
                            />
                        </Box>
                        <Button
                            disabled={loading}
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={
                                loading ? <CircularProgress size={24} /> : null
                            }
                        >
                            {loading ? "Updating..." : "Update Branch"}
                        </Button>
                    </div>
                )}
            </form>
        </Card>
    );
}
