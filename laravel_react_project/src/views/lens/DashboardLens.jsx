import React, { useEffect, useState } from "react";
import ResponsiveDatePicker from "../../Components/ResponsiveDatePicker";
import dayjs from "dayjs";
import LensDashboardTable from "../../Components/LensDashboardTable";
import { Box, Typography, Paper } from "@mui/material";
import { useStateContext } from "../../contexts/contextprovider";
import axiosClient from "../../axiosClient";

export default function DashboardLens() {
    const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
    const [toDate, setToDate] = useState(dayjs());
    const [lenses, setLenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const fetchTopFrames = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(
                "/top-lenses-by-stock-reduction",
                {
                    params: {
                        start_date: fromDate.format("YYYY-MM-DD"),
                        end_date: toDate.format("YYYY-MM-DD"),
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLenses(response.data);
        } catch (error) {
            console.error("Error fetching top frames:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTopFrames();
    }, [fromDate, toDate]); // Fetch data when date range or sort option changes

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
                    <LensDashboardTable lenses={lenses} />
                </Box>

                {/* <Box sx={{ width: "100%", maxWidth: 600 }}>
                    <Typography
                        align="center"
                        variant="h5"
                        sx={{ mb: 1, fontWeight: "bold" }}
                    >
                        Low Performing Lenses
                    </Typography>
                    <LensDashboardTable />
                </Box> */}
            </Box>
        </Box>
    );
}
