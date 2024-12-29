import { Button, Paper, Typography, useMediaQuery } from "@mui/material";
import React from "react";

export default function RootIndex() {
    const isMobile = useMediaQuery("(max-width: 600px)");

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url('src/assets/images/bg.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: isMobile ? "20px" : "50px",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
            }}
        >
            <Paper
                sx={{
                    display: "flex",
                    width: isMobile ? "100%" : 600,
                    flexDirection: "column",
                    gap: 3,
                    px: 4,
                    py: 6,
                    backgroundColor: "rgba(0, 0, 0, 0.4)", //  transparency for Paper
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)", // More prominent shadow for depth
                    position: "relative", // Ensures the Paper stays on top of the blurred background
                    backdropFilter: "blur(5px)",
                }}
                elevation={4}
            >
                <Typography
                    textAlign={"center"}
                    sx={{
                        fontWeight: "bold",
                        fontSize: isMobile ? "1.5rem" : "2rem", // Increased font size for hierarchy
                        marginBottom: 3, // Space below title
                    }}
                    variant="h6"
                >
                    Choose Dashboard
                </Typography>
                <div
                    style={{
                        gap: 20,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button
                        onClick={() => {
                            window.location.href = "/lens/dashboard";
                        }}
                        sx={{
                            p: 2,
                            fontSize: isMobile ? "1rem" : "1.2rem", // Slightly bigger text for buttons
                            backgroundColor: "#3f51b5", // Primary color for the first button
                            "&:hover": {
                                backgroundColor: "yellow",
                                color: "black",
                                fontWeight: "bold",
                                transition: "ease-in-out",
                            }, // Darker shade on hover
                            borderRadius: 1,
                        }}
                        fullWidth
                        variant="contained"
                    >
                        Lens Dashboard
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.href = "/dashboard";
                        }}
                        sx={{
                            p: 2,
                            fontSize: isMobile ? "1rem" : "1.2rem", // Consistent button size
                            backgroundColor: "#19191a", // Secondary color for the second button
                            "&:hover": {
                                backgroundColor: "yellow",
                                color: "black",
                                fontWeight: "bold",
                                transition: "ease-in-out",
                            }, // Darker shade on hover
                            borderRadius: 1,
                        }}
                        fullWidth
                        variant="contained"
                    >
                        Frame Dashboard
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
