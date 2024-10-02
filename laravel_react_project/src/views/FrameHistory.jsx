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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
export default function FrameHistory() {
    const { id } = useParams(); // Get frame ID from the URL
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    //DATE FILTER

    useEffect(() => {
        fetchHistory();
    }, []);
    console.log(history);

    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(
                `/frames/${id}/stock-history`
            );
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
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
                            <Typography
                                variant="h4"
                                color="primary"
                                gutterBottom
                            >
                                Stock History for Frame:{" "}
                                {history.frame.code.code_name}
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
                            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                {history.changes
                                    .slice()
                                    .reverse()
                                    .map((change, index) => (
                                        <Grid item xs={12} md={6} key={index}>
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
                                                            <Typography variant="body1">
                                                                {change.branch ||
                                                                    "None"}{" "}
                                                                Branch
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                Date:{" "}
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
