import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Delete, Edit, Remove } from "@mui/icons-material";
export default function BrandIndex() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = () => {
        setLoading(true);
        axiosClient
            .get("/brands", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setBrands(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleDelete = (brandId) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) {
            return;
        }

        axiosClient
            .delete(`/brands/${brandId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                getBrands(); // Refresh the brand list after deletion
            });
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Brands
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>Actions</TableCell>

                            <TableCell>Brand Name</TableCell>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {brands.map((brand) => (
                                <TableRow key={brand.id}>
                                    {/* <TableCell>{brand.id}</TableCell> */}
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/brands/show/${brand.id}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ marginRight: 1 }}
                                        >
                                            <FullscreenIcon />
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/brands/edit/${brand.id}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ marginRight: 1 }}
                                        >
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                handleDelete(brand.id)
                                            }
                                            variant="contained"
                                            color="error"
                                            size="small"
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {brand.brand_name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                <Button
                    component={Link}
                    to="/codes/new"
                    variant="contained"
                    color="primary"
                >
                    Create New Code
                </Button>
            </Grid>
        </Paper>
    );
}
