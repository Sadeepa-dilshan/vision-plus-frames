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
} from "@mui/material";
import ResponsiveDatePicker from "../Components/ResponsiveDatePicker";
import dayjs from "dayjs";
import { Error, Sell } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircleIcon from "@mui/icons-material/Circle";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
export default function Dashboard() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Default to last 30 days
    const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        fetchTopFrames();
    }, [fromDate, toDate]); // Fetch data when date range changes

    // Fetch top 5 frames with most stock reductions based on selected date range
    const fetchTopFrames = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(
                "/top-frames-by-stock-reduction",
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
            setFrames(response.data);
        } catch (error) {
            console.error("Error fetching top frames:", error);
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

            <Typography margin={2} variant="h5" gutterBottom>
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
                        flexDirection: "rows",
                        flexWrap: "wrap",

                        gap: 2,
                        width: "100%",
                    }}
                >
                    {frames.map((frame, index) => (
                        <Card
                            key={frame.frame_id}
                            sx={{
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                },
                                padding: 1,
                                width: isMobile ? "100%" : "300px",
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
                                        <Box
                                            display={"flex"}
                                            sx={{
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}
                                        >
                                            <Typography
                                                color={"primary"}
                                                variant="h5"
                                                noWrap
                                                marginRight={1}
                                            >
                                                #{index + 1}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                fontWeight={"bold"}
                                                noWrap
                                            >
                                                {frame.frame.brand_name ||
                                                    "Unknown Brand"}{" "}
                                                -{" "}
                                                {frame.frame.code_name ||
                                                    "Unknown Code"}
                                            </Typography>
                                        </Box>
                                        {frame.frame.image ? (
                                            <img
                                                src={`${frame.frame.image}`}
                                                alt="Frame"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    marginTop: "10px",
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ marginTop: "10px" }}
                                            >
                                                No Image Available
                                            </Typography>
                                        )}
                                        <Typography variant="body2" noWrap>
                                            Color:
                                            {frame.frame.color_name ||
                                                "Unknown Color"}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        mt: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography variant="body2">
                                        Size -
                                    </Typography>
                                    <Typography variant="body2">
                                        {frame.frame.size == "Half" ? (
                                            <NightlightRoundIcon color="disabled" />
                                        ) : frame.frame.size == "Full" ? (
                                            <CircleIcon color="disabled" />
                                        ) : (
                                            <Error />
                                        )}
                                    </Typography>
                                    <Typography variant="body2">
                                        {frame.frame.size}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        fontWeight={"bold"}
                                        variant="body2"
                                    >
                                        RS {frame.frame.price}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ShoppingCartIcon color="seagreen" />
                                        <Typography
                                            color={"seagreen"}
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {frame.total_reduction}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
