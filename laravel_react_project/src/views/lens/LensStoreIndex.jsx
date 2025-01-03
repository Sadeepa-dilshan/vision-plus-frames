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
} from "@mui/icons-material";
import useData from "../../hooks/useData";

import LenseQuantityAjustDialog from "../../Components/LenseQuantityAjustDialog";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import StockAlertDialog from "../../Components/StockAlertDialog";
import useLenseStoreValueSort from "../../hooks/useLenseStoreValueSort";
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
        refreshLenses();
    };
    const [openQuantityAjust, setOpenQuantityAjust] = React.useState({
        open: false,
        openType: null,
    });
    const [deletingId, setDeletingId] = useState(null); // Track which code is being deleted
    const [selectedLens, setSelectedLens] = useState(null);

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
                        {/* <IconButton
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => {
                                setOpenQuantityAjust({
                                    open: true,
                                    openType: "add",
                                });

                                setSelectedLens(row.original);
                            }}
                        >
                            <AddCircle />
                        </IconButton> */}

                        {/* <IconButton
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                                setOpenQuantityAjust({
                                    open: true,
                                    openType: "remove",
                                });
                                setSelectedLens(row.original);
                            }}
                        >
                            <RemoveCircle />
                        </IconButton> */}
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
                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : cell.getValue() || "-"}
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
                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : cell.getValue() || "-"}
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
                        {parseFloat(cell.getValue()) === 0
                            ? "Plano"
                            : cell.getValue() || "-"}
                    </Typography>
                ),
            },
            // {
            //     header: "Powers",
            //     accessorKey: "powers",
            //     enableGrouping: false,
            //     size: 300,
            //     Cell: ({ row, cell }) => (
            //         <Box
            //             sx={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "center",
            //             }}
            //         >
            //             {cell
            //                 .getValue()
            //                 .sort((a, b) =>
            //                     a.name === "sph" ? -1 : b.name === "sph" ? 1 : 0
            //                 ) // Sort sph first
            //                 .map((power, index) => (
            //                     <Box
            //                         key={power.id}
            //                         sx={{
            //                             display: "flex", // Arrange the elements horizontally
            //                             gap: 1, // Space between elements
            //                             alignItems: "center", // Align the items centrally
            //                             justifyContent: "flex-start", // Align items to the left
            //                             mr: 1,
            //                         }}
            //                     >
            //                         <Chip
            //                             size="small"
            //                             label={power.name}
            //                             sx={{
            //                                 background:
            //                                     power.name === "sph"
            //                                         ? "#b6dafc"
            //                                         : power.name === "cyl"
            //                                         ? "#b6b9fc"
            //                                         : "#cffcb6",
            //                                 color: "#000", // Ensure the text is visible
            //                                 textTransform: "capitalize", // Capitalize the label text
            //                             }}
            //                         />

            //                         <Typography
            //                             variant="body2"
            //                             sx={{
            //                                 fontWeight: "bold", // Make the text bold for emphasis
            //                                 textAlign: "center", // Center the text if it's a single word
            //                             }}
            //                         >
            //                             {power.pivot.value == 0
            //                                 ? "Plano"
            //                                 : power.pivot.value}
            //                         </Typography>
            //                     </Box>
            //                 ))}
            //             {row.original.type_id === 3 && (
            //                 <Chip
            //                     size="small"
            //                     label={`${cell.getValue()[0].side} side`}
            //                     color="primary"
            //                     sx={{ textTransform: "capitalize" }}
            //                 />
            //             )}
            //         </Box>
            //     ),
            // },

            { header: "Coating", accessorKey: "coating.name" },
            {
                header: "L/R",
                accessorKey: "powers",
                size: 120,

                Cell: ({ cell, row }) => (
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography sx={{ textTransform: "capitalize" }}>
                            {cell.getValue()[0]["side"]
                                ? cell.getValue()[0]["side"]
                                : "-"}
                        </Typography>
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
                            onClick={
                                () => {
                                    // handleDelete

                                    setStockAlert({
                                        id: row.original.id,
                                        open: true,
                                    });
                                }
                                // navigate(`/lens/edit_lens/${row.original.id}`)
                            }
                        >
                            <Edit color="error" />
                        </IconButton>
                    </Box>
                ),
            },
            {
                header: "Quantity Ajust",
                accessorKey: "id",
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
        [lensesList, qtyAjust]
    );

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
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                        { id: "coating.name", desc: false },
                        { id: "sph", desc: false }, // Sort 'sph' in ascending order
                        { id: "cyl", desc: false }, // Sort 'cyl' in ascending order
                        { id: "add", desc: false }, // Sort 'add' in ascending order
                    ],
                }}
                state={{ isLoading: loadingLensesList }}
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
            />
        </div>
    );
};

export default LensStoreIndex;
