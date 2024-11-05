import React, { useMemo, useState } from "react";
import { Box, Stack, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

const LensStoreIndex = () => {
    const initialData = [
        {
            lensType: "Single Vision",
            sph: -2.0,
            cyl: -0.5,
            quantity: 10,
            color: "Clear",
        },
        {
            lensType: "Bifocal",
            sph: -1.5,
            cyl: -0.75,
            quantity: 5,
            color: "Brown",
        },
        {
            lensType: "very focal",
            sph: -1.0,
            cyl: -1.0,
            quantity: 8,
            color: "Gray",
        },
        {
            lensType: "Bifocal",
            sph: -2.5,
            cyl: 0.0,
            quantity: 12,
            color: "Green",
        },
        {
            lensType: "Single Vision",
            sph: -1.25,
            cyl: -0.25,
            quantity: 15,
            color: "Blue",
        },
    ];

    const [data, setData] = useState(initialData);

    const handleIncreaseQuantity = (rowIndex) => {
        const newData = [...data];
        newData[rowIndex].quantity += 1;
        setData(newData);
        console.log("Increased Quantity for:", newData[rowIndex]);
    };

    const handleDecreaseQuantity = (rowIndex) => {
        const newData = [...data];
        if (newData[rowIndex].quantity > 0) {
            newData[rowIndex].quantity -= 1;
            setData(newData);
            console.log("Decreased Quantity for:", newData[rowIndex]);
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "Lens Type",
                accessorKey: "lensType",
                enableGrouping: true,
            },
            {
                header: "Sph",
                accessorKey: "sph",
                enableGrouping: true,
                GroupedCell: ({ cell, row }) => (
                    <Box sx={{ color: "primary.main" }}>
                        <strong>Sph: {cell.getValue()}</strong> (
                        {row.subRows.length})
                    </Box>
                ),
            },
            { header: "Cyl", accessorKey: "cyl" },
            {
                header: "Quantity",
                accessorKey: "quantity",
                Cell: ({ row }) => (
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                    handleIncreaseQuantity(row.index)
                                }
                            >
                                +
                            </Button>
                            <Box>{row.getValue("quantity")}</Box>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() =>
                                    handleDecreaseQuantity(row.index)
                                }
                                disabled={row.getValue("quantity") === 0}
                            >
                                -
                            </Button>
                        </Stack>
                    </Box>
                ),
                Footer: () => (
                    <Stack>
                        Total Quantity:
                        <Box color="warning.main">
                            {data.reduce((acc, curr) => acc + curr.quantity, 0)}
                        </Box>
                    </Stack>
                ),
            },
            { header: "Color", accessorKey: "color" },
        ],
        [data]
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnResizing
            enableGrouping
            enableStickyHeader
            enableStickyFooter
            initialState={{
                density: "compact",
                expanded: false,
                grouping: ["lensType"],
                pagination: { pageIndex: 0, pageSize: 20 },
            }}
            muiToolbarAlertBannerChipProps={{ color: "primary" }}
            muiTableContainerProps={{ sx: { maxHeight: 700 } }}
        />
    );
};

export default LensStoreIndex;
