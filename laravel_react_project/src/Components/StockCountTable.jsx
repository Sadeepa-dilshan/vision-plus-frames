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
    CircularProgress,
} from "@mui/material";

const StockCountTable = ({ brandWiseStock, loading }) => {
    return (
        <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                p: 2,
                marginTop: 2,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                maxWidth: "sm",
                maxHeight: 400, // Set the maximum height
                overflowY: "auto", // Enable vertical scrolling
            }}
        >
            <Typography variant="h6" p={1}>
                Avilable Total Stock Count
            </Typography>
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
            ) : brandWiseStock?.length === 0 ? (
                <Typography
                    variant="body1"
                    textAlign="center"
                    color="text.secondary"
                >
                    No data available
                </Typography>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {["Brand Name", "Total Stock"].map((header) => (
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
                        {brandWiseStock?.map((brand, index) => (
                            <TableRow
                                key={brand.brand_id}
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
                                    {brand.brand_name}
                                </TableCell>
                                <TableCell sx={{ p: 1, textAlign: "left" }}>
                                    {brand.total_stock}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default StockCountTable;
