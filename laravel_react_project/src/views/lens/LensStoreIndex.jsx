import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useMemo, useState } from "react";
import { Box, Stack, IconButton, Typography, Chip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import {
    Add,
    AddCircle,
    Delete,
    Edit,
    RemoveCircle,
} from "@mui/icons-material";
import useData from "../../hooks/useData";
import AddLensesDialog from "../../Components/AddLensesDialog";
import LenseQuantityAjustDialog from "../../Components/LenseQuantityAjustDialog";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
const LensStoreIndex = () => {
    const { token } = useStateContext(); // To handle the auth token

    const navigate = useNavigate();
    const {
        data: lensesList,
        loading: loadingLensesList,
        error: errorLensesList,
        refresh: refreshLenses,
    } = useData("lenses");
    const [open, setOpen] = React.useState(false);
    const [openQuantityAjust, setOpenQuantityAjust] = React.useState(false);
    const [deletingId, setDeletingId] = useState(null); // Track which code is being deleted

    const handleClose = () => {
        setOpen(false);
    };
    const handleQtyAjustClose = () => {
        setOpenQuantityAjust(false);
    };
    const handleDelete = (codeId) => {
        if (!window.confirm("Are you sure you want to delete this code?")) {
            return;
        }

        // Set the current deleting code's ID
        setDeletingId(codeId);

        axiosClient
            .delete(`/lenses/${codeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                refreshLenses(); // Refresh the code list after deletion
            })
            .finally(() => {
                // Reset the deleting state
                setDeletingId(null);
            });
    };

    const columns = useMemo(
        () => [
            {
                header: "Lens Type",
                accessorKey: "type.name",
                enableGrouping: true,
                GroupedCell: ({ cell, row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <strong>{cell.getValue()}</strong>
                    </Box>
                ),
            },
            {
                header: "Powers",
                accessorKey: "powers",
                enableGrouping: false,
                Cell: ({ cell }) => (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            {cell.getValue().map((power) => (
                                <Box
                                    key={power.id}
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            textTransform: "capitalize",
                                            m: 0.5,
                                        }}
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        <Chip label={power.name} />
                                    </Typography>
                                    <Typography variant="body2">
                                        {power.pivot.value == 0
                                            ? "Plano"
                                            : power.pivot.value}
                                    </Typography>
                                </Box>
                            ))}
                        </div>
                    </Box>
                ),
            },

            {
                header: "Quantity",
                accessorKey: "lens_stock.qty",
                Cell: ({ row, cell }) => (
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => setOpenQuantityAjust(true)}
                            >
                                <AddCircle />
                            </IconButton>
                            <Box>{cell.getValue()}</Box>
                            {/* //add icon button with add remove icons */}

                            <IconButton
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => setOpenQuantityAjust(true)}
                            >
                                <RemoveCircle />
                            </IconButton>
                        </Stack>
                    </Box>
                ),
            },
            { header: "Coating", accessorKey: "coating.name" },
            {
                header: "Price",
                accessorKey: "price",
                enableGrouping: false,
                Cell: ({ cell, row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{cell.getValue()}</Typography>
                        <IconButton
                            onClick={
                                () => {
                                    // handleDelete

                                    handleDelete(row.original.id);
                                }
                                // navigate(`/lens/edit_lens/${row.original.id}`)
                            }
                        >
                            <Delete color="error" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [lensesList]
    );

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={lensesList}
                enableColumnResizing
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    density: "compact",
                    expanded: false,
                    grouping: ["type.name"],
                    pagination: { pageIndex: 0, pageSize: 20 },
                }}
                state={{ isLoading: loadingLensesList }}
                muiToolbarAlertBannerChipProps={{ color: "primary" }}
                muiTableContainerProps={{ sx: { maxHeight: 700 } }}
            />
            <AddLensesDialog open={open} handleClose={handleClose} />
            <LenseQuantityAjustDialog
                open={openQuantityAjust}
                handleClose={handleQtyAjustClose}
            />
        </div>
    );
};

export default LensStoreIndex;
