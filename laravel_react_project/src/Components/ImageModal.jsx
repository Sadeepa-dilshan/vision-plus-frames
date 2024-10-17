import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
    IconButton,
    useMediaQuery,
    useTheme,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";
import useColorList from "../hooks/useColorList";
import DropdownInput from "../Components/DropdownInput";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: 4,
    width: "auto",
};

export default function ImageModal({
    open,
    handleClose,
    imgFullVIew,
    selectedframeIDs,
    modelType,
    colorList,
    handleRefreshTable,
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const { showAlert } = useAlert();
    const { colorDataList, loadingColorList, refreshColorList } =
        useColorList();
    // State to handle frame data

    const [loading, setLoading] = React.useState(false);
    const [colorsAvilable, setColorsAvilable] = React.useState([]);
    const { token } = useStateContext();
    const [frame, setFrame] = React.useState({
        brand_id: "",
        code_id: "",
        color_id: "",
        price: "",
        size: "",
        species: "",
        image: "",
        quantity: 0, // Default initial quantity
        branch: "",
    });
    const [colorId, setColorId] = React.useState("");

    // Update frame with selected frame IDs and form data
    React.useEffect(() => {
        if (selectedframeIDs) {
            setFrame({
                ...frame,
                brand_id: selectedframeIDs.brand_id,
                code_id: selectedframeIDs.code_id,
                color_id: colorId,
                price: selectedframeIDs.price,
                size: selectedframeIDs.size,
                species: selectedframeIDs.species,
                image: selectedframeIDs.image,
            });
        }
    }, [selectedframeIDs, colorId]);
    React.useEffect(() => {
        setColorsAvilable(
            colorDataList.filter((value) => !colorList.includes(value.id))
        );
    }, [colorList]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFrame((prevFrame) => ({ ...prevFrame, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);

            await axiosClient.post("/frames", frame, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            showAlert("New Frame Color added successfully", "success");
            handleRefreshTable();
            setColorId("");
            handleClose(); // Close modal after successful submission
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Handle validation errors
                // setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleBrandListSelectionChange = (selectedValue) => {
        setColorId(selectedValue);
    };
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        color="error"
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                        }}
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>

                    {imgFullVIew ? (
                        <img
                            style={{
                                width: isSmallScreen
                                    ? "300px"
                                    : isMediumScreen
                                    ? "500px"
                                    : "700px",
                            }}
                            src={imgFullVIew}
                            alt="Full View"
                        />
                    ) : (
                        <></>
                    )}
                    {modelType === "add" && (
                        <>
                            <Box
                                sx={{
                                    padding: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: 400,
                                }}
                            >
                                <Typography variant="h5">
                                    Add New Frame
                                </Typography>

                                <DropdownInput
                                    //pass array list [{name: "Brand 1", id: 1}]
                                    options={colorsAvilable.map((color) => ({
                                        name: color.color_name,
                                        id: color.id,
                                    }))}
                                    onChange={handleBrandListSelectionChange} // Will receive the selected brand's id
                                    loading={loadingColorList}
                                    labelName="Select Color"
                                    defaultId={colorId} // Pass the Defalt value
                                />

                                <Button
                                    sx={{ margin: 2 }}
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    variant="contained"
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
