import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Button,
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function CodeIndex() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getCodes();
    }, []);

    const getCodes = () => {
        setLoading(true);
        axiosClient
            .get("/codes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setCodes(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleDelete = (codeId) => {
        if (!window.confirm("Are you sure you want to delete this code?")) {
            return;
        }

        axiosClient
            .delete(`/codes/${codeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                getCodes(); // Refresh the code list after deletion
            });
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Codes
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>ID</TableCell> */}

                            <TableCell>Actions</TableCell>
                            <TableCell>Code Name</TableCell>
                            <TableCell>Brand Name</TableCell>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {codes.map((code) => (
                                <TableRow key={code.id}>
                                    {/* <TableCell>{code.id}</TableCell> */}

                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/codes/edit/${code.id}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{ marginRight: 1 }}
                                        >
                                            <Edit color="primary" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                handleDelete(code.id)
                                            }
                                            variant="contained"
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {code.code_name}
                                    </TableCell>
                                    <TableCell
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {code.brand.brand_name}
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
