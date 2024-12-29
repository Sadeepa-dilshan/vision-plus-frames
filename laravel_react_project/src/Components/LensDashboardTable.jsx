import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Chip,
    CircularProgress,
} from "@mui/material";

const LensDashboardTable = ({ lenses, loading }) => {
    return (
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                p: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
        >
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : lenses.length === 0 ? (
                <Typography
                    variant="body1"
                    textAlign="center"
                    color="text.secondary"
                >
                    No data available
                </Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                "#",
                                "Lens Type",
                                "Coating",
                                "Lens Powers",
                                "Price",
                                "Total Reduction",
                                "Available Quantity",
                            ].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        p: 1.5,
                                        fontWeight: "bold",
                                        background: "#3f51b5",
                                        color: "white",
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lenses.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "#f7f7f7",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#e3f2fd",
                                    },
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    #{index + 1}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    {row.lens.type}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    {row.lens.coating}
                                </TableCell>
                                <TableCell sx={{ p: 1 }}>
                                    {row.lens.lens_powers ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap", // Ensure wrapping in case of too many lens powers
                                                gap: 8, // Adjusted spacing for inline view
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {row.lens.lens_powers.map(
                                                (power) => (
                                                    <Box
                                                        key={power.power_id}
                                                        sx={{
                                                            display: "flex",
                                                            gap: 2,
                                                            alignItems:
                                                                "center",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            sx={{
                                                                background:
                                                                    power.power_id ===
                                                                    1
                                                                        ? "#b6dafc"
                                                                        : power.power_id ===
                                                                          2
                                                                        ? "#b6b9fc"
                                                                        : "#cffcb6",
                                                                fontSize:
                                                                    "0.75rem", // Smaller font for better alignment
                                                            }}
                                                            label={
                                                                power.power_id ===
                                                                1
                                                                    ? "Sph"
                                                                    : power.power_id ===
                                                                      2
                                                                    ? "Cyl"
                                                                    : "Add"
                                                            }
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight:
                                                                    "bold",
                                                                fontSize:
                                                                    "0.875rem", // Ensures better alignment with chips
                                                            }}
                                                        >
                                                            {power.value === 0
                                                                ? "Plano"
                                                                : power.value}
                                                        </Typography>
                                                    </Box>
                                                )
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No Lens Powers
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    Rs:{row.lens.price}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    {row.total_reduction}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    {row.current_qty}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default LensDashboardTable;
