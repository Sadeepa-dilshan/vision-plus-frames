import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Divider,
    Avatar,
    Paper,
    Chip,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { color, motion } from "framer-motion";
import useColor from "../hooks/useColor";
import { useStateContext } from "../contexts/contextprovider";
import useBranch from "../hooks/useBranch";
import { useAlert } from "../contexts/AlertContext";
export default function FrameHistory() {
    const { id } = useParams(); // Get frame ID from the URL
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const [colorData, setColorData] = useState(null);
    const [loadingColor, setLoadingColor] = useState(true);
    const [brandData, setBrandData] = useState(null);
    const [loadingBrand, setLoadingBrand] = useState(true);
    const { showAlert } = useAlert();
    //DATE FILTER

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(
                `/frames/${id}/stock-history`
            );
            setHistory(response.data);
            axiosClient
                .get(`/colors/${response.data.frame.color_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data }) => {
                    setColorData(data);
                })
                .catch((err) => {
                    throw err;
                });

            axiosClient
                .get(`/brands/${response.data.frame.brand_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data }) => {
                    setBrandData(data);
                })
                .catch((err) => {
                    throw err;
                });
        } catch (error) {
            console.error("Failed to fetch history:", error);
            showAlert("An unexpected error occurred. Please try again.", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                history && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={3}
                            sx={{ padding: 3, marginBottom: 4 }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Typography
                                    marginRight={1}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Stock History{" "}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Chip
                                        color="primary"
                                        sx={{
                                            textTransform: "capitalize",
                                            fontWeight: "bold",
                                        }}
                                        label={
                                            brandData
                                                ? brandData.brand_name
                                                : "loading.."
                                        }
                                    />

                                    <Chip
                                        color="primary"
                                        sx={{
                                            textTransform: "capitalize",
                                            fontWeight: "bold",
                                        }}
                                        label={history.frame.code.code_name}
                                    />
                                    <Chip
                                        color="primary"
                                        sx={{
                                            textTransform: "capitalize",
                                            fontWeight: "bold",
                                        }}
                                        label={
                                            colorData
                                                ? colorData.color_name
                                                : "loading.."
                                        }
                                    />
                                </Box>
                            </Box>
                            <Typography
                                variant="subtitle1"
                                color="textSecondary"
                                fontWeight={"bold"}
                            >
                                Total Stock: {history.initial_count}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Created At:{" "}
                                {new Date(
                                    history.stock_created_at
                                ).toLocaleString()}
                            </Typography>
                        </Paper>

                        <Typography variant="h5" gutterBottom>
                            Stock Changes
                        </Typography>

                        <Divider />

                        {history.changes.length > 0 ? (
                            <Grid container spacing={2}>
                                {history.changes
                                    .slice()
                                    .reverse()
                                    .map((change, index) => (
                                        <Grid item xs={12} key={index}>
                                            <motion.div
                                                initial={{
                                                    scale: 0.9,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <Card
                                                    sx={{
                                                        backgroundColor:
                                                            change.status ===
                                                            "plus"
                                                                ? "rgba(76, 175, 80, 0.1)"
                                                                : "rgba(244, 67, 54, 0.1)",
                                                        borderRadius: 2,
                                                        boxShadow: 3,
                                                        padding: 2,
                                                    }}
                                                >
                                                    <CardContent
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor:
                                                                    change.status ===
                                                                    "plus"
                                                                        ? "green"
                                                                        : "red",
                                                                marginRight: 2,
                                                            }}
                                                        >
                                                            {change.status ===
                                                            "plus" ? (
                                                                <Add />
                                                            ) : (
                                                                <Remove />
                                                            )}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {change.status ===
                                                                "plus"
                                                                    ? "Added"
                                                                    : "Removed"}{" "}
                                                                {
                                                                    change.change_qty
                                                                }{" "}
                                                                units
                                                            </Typography>
                                                            <Typography
                                                                textTransform={
                                                                    "capitalize"
                                                                }
                                                                variant="body1"
                                                            >
                                                                {change.branch ||
                                                                    "None"}{" "}
                                                                {change.branch ===
                                                                "stock"
                                                                    ? "Updated"
                                                                    : "Branch"}
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                Date:
                                                                {new Date(
                                                                    change.change_date
                                                                ).toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    ))}
                            </Grid>
                        ) : (
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                sx={{ marginTop: 2 }}
                            >
                                No changes recorded.
                            </Typography>
                        )}
                    </motion.div>
                )
            )}
        </Box>
    );
}
