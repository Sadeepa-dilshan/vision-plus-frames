import React, { useState } from "react";
import ResponsiveDatePicker from "../../Components/ResponsiveDatePicker";
import dayjs from "dayjs";
import LensDashboardTable from "../../Components/LensDashboardTable";
import { Box, Typography, Paper } from "@mui/material";

export default function DashboardLens() {
    const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
    const [toDate, setToDate] = useState(dayjs());

    return (
        <Box sx={{ padding: 3 }}>
            {/* Date Range Picker */}
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <ResponsiveDatePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />
            </Paper>

            {/* Tables Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                    flexWrap: "wrap",
                    padding: 2,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 600 }}>
                    <Typography
                        align="center"
                        variant="h5"
                        sx={{ mb: 1, fontWeight: "bold" }}
                    >
                        Top Performing Lenses
                    </Typography>
                    <LensDashboardTable />
                </Box>

                <Box sx={{ width: "100%", maxWidth: 600 }}>
                    <Typography
                        align="center"
                        variant="h5"
                        sx={{ mb: 1, fontWeight: "bold" }}
                    >
                        Low Performing Lenses
                    </Typography>
                    <LensDashboardTable />
                </Box>
            </Box>
        </Box>
    );
}
