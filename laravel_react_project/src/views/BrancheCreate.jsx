import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import useBranchList from "../hooks/useBranchList";

export default function BranchCreate() {
    const navigate = useNavigate();

    // Context Alert Bar + Auth Token
    const { showAlert } = useAlert();
    const { token } = useStateContext();

    //User Input
    const [branchName, setBranchName] = useState("");

    //Submite Stats
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { branchDataList } = useBranchList();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (branchDataList) {
                const exists = branchDataList.some(
                    (item) => item.branch_name === branchName
                );
                if (exists) {
                    showAlert("Branch already exists", "error");
                } else {
                    await axiosClient.post(
                        "/branches",
                        {
                            branche_name: branchName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    showAlert("Branch created successfully", "success");
                    navigate("/branches"); // Redirect to the branch list after creation
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
                Create New Branch
            </Typography>
            <form onSubmit={handleSubmit}>
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

                <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={24} /> : null}
                >
                    {loading ? "Creating..." : "Create Branch"}
                </Button>
            </form>
        </Card>
    );
}
