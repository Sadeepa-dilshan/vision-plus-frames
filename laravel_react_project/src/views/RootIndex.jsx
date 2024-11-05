import { Button, Paper, Typography, useMediaQuery } from "@mui/material";
import React from "react";

export default function RootIndex() {
    const isMobile = useMediaQuery("(max-width: 600px)");
    console.log(isMobile);

    return (
        <div
            style={{
                height: "95vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    width: isMobile ? 300 : 600,
                    flexDirection: "column",
                    gap: 2,
                    px: 4,
                    py: 8,
                }}
                elevation={4}
            >
                <Typography
                    textAlign={"center"}
                    sx={{ fontWeight: "bold" }}
                    variant="h6"
                >
                    Choose Dashboard
                </Typography>
                <Button
                    onClick={() => {
                        window.location.href = "/lens/dashboard";
                    }}
                    sx={{ p: 2 }}
                    fullWidth
                    color="inherit"
                    variant="contained"
                >
                    Lens Dashboard
                </Button>
                <Button
                    onClick={() => {
                        window.location.href = "/dashboard";
                    }}
                    sx={{ p: 2 }}
                    size="large"
                    fullWidth
                    color="inherit"
                    variant="contained"
                >
                    Frame Dashboard
                </Button>
            </Paper>
        </div>
    );
}
