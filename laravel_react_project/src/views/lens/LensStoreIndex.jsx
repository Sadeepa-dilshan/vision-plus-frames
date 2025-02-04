import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useMemo, useState } from "react";
import {
    Box,
    Stack,
    IconButton,
    Typography,
    Chip,
    Button,
    Checkbox,
    Input,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import {
    Add,
    AddCircle,
    Delete,
    Edit,
    History,
    RemoveCircle,
    Update,
} from "@mui/icons-material";
import useData from "../../hooks/useData";

import LenseQuantityAjustDialog from "../../Components/LenseQuantityAjustDialog";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import StockAlertDialog from "../../Components/StockAlertDialog";
import useLenseStoreValueSort from "../../hooks/useLenseStoreValueSort";
import LensePriceUpdate from "../../Components/LensePriceUpdate";
const LensStoreIndex = () => {
    const { token } = useStateContext(); // To handle the auth token
    const [qtyAjust, setQtyAjust] = React.useState({});
    const navigate = useNavigate();
    // const {
    //     data: lensesList,
    //     loading: loadingLensesList,
    //     error: errorLensesList,
    //     refresh: refreshLenses,
    // } = useData("lenses");
    const [stockAlert, setStockAlert] = useState({
        id: null,
        open: false,
    });
    const {
        data: lensesList,
        error: errorLensesList,
        loading: loadingLensesList,
        refresh: refreshLenses,
    } = useLenseStoreValueSort();

    const handleClose = () => {
        setStockAlert({ id: null, open: false });
    };
    const [openQuantityAjust, setOpenQuantityAjust] = React.useState({
        open: false,
        openType: null,
    });
    const [deletingId, setDeletingId] = useState(null); // Track which code is being deleted
    const [selectedLens, setSelectedLens] = useState(null);
    const [updatePrice, setUpdatePrice] = useState({
        open: false,
        id: null,
        data: null,
    });
    const handleQtyAjustClose = () => {
        setOpenQuantityAjust({ open: false, openType: null });
        setSelectedLens(null);
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
    const transformLensData = (data) => {
        const lens_powers = data.powers.map((power) => ({
            power_id: power.id,
            value: power.pivot.value,
            side: power.side,
        }));

        return {
            type_id: data.type_id,
            coating_id: data.coating_id,
            price: data.price,
            lens_powers,
            quantity: data.lens_stock.qty,
        };
    };
    const showDecimals = (value) => {
        if (
            typeof value === "number" &&
            !isNaN(value) &&
            Number.isFinite(value)
        ) {
            return parseFloat(value).toFixed(2);
        } else {
            // Value is not a number
            return "-";
        }
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
                header: "Quantity",
                accessorKey: "lens_stock.qty",
                size: 150,

                Cell: ({ row, cell }) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>{cell.getValue()}</Box>
                    </Box>
                ),
            },
            {
                header: "SPH",
                accessorKey: "sph",
                size: 120,

                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        {parseFloat(cell.getValue()) > 0 && "+"}

                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : showDecimals(cell.getValue()) || "-"}
                    </Typography>
                ),
            },
            {
                header: "CYL",
                accessorKey: "cyl",
                size: 120,

                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        {parseFloat(cell.getValue()) > 0 && "+"}
                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : showDecimals(cell.getValue()) || "-"}
                    </Typography>
                ),
            },
            {
                header: "ADD",
                accessorKey: "add",
                size: 120,

                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        {parseFloat(cell.getValue()) > 0 && "+"}
                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : showDecimals(cell.getValue())}
                    </Typography>
                ),
            },

            { header: "Coating", accessorKey: "coating.name" },
            {
                header: "L/R",
                accessorKey: "id",
                size: 120,

                Cell: ({ row, cell }) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {/* ... */}
                        {row.original["powers"] &&
                            row.original["powers"].length > 0 && (
                                <Typography
                                    sx={{ textTransform: "capitalize" }}
                                    variant="body1"
                                    color="textPrimary"
                                >
                                    {row.original["powers"][0]["side"]}
                                </Typography>
                            )}
                        {/* ... */}
                    </Box>
                ),
            },

            {
                header: "Price",
                accessorKey: "price",
                enableGrouping: false,
                Cell: ({ cell, row }) => (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{cell.getValue()}</Typography>
                        <IconButton
                            onClick={() => {
                                // handleDelete

                                handleDelete(row.original.id);
                            }}
                        >
                            <Delete color="error" />
                        </IconButton>
                    </Box>
                ),
            },
            {
                header: "Alert Limit",
                accessorKey: "lens_stock.limit",
                Cell: ({ cell, row }) => (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{cell.getValue()}</Typography>
                        <IconButton
                            onClick={() => {
                                // handleDelete

                                setStockAlert({
                                    id: row.original.lens_stock.id,
                                    open: true,
                                });
                            }}
                        >
                            <Edit color="warning" />
                        </IconButton>
                    </Box>
                ),
            },
            {
                header: "Quantity Ajust",
                accessorKey: "lens_stock.id",
                enableGrouping: false,
                Cell: ({ row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Input
                            type="number"
                            value={
                                qtyAjust[row.original.id]?.ajustQty ?? "" // If the value exists, show it; otherwise, show an empty string
                            }
                            onInput={(e) => {
                                if (e.target.value < 0) {
                                    e.target.value = ""; // Clear the input if a negative value is entered
                                }
                            }}
                            disabled={!qtyAjust.hasOwnProperty(row.original.id)}
                            onChange={(e) => {
                                if (qtyAjust[row.original.id]) {
                                    const updatedState = { ...qtyAjust };
                                    updatedState[row.original.id] = {
                                        ...updatedState[row.original.id],
                                        ajustQty: parseInt(e.target.value),
                                    };
                                    setQtyAjust(updatedState);
                                }
                            }}
                        />
                    </Box>
                ),
            },
        ],
        [lensesList, qtyAjust, updatePrice]
    );
    const handlePriceUpdateClose = () => {
        setUpdatePrice({
            open: false,
            id: null,
            data: null,
        });
    };
    return (
        <div>
            <MaterialReactTable
                renderTopToolbar={() => (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => {
                                setOpenQuantityAjust({
                                    open: true,
                                    openType: "add",
                                });
                            }}
                        >
                            Add <AddCircle />
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                                setOpenQuantityAjust({
                                    open: true,
                                    openType: "remove",
                                });
                            }}
                        >
                            Remove <RemoveCircle />
                        </Button>
                    </Box>
                )}
                enableRowActions
                renderRowActions={({ row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            variant="contained"
                            size="small"
                            onClick={() =>
                                window.open(
                                    `/lens/${row.original.id}/history`,
                                    "_blank"
                                )
                            }
                        >
                            <History />
                        </IconButton>

                        <Checkbox
                            onChange={(e) => {
                                const updatedState = { ...qtyAjust };

                                if (e.target.checked) {
                                    // Add the item to the state when checked
                                    updatedState[row.original.id] =
                                        row.original;
                                } else {
                                    // Remove the item from the state when unchecked
                                    delete updatedState[row.original.id];
                                }

                                // Update the state
                                setQtyAjust(updatedState);
                            }}
                        />
                        {
                            <IconButton
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setUpdatePrice({
                                        open: true,
                                        id: row.original.id,
                                        data: transformLensData(row.original),
                                    });
                                }}
                            >
                                <Edit />
                            </IconButton>
                        }
                    </Box>
                )}
                columns={columns}
                data={lensesList}
                enableColumnResizing
                muiFilterCheckboxProps={{ color: "primary" }}
                enableGrouping
                enableStickyHeader
                enableStickyFooter
                initialState={{
                    density: "compact",
                    expanded: false,
                    grouping: ["type.name"],
                    pagination: { pageIndex: 0, pageSize: 20 },
                    sorting: [
                        { id: "sph", desc: false }, // Sort 'sph' in ascending order
                        { id: "cyl", desc: false }, // Sort 'cyl' in ascending order
                        { id: "add", desc: false }, // Sort 'add' in ascending order
                    ],
                }}
                state={{
                    isLoading: loadingLensesList,
                    showAlertBanner: errorLensesList !== null,
                    showProgressBars: loadingLensesList,
                }}
                muiToolbarAlertBannerChipProps={{ color: "primary" }}
                muiTableContainerProps={{ sx: { maxHeight: 700 } }}
                muiTableBodyRowProps={({ row }) => {
                    const lensType = row.original?.type?.id;

                    return {
                        sx: {
                            backgroundColor:
                                lensType === 2
                                    ? "#E4FFE6"
                                    : lensType === 3
                                    ? "#FFF2E4"
                                    : lensType === 4
                                    ? "#E4E7FF"
                                    : "inherit", // Default background
                        },
                    };
                }}
            />

            <LenseQuantityAjustDialog
                openQuantityAjust={openQuantityAjust}
                handleClose={handleQtyAjustClose}
                selectedLenses={qtyAjust}
                refreshLenses={refreshLenses}
                setQtyAjust={setQtyAjust}
            />
            <StockAlertDialog
                id={stockAlert.id}
                open={stockAlert.open}
                onClose={handleClose}
                refresh={refreshLenses}
            />
            <LensePriceUpdate
                open={updatePrice}
                onClose={handlePriceUpdateClose}
                refresh={refreshLenses}
            />
        </div>
    );
};

export default LensStoreIndex;
