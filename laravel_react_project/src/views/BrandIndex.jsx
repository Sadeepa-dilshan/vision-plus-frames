import { useEffect, useState, useMemo, useCallback } from "react";
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
import useBrandList from "../hooks/useBrandList";
import { MaterialReactTable } from "material-react-table";

// ActionButtons Component
const ActionButtons = ({ brandId, onDelete, deletingId }) => (
    <>
        <IconButton
            component={Link}
            to={`/brands/edit/${brandId}`}
            variant="outlined"
            size="small"
            sx={{ marginRight: 1 }}
            disabled={deletingId === brandId} // Disable if deleting this brand
        >
            <Edit color="primary" />
        </IconButton>
        <IconButton
            onClick={() => onDelete(brandId)}
            variant="contained"
            color="error"
            size="small"
            disabled={deletingId === brandId} // Disable if deleting this brand
        >
            {deletingId === brandId ? (
                <CircularProgress size={20} color="inherit" />
            ) : (
                <Delete />
            )}
        </IconButton>
    </>
);

export default function BrandIndex() {
    const { token } = useStateContext(); // Get the auth token
    const { brandDataList, loadingBrandList, refreshBrandList } =
        useBrandList();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null); // Track the ID of the brand being deleted

    const handleDelete = (brandId) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) {
            return;
        }

        // Set the ID of the brand being deleted
        setDeletingId(brandId);

        axiosClient
            .delete(`/brands/${brandId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshBrandList();
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
                    <ActionButtons
                        brandId={row.original.id}
                        onDelete={handleDelete}
                        deletingId={deletingId} // Pass deletingId to ActionButtons
                    />
                ),
            },
            {
                accessorKey: "brand_name",
                header: "Brand Name",
                size: 150,
            },
            {
                accessorKey: "price",
                header: "Price",
                size: 150,
            },
        ],
        [deletingId] // Re-render when deletingId changes
    );

    return (
        <Box elevation={1} sx={{ padding: 1, marginTop: 3 }}>
            <MaterialReactTable
                columns={columns}
                data={brandDataList || []}
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
                state={{ isLoading: loadingBrandList }}
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
                            Brand Management
                        </Typography>
                        <Button
                            onClick={() => navigate("/brands/new")}
                            variant="contained"
                        >
                            Add New Brand
                        </Button>
                    </Box>
                )}
            />
        </Box>
    );
}
