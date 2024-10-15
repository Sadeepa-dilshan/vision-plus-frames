import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import useUser from "../hooks/useUser";
import useUserList from "../hooks/useUserList";

// ActionButtons Component

export default function UsersIndex() {
    const { token } = useStateContext(); // Get the auth token
    const { userDataList, loadingUserList, refreshUserList } = useUserList();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [deletingId, setDeletingId] = useState(null); // Track the ID of the user being deleted

    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        // Set the ID of the user being deleted
        setDeletingId(userId);

        axiosClient
            .delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshUserList();
            })
            .finally(() => {
                // Clear the deleting ID when done
                setDeletingId(null);
            });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "actions",
                header: "Actions",
                size: 30,
                Cell: ({ row }) => (
                    <Box>
                        <IconButton
                            component={Link}
                            to={`/users/${row.original.id}`}
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: 1 }}
                            disabled={deletingId === row.original.id} // Disable if deleting this user
                        >
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete}
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={deletingId === row.original.id} // Disable if deleting this user
                        >
                            {deletingId === row.original.id ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <Delete />
                            )}
                        </IconButton>
                    </Box>
                ),
            },
            {
                accessorKey: "id",
                header: "ID",
                size: 50,
            },
            {
                accessorKey: "name",
                header: "Name",
                size: 150,
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 200,
            },
        ],
        [deletingId] // Re-render when deletingId changes
    );

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <MaterialReactTable
                columns={columns}
                data={userDataList || []}
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
                state={{ isLoading: loadingUserList }}
                muiTableProps={{
                    sx: {
                        "& .MuiTableCell-root": {
                            padding: ".5rem", // Reduce padding for smaller density
                        },
                        "& .MuiTableRow-root": {
                            height: ".5rem", // Reduce row height for smaller density
                        },
                    },
                }}
                renderTopToolbarCustomActions={() => (
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#5b08a7" }}
                        >
                            Users List
                        </Typography>
                        <Button
                            onClick={() => navigate("/users/new")}
                            variant="contained"
                        >
                            New User
                        </Button>
                    </Box>
                )}
            />
        </Paper>
    );
}
