import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    useMediaQuery,
    useTheme,
    Button
} from "@mui/material";
import ResponsiveDatePicker from "../Components/ResponsiveDatePicker"; 
import dayjs from 'dayjs';

export default function Dashboard() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Default to last 30 days
    const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'day'));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        fetchTopFrames();
    }, [fromDate, toDate]); // Fetch data when date range changes

    // Fetch top 5 frames with most stock reductions based on selected date range
    const fetchTopFrames = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/top-frames-by-stock-reduction', {
                params: {
                    start_date: fromDate.format('YYYY-MM-DD'),
                    end_date: toDate.format('YYYY-MM-DD'),
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFrames(response.data);
        } catch (error) {
            console.error('Error fetching top frames:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 1 }}>
            {/* Date Range Picker */}
            <ResponsiveDatePicker 
                fromDate={fromDate} 
                toDate={toDate} 
                setFromDate={setFromDate} 
                setToDate={setToDate} 
            />

            <Typography variant="h4" gutterBottom>
                Top 5 Frames by Stock Reduction
            </Typography>

            {loading ? (
                <Box>
                    <Skeleton animation="pulse" width={200} height={60} />
                    <Skeleton animation="pulse" width={200} height={60} />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        width: isMobile ? "100%" : "40%",
                    }}
                >
                    {frames.map((frame) => (
                        <Card
                            key={frame.frame_id}
                            sx={{
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                },
                                padding: 1,
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h5" noWrap>
                                        {frame.frame.brand_name || "Unknown Brand"}
                                        </Typography>
                                        <Typography variant="body2" noWrap sx={{ fontWeight: 'bold' }}>
                                            Frame Code: {frame.frame.code_name || "Unknown Code"}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                        Frame Color:{frame.frame.color_name || "Unknown Color"}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Total Reduction: {frame.total_reduction}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="body2">
                                        Frame Price: ${frame.frame.price}
                                    </Typography>
                                    <Typography variant="body2">
                                        Frame Size: {frame.frame.size}
                                    </Typography>
                                </Box>
                                {frame.frame.image ? (
                                        <img
                                            src={`${frame.frame.image}`}
                                            alt="Frame"
                                            style={{ width: '100px', height: 'auto', marginTop: '10px' }} 
                                        />
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: '10px' }}>
                                            No Image Available
                                        </Typography>
                                    )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
