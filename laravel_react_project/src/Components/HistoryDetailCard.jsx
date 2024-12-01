import React from "react";
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
import { motion } from "framer-motion";
import { Add, Remove } from "@mui/icons-material";

export default function HistoryDetailCard({
    status,
    change_qty,
    branch_id,
    change_date,
    index,
    branch_name,
}) {
    return (
        <>
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
                            status === "plus"
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
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                backgroundColor:
                                    status === "plus" ? "green" : "red",
                                marginRight: 2,
                            }}
                        >
                            {status === "plus" ? <Add /> : <Remove />}
                        </Avatar>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {status === "plus" ? "Added" : "Removed"}{" "}
                                {change_qty} units
                            </Typography>
                            <Typography
                                textTransform={"capitalize"}
                                variant="body1"
                            >
                                {branch_name ? branch_name : "Stock"}{" "}
                                {branch_id === null ? "Updated" : "Branch"}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                Date:{" "}
                                {new Date(change_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
}
