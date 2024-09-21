import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    TextField, // Import TextField for search input
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function ColorIndex() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        getColors();
    }, []);

    const getColors = () => {
        setLoading(true);
        axiosClient
            .get("/colors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setColors(data);
                // TODO: Store inside session storage
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleDelete = (colorId) => {
        if (!window.confirm("Are you sure you want to delete this color?")) {
            return;
        }

        axiosClient
            .delete(`/colors/${colorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                getColors(); // Refresh the color list after deletion
            });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter colors based on the search term
    const filteredColors = colors.filter((color) =>
        color.color_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Colors
            </Typography>
            {/* Search input */}
            <TextField
                label="Search Colors"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                onChange={handleSearch}
                value={searchTerm}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>Actions</TableCell>
                            <TableCell>Color Name</TableCell>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {filteredColors.map((color) => (
                                <TableRow key={color.id}>
                                    {/* <TableCell>{color.id}</TableCell> */}
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/colors/edit/${color.id}`}
                                            size="small"
                                            sx={{ marginRight: 1 }}
                                        >
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                handleDelete(color.id)
                                            }
                                            size="small"
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {color.color_name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
        </Paper>
    );
}
