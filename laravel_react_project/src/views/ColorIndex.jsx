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
    Grid,
} from "@mui/material";
import { Edit, Delete, Fullscreen } from "@mui/icons-material";

export default function ColorIndex() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
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
    console.log(colors);

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

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Colors
            </Typography>
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
                                <TableCell colSpan={3} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {colors.map((color) => (
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
