import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Modal,
    Button,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Skeleton,
} from "@mui/material";
import ResponsiveDatePicker from "../Components/ResponsiveDatePicker";

const dummyData = [
    {
        id: 1,
        brand_name: "Dolce",
        colors: ["Red", "Blue"],
        frames: { half: 10, full: 20 },
        total_sales: 1500,
    },
    {
        id: 2,
        brand_name: "Guess",
        colors: ["Green", "Yellow"],
        frames: { half: 5, full: 15 },
        total_sales: 1200,
    },
    {
        id: 3,
        brand_name: "Carera",
        colors: ["Black", "White"],
        frames: { half: 8, full: 25 },
        total_sales: 1800,
    },
    {
        id: 4,
        brand_name: "Crown",
        colors: ["Pink", "Purple"],
        frames: { half: 12, full: 30 },
        total_sales: 2000,
    },
];

export default function Dashboard() {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = () => {
        setLoading(true);
        // Use dummyData for now
        setTimeout(() => {
            setLoading(false);
            setBrands(dummyData);
        }, 1000);
    };

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
    };

    const handleCloseModal = () => {
        setSelectedBrand(null);
    };

    return (
        <Box sx={{ padding: 1 }}>
            <ResponsiveDatePicker />
            <Typography variant="h4" gutterBottom>
                Brand List
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
                    {brands.map((brand) => (
                        <Card
                            key={brand.id}
                            sx={{
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                },
                                padding: 1,
                            }}
                            onClick={() => handleBrandClick(brand)}
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
                                            {brand.brand_name}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {brand.colors.join(", ")}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {brand.total_sales}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="body2">
                                        Half Frames: {brand.frames.half}
                                    </Typography>
                                    <Typography variant="body2">
                                        Full Frames: {brand.frames.full}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
