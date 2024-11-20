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

export default function CodeIndex() {
    const { token } = useStateContext(); // To handle the auth token
    const { codeDataList, loadingCodeList, refreshCodeList } = useCodeList();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null); // Track which code is being deleted
    const [loading, setLoading] = useState(null); // Track which code is being deleted

    const handleDelete = (codeId) => {
        if (!window.confirm("Are you sure you want to delete this code?")) {
            return;
        }

        // Set the current deleting code's ID
        setDeletingId(codeId);
        setLoading(true);
        axiosClient
            .delete(`/codes/${codeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshCodeList(); // Refresh the code list after deletion
            })
            .finally(() => {
                // Reset the deleting state
                setDeletingId(null);
                setLoading(false);
            });
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
