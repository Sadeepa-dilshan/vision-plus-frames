import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, CircularProgress, Box } from "@mui/material";

export default function FrameIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getFrames();
    }, []);

    const getFrames = () => {
        setLoading(true);
        axiosClient
            .get("/frames", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setFrames(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleDelete = (frameId) => {
        if (!window.confirm("Are you sure you want to delete this frame?")) {
            return;
        }

        axiosClient
            .delete(`/frames/${frameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                getFrames(); // Refresh the frame list after deletion
            });
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "image",
            headerName: "Image",
            width: 100,
            renderCell: (params) =>
                params.value ? (
                    <img
                        src={params.value}
                        alt="Frame"
                        style={{ width: 50, height: 50 }}
                    />
                ) : (
                    "No Image"
                ),
        },
        {
            field: "brand",
            headerName: "Brand",
            width: 150,
            valueGetter: (params) => params.brand_name,
        },
        {
            field: "code",
            headerName: "Code",
            width: 150,
            valueGetter: (params) => params.code_name,
        },
        {
            field: "color",
            headerName: "Color",
            width: 150,
            valueGetter: (params) => params.color_name,
        },
        { field: "price", headerName: "Price", width: 100 },
        { field: "size", headerName: "Shape", width: 100 },
        {
            field: "stocks",
            headerName: "Quantity",
            width: 120,
            valueGetter: (params) => params.qty,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                            navigate(`/frames/edit/${params.row.id}`)
                        }
                        style={{ marginRight: 10 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ height: 400, width: "100%" }}>
            <h2>Frames</h2>
            {console.log(frames)}

            {loading ? (
                <CircularProgress />
            ) : (
                <DataGrid
                    rows={frames}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 15]}
                    checkboxSelection
                    disableSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                />
            )}
        </Box>
    );
}
