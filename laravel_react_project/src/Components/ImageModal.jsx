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
    Grid,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FramestockAjusmentModel from "./FrameAddByTable";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";

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
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // State to handle stock reduction and selected branch
    const [stock, setStock] = React.useState("");
    const [branch, setBranch] = React.useState("");
    const [colors, setColors] = React.useState("");
    const { token } = useStateContext();
    const [frame, setFrame] = React.useState({
        brand_id: "",
        code_id: "",
        color_id: "",
        price: "",
        size: "",
        species: "",
        image: "",
        quantity: "",
        branch: "",
    });
    const handleSubmic = () => {
        handleClose();
    };
    const hadlesubmit = () => {};
    React.useEffect(() => {
        getColors();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFrame({ ...frame, [name]: value });
    };
    const getColors = () => {
        axiosClient
            .get("/colors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setColors(data);
            });
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
                                }}
                            >
                                <Typography variant="h5">
                                    Add New Color
                                </Typography>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="color-label">
                                        Select Color
                                    </InputLabel>
                                    <Select
                                        sx={{ width: 200 }}
                                        labelId="color-label"
                                        id="color_id"
                                        name="color_id"
                                        label="Select Color"
                                        value={frame.color_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {colors.map((color) => (
                                            <MenuItem
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.color_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    onClick={hadlesubmit}
                                    variant="contained"
                                >
                                    Add Color
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
