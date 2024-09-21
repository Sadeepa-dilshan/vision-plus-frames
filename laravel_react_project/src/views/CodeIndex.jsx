import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import {
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField, // Import TextField for search input
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";

export default function CodeIndex() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    const { token } = useStateContext(); // To handle the auth token

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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter codes based on the search term
    const filteredCodes = codes.filter(
        (code) =>
            code.code_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.brand.brand_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            accessorKey: "actions",
            header: "Actions",
            size: 200,
            Cell: ({ row }) => (
                <>
                    <IconButton
                        component={Link}
                        to={`/codes/edit/${row.original.id}`}
                        variant="outlined"
                        size="small"
                        sx={{ marginRight: 1 }}
                    >
                        <Edit color="primary" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(row.original.id)}
                        variant="contained"
                        color="error"
                        size="small"
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        },

        {
            accessorKey: "brand.brand_name",
            header: "brand_name",
            size: 150,
        },
        {
            accessorKey: "code_name",
            header: "code_name",
            size: 150,
        },
    ];
    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Codes
            </Typography>

            <MaterialReactTable
                columns={columns}
                data={codes}
                enablePagination
                enableColumnFilters
                enableRowSelection={false}
                enableSorting
                enableToolbarInternalActions
                initialState={{ pagination: { pageSize: 20 } }}
                muiToolbarAlertBannerProps={{
                    color: "primary",
                }}
                muiTableContainerProps={{
                    sx: { maxHeight: "calc(100vh - 210px)" },
                }}
                state={{ isLoading: loading }}
                muiTableProps={{
                    sx: {
                        "& .MuiTableCell-root": {
                            padding: ".5rem", // Reduce padding for smaller density
                        },
                        "& .MuiTableRow-root": {
                            height: ".5rem", // Reduce row height for smaller density
                        },
                    },
                }}
            />
        </Paper>
    );
}
