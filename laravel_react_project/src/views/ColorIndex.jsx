import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { IconButton, Paper, Typography, CircularProgress } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import useColorList from "../hooks/useColorList";

export default function ColorIndex() {
    const { token } = useStateContext(); // To handle the auth token
    const { colorDataList, loadingColorList, refreshColorList } =
        useColorList();

    const [deletingId, setDeletingId] = useState(null); // Track which color is being deleted

    const handleDelete = (colorId) => {
        if (!window.confirm("Are you sure you want to delete this color?")) {
            return;
        }

        // Set the current deleting color's ID
        setDeletingId(colorId);

        axiosClient
            .delete(`/colors/${colorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshColorList(); // Refresh the color list after deletion
            })
            .finally(() => {
                // Reset the deleting state
                setDeletingId(null);
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
                            to={`/colors/edit/${row.original.id}`}
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
                accessorKey: "color_name",
                header: "Color Name",
                size: 150,
                Cell: ({ cell }) => (
                    <span style={{ textTransform: "capitalize" }}>
                        {cell.getValue()}
                    </span>
                ),
            },
        ],
        [deletingId]
    );

    return (
        <Paper elevation={3} sx={{ padding: 1, marginTop: 3 }}>
            <MaterialReactTable
                columns={columns}
                data={colorDataList}
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
                state={{ isLoading: loadingColorList }}
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
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#5b08a7" }}
                    >
                        Frame Colors
                    </Typography>
                )}
            />
        </Paper>
    );
}
