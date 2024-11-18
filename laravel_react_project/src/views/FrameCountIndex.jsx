import React, { useState } from "react";
import useFrameListByBrand from "../hooks/useFrameListByBrand";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // For lazy loading effects
import {
    Paper,
    Typography,
    Box,
    Button,
    IconButton,
    TextField,
    Pagination,
} from "@mui/material";
import {
    Add,
    ArrowDownward,
    ArrowUpward,
    History,
    RemoveTwoTone,
} from "@mui/icons-material";
import ImageModal from "../Components/ImageModal";
import FrameStockManageModel from "../Components/FrameStockManageModel";
import { useNavigate } from "react-router-dom";

const FrameCountIndex = () => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data using the custom hook
    const {
        frameListByBrand,
        loadingFrameListByBrand,
        refreshFrameListByBrand,
    } = useFrameListByBrand();

    const handleRowExpand = (codeId) => {
        setExpandedRow(expandedRow === codeId ? null : codeId);
    };

    const [filter, setFilter] = useState("");

    const [imgFullView, setImgFullView] = useState("");
    const [open, setOpen] = useState(false);
    const [frameQtyManage, setFrameQtyManage] = useState("add");
    const [modelType, setModelType] = useState("");
    const [colorList, setColorList] = useState([]);
    const [selectedframeIDs, setSelectedframeIDs] = useState(false);
    const [openStockManageModel, setOpenStockManageModel] = useState(false);
    const [handleRefresh, setHandleRefresh] = useState(false);

    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const CloseStockManage = () => {
        setOpenStockManageModel(false);
    };

    const handleClose = () => {
        setOpen(false);
        setImgFullView("");
        setModelType("");
    };

    const handleRefreshTable = () => {
        setHandleRefresh(!handleRefresh);
    };

    if (loadingFrameListByBrand) {
        return <div>Loading brands...</div>;
    }

    // Pagination logic
    const rowsPerPage = 10; // Set the number of rows per page
    const filteredFrameList = frameListByBrand.filter(
        (brandItem) =>
            brandItem.brand_name.toLowerCase().includes(filter.toLowerCase()) ||
            brandItem.code_name.toLowerCase().includes(filter.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastRow = currentPage * rowsPerPage; // Last index of current page
    const indexOfFirstRow = indexOfLastRow - rowsPerPage; // First index of current page
    const currentFrameList = filteredFrameList.slice(
        indexOfFirstRow,
        indexOfLastRow
    ); // Get current rows for the page

    return (
        <div style={{ padding: "20px" }}>
            <TextField
                label="Filter by Brand Name or Code Name"
                variant="outlined"
                fullWidth
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: ".5em",
                }}
            >
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Image</th>
                        <th>Brand Name</th>
                        <th>Code Name</th>
                        <th>Total Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFrameList?.map((brandItem) => (
                        <React.Fragment key={brandItem.code_id}>
                            <tr
                                style={{
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor:
                                        expandedRow === brandItem.code_id
                                            ? "#ffde21" // Background color when expanded
                                            : "#fff", // Default background color
                                }}
                            >
                                <td>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        size="small"
                                        onClick={() => {
                                            setSelectedframeIDs(
                                                brandItem["frames"][0]
                                            );
                                            setOpen(true);
                                            setModelType("add");
                                            setColorList(
                                                brandItem["frames"].map(
                                                    (item) => item.color_id
                                                )
                                            );
                                        }}
                                    >
                                        <Add />
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleRowExpand(brandItem.code_id)
                                        }
                                        style={{
                                            background:
                                                expandedRow ===
                                                brandItem.code_id
                                                    ? "#d9534f"
                                                    : "#5cb85c",
                                            color: "white",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        {expandedRow === brandItem.code_id ? (
                                            <ArrowUpward />
                                        ) : (
                                            <ArrowDownward />
                                        )}
                                    </IconButton>
                                </td>
                                <td>
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            mb: {
                                                xs: 2,
                                                sm: 0,
                                            },
                                            mr: { sm: 2 },
                                        }}
                                        onClick={() => {
                                            handleOpen();
                                            setImgFullView(
                                                brandItem.frames[0]["image"]
                                            );
                                        }}
                                    >
                                        <LazyLoadImage
                                            alt="Frame"
                                            effect="blur"
                                            src={brandItem.frames[0]["image"]}
                                            width="60px"
                                            height="auto"
                                            style={{
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </Box>
                                </td>
                                <td>{brandItem.brand_name}</td>
                                <td>{brandItem.code_name}</td>
                                <td>{brandItem.totalQty}</td>
                            </tr>
                            {expandedRow === brandItem.code_id && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        style={{
                                            backgroundColor: "#f0f0f0", // Expanded row background color
                                            padding: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "grid",
                                                gap: ".5em",
                                            }}
                                        >
                                            {brandItem.frames.map((frame) => (
                                                <Paper
                                                    key={frame.id}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: {
                                                            xs: "column",
                                                            sm: "row",
                                                        },
                                                        borderRadius: 2,
                                                        boxShadow: 3,
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #e0e0e0",
                                                        padding: "1em",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            flexDirection: {
                                                                xs: "column",
                                                                sm: "row",
                                                            },
                                                            justifyContent: {
                                                                sm: "space-between",
                                                            },
                                                            alignItems: {
                                                                sm: "center",
                                                            },
                                                        }}
                                                    >
                                                        {/* Action Buttons */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "0.5em",
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                onClick={() => {
                                                                    setOpenStockManageModel(
                                                                        true
                                                                    );
                                                                    setFrameQtyManage(
                                                                        "add"
                                                                    );
                                                                    setSelectedframeIDs(
                                                                        frame
                                                                    );
                                                                }}
                                                            >
                                                                <Add />
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => {
                                                                    setOpenStockManageModel(
                                                                        true
                                                                    );
                                                                    setFrameQtyManage(
                                                                        "remove"
                                                                    );
                                                                    setSelectedframeIDs(
                                                                        frame
                                                                    );
                                                                    console.log(
                                                                        frame
                                                                    );
                                                                }}
                                                            >
                                                                <RemoveTwoTone />
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="warning"
                                                                size="small"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/frames/history/${frame.id}`
                                                                    )
                                                                }
                                                            >
                                                                <History />
                                                            </Button>
                                                        </div>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            sx={{
                                                                mx: 1,
                                                                mb: {
                                                                    xs: 1,
                                                                    sm: 0,
                                                                },
                                                            }}
                                                        >
                                                            <strong>
                                                                Color:
                                                            </strong>{" "}
                                                            {
                                                                frame.color
                                                                    .color_name
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            sx={{
                                                                mx: 1,
                                                                mb: {
                                                                    xs: 1,
                                                                    sm: 0,
                                                                },
                                                            }}
                                                        >
                                                            <strong>
                                                                Size:
                                                            </strong>{" "}
                                                            {frame.size}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            sx={{
                                                                mx: 1,
                                                                mb: {
                                                                    xs: 1,
                                                                    sm: 0,
                                                                },
                                                            }}
                                                        >
                                                            <strong>
                                                                Species:
                                                            </strong>{" "}
                                                            {frame.species}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            sx={{
                                                                mx: 1,
                                                                mb: {
                                                                    xs: 1,
                                                                    sm: 0,
                                                                },
                                                            }}
                                                        >
                                                            <strong>
                                                                Price:
                                                            </strong>{" "}
                                                            {frame.price}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            sx={{
                                                                mx: 1,
                                                                mb: {
                                                                    xs: 1,
                                                                    sm: 0,
                                                                },
                                                            }}
                                                        >
                                                            <strong>
                                                                Quantity:
                                                            </strong>{" "}
                                                            {frame.stocks[0]
                                                                ?.qty || 0}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredFrameList.length / rowsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                variant="outlined"
                shape="rounded"
                style={{ marginTop: "20px" }} // Add some margin to the pagination
                showFirstButton
                showLastButton
            />

            {/* Image Modal */}
            <ImageModal
                open={open}
                imgFullVIew={imgFullView}
                handleClose={handleClose}
                selectedframeIDs={selectedframeIDs}
                modelType={modelType}
                colorList={colorList}
                handleRefreshTable={handleRefreshTable}
                refresh={refreshFrameListByBrand}
            />

            {/* Stock Manage Model */}
            <FrameStockManageModel
                open={openStockManageModel}
                handleClose={CloseStockManage}
                frameQtyManage={frameQtyManage}
                handleRefreshTable={handleRefreshTable}
                selectedframeIDs={selectedframeIDs}
                refresh={refreshFrameListByBrand}
            />
        </div>
    );
};

export default FrameCountIndex;
