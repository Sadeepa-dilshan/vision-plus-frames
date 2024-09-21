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
    Tooltip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import ResponsiveDatePicker from "../Components/ResponsiveDatePicker";
import dayjs from "dayjs";
import { Error } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircleIcon from "@mui/icons-material/Circle";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [sortOption, setSortOption] = useState("reduction");

    // Default to last 30 days
    const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        fetchTopFrames();
    }, [fromDate, toDate, sortOption]); // Fetch data when date range or sort option changes
    console.log(frames);

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

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <Box sx={{ marginTop: 3 }}>
            {/* Date Range Picker */}
            <ResponsiveDatePicker
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />

            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortOption} onChange={handleSortChange}>
                        <MenuItem value="reduction">Stock Reduction</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="brand">Brand</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Typography margin={2} variant="h5" gutterBottom>
                Top 5 Frames by{" "}
                {sortOption === "reduction"
                    ? "Stock Reduction"
                    : sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
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
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    {frames.map((frame, index) => (
                        <motion.div
                            key={frame.frame_id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    padding: 2,
                                    width: isMobile ? "100%" : "300px",
                                    boxShadow: 3,
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
                                                    justifyContent:
                                                        "space-evenly",
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
                                                Color:{" "}
                                                {frame.frame.color_name ||
                                                    "Unknown Color"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            mt: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            <Tooltip title="Frame Price">
                                                <Typography variant="body2">
                                                    Rs {frame.frame.price}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip
                                                title={
                                                    frame.frame.size === "Half"
                                                        ? "Half Frame"
                                                        : frame.frame.size ===
                                                          "Full"
                                                        ? "Full Frame"
                                                        : "Unknown Size"
                                                }
                                            >
                                                <Typography variant="body2">
                                                    {frame.frame.size ===
                                                    "Half" ? (
                                                        <NightlightRoundIcon color="disabled" />
                                                    ) : frame.frame.size ===
                                                      "Full" ? (
                                                        <CircleIcon color="disabled" />
                                                    ) : (
                                                        <Error />
                                                    )}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant="body2">
                                                {frame.frame.size}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2">
                                        Frame Species: {frame.frame.species}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 1,
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
                                            <ShoppingCartIcon
                                                sx={{
                                                    color: "seagreen",
                                                    marginRight: 0.5,
                                                }}
                                            />
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
                        </motion.div>
                    ))}
                </Box>
            )}
        </Box>
    );
}
