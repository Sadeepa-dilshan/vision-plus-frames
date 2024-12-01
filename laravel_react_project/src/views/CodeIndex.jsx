import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    IconButton,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Button,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import useCodeList from "../hooks/useCodeList";
import { deleteObject, listAll, ref } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { useAlert } from "../contexts/AlertContext";

export default function CodeIndex() {
    const { token } = useStateContext(); // To handle the auth token
    const { codeDataList, loadingCodeList, refreshCodeList } = useCodeList();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null); // Track which code is being deleted
    const [loading, setLoading] = useState(null); // Track which code is being deleted
    const { showAlert } = useAlert();

    const handleDelete = async (codeId) => {
        if (!window.confirm("Are you sure you want to delete this code?")) {
            return;
        }

        try {
            // Set the current deleting code's ID
            setDeletingId(codeId);
            setLoading(true);

            // Delete the code from your backend
            await axiosClient.delete(`/codes/${codeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Delete associated files from Firebase Storage
            const desertRef = ref(storage, `images/${codeId}`);
            const res = await listAll(desertRef);

            // Ensure all delete operations are completed
            const deletePromises = res.items.map((itemRef) =>
                deleteObject(itemRef)
            );
            await Promise.all(deletePromises);
            showAlert("Sucescully Deleted", "success");
            refreshCodeList();
        } catch (error) {
            showAlert(
                "Error during deletion refresh the page and try gain:",
                "error"
            );
        } finally {
            setDeletingId(null);
            setLoading(false);
        }
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "actions",
                header: "Actions",
                size: 200,
                Cell: ({ row }) => (
                    <>
                        <IconButton
                            component={Link}
                            to={`/codes/edit/${row.original.id}`}
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: 1 }}
                            disabled={deletingId === row.original.id} // Disable while deleting
                        >
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(row.original.id)}
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={deletingId === row.original.id} // Disable while deleting
                        >
                            {deletingId === row.original.id ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <Delete />
                            )}
                        </IconButton>
                    </>
                ),
            },
            {
                accessorKey: "brand.brand_name",
                header: "Brand",
                size: 150,
            },
            {
                accessorKey: "code_name",
                header: "Frame Code",
                size: 150,
            },
        ],
        [deletingId]
    );

    return (
        <Paper elevation={3} sx={{ padding: 1, marginTop: 3 }}>
            <MaterialReactTable
                columns={columns}
                data={codeDataList}
                enablePagination
                enableColumnFilters
                enableRowSelection={false}
                enableSorting
                enableToolbarInternalActions
                initialState={{ pagination: { pageSize: 20 } }}
                muiToolbarAlertBannerProps={{
                    color: "primary",
                }}
                muiTableContainerProps={{
                    sx: { maxHeight: "calc(100vh - 210px)" },
                }}
                state={{ isLoading: loadingCodeList }}
                muiTableProps={{
                    sx: {
                        "& .MuiTableCell-root": {
                            padding: ".5rem",
                        },
                        "& .MuiTableRow-root": {
                            height: ".5rem",
                        },
                    },
                }}
                renderTopToolbarCustomActions={() => (
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#5b08a7" }}
                        >
                            Frame Code Management
                        </Typography>
                        <Button
                            onClick={() => navigate("/codes/new")}
                            variant="contained"
                        >
                            Add New Code
                        </Button>
                    </Box>
                )}
            />
        </Paper>
    );
}
