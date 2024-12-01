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
} from "@mui/material";

const LensDashboardTable = ({ lenses }) => {
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
                            Lens Powers
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Total Reduction
                        </TableCell>
                        <TableCell
                            sx={{
                                p: 1.5,
                                fontWeight: "bold",
                                background: "gray",
                                color: "white",
                            }}
                        >
                            Avilable Quantity
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lenses.map((row, index) => (
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
                                {console.log(row)}
                                {row.lens.type}
                            </TableCell>
                            <TableCell sx={{ p: 1.5 }}>
                                {row.lens.coating}
                            </TableCell>
                            <TableCell sx={{ p: 1.5 }}>
                                {row.lens.lens_powers
                                    ? row.lens.lens_powers.map((power) => (
                                          <Box
                                              key={power.power_id}
                                              sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  justifyContent:
                                                      "space-between",
                                                  alignItems: "center",
                                              }}
                                          >
                                              <Typography
                                                  sx={{
                                                      textTransform:
                                                          "capitalize",
                                                      m: 0.5,
                                                  }}
                                                  variant="body2"
                                                  fontWeight="bold"
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
                                                      }}
                                                      label={
                                                          power.power_id === 1
                                                              ? "Sph"
                                                              : power.power_id ===
                                                                2
                                                              ? "Cyl"
                                                              : "Add"
                                                      }
                                                  />
                                              </Typography>
                                              <Typography variant="body2">
                                                  {power.value == 0
                                                      ? "Plano"
                                                      : power.value}
                                              </Typography>
                                          </Box>
                                      ))
                                    : "No Lens Powers"}
                            </TableCell>
                            <TableCell sx={{ p: 1.5 }}>
                                {row.total_reduction}
                            </TableCell>
                            <TableCell sx={{ p: 1.5 }}>
                                {row.current_qty}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LensDashboardTable;
