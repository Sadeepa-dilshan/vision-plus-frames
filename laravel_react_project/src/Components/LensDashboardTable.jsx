import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const LensDashboardTable = () => {
    // Sample data for the table
    const rows = [
        {
            lensType: "Single Vision",
            coating: "Anti-Reflective",
            power: "-1.25",
            count: 15,
        },
        {
            lensType: "Bifocal",
            coating: "Blue Light Block",
            power: "-2.00",
            count: 10,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        {
            lensType: "Progressive",
            coating: "Scratch-Resistant",
            power: "-3.50",
            count: 8,
        },
        // Add more rows as needed
    ];

    return (
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2, overflow: "hidden" }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            #
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Lens Type
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Coating
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Power
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Count
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                "&:nth-of-type(odd)": {
                                    backgroundColor: "action.hover",
                                },
                                "&:hover": {
                                    backgroundColor: "action.selected",
                                },
                            }}
                        >
                            <TableCell sx={{ p: 1.5 }}>#{index + 1}</TableCell>
                            <TableCell sx={{ p: 1.5 }}>
                                {row.lensType}
                            </TableCell>
                            <TableCell sx={{ p: 1.5 }}>{row.coating}</TableCell>
                            <TableCell sx={{ p: 1.5 }}>{row.power}</TableCell>
                            <TableCell sx={{ p: 1.5 }}>{row.count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LensDashboardTable;
