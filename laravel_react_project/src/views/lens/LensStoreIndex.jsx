import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useMemo, useState } from "react";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { Add, AddCircle, Edit, RemoveCircle } from "@mui/icons-material";
import useData from "../../hooks/useData";
import AddLensesDialog from "../../Components/AddLensesDialog";
import LenseQuantityAjustDialog from "../../Components/LenseQuantityAjustDialog";
const LensStoreIndex = () => {
    const navigate = useNavigate();
    const {
        data: lensesList,
        loading: loadingLensesList,
        error: errorLensesList,
        refresh: refreshLenses,
    } = useData("lenses");
    const [open, setOpen] = React.useState(false);
    const [openQuantityAjust, setOpenQuantityAjust] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleQtyAjustClose = () => {
        setOpenQuantityAjust(false);
    };
    console.log(lensesList);

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
                        <IconButton
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => {
                                handleClickOpen();
                            }}
                            //change hover textcolor to black

                            sx={{
                                marginRight: 1,
                                bgcolor: "primary.main",
                                color: "white", //hover textcolor to black
                                "&:hover": {
                                    color: "black",
                                },
                            }}
                        >
                            <Add />
                        </IconButton>
                        <div>
                            {cell.getValue().map((power) => (
                                <Box
                                    key={power.id}
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            textTransform: "capitalize",
                                        }}
                                        variant="body2"
                                    >
                                        {power.name}-
                                    </Typography>
                                    <Typography variant="body2">
                                        {power.pivot.value}
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {cell.getValue()}
                        {/* <IconButton
                            onClick={() =>
                                navigate(`/lens/edit_lens/${row.original.id}`)
                            }
                        >
                            <Edit />
                        </IconButton> */}
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
