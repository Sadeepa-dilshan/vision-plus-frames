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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FramestockAjusmentModel from "./FramestockAjusmentModel";

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
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // State to handle stock reduction and selected branch
    const [stock, setStock] = React.useState("");
    const [branch, setBranch] = React.useState("");
    const handleSubmic = () => {
        handleClose();
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
                        <FramestockAjusmentModel
                            selectedframeIDs={selectedframeIDs}
                        />
                    )}
                </Box>
            </Modal>
        </div>
    );
}
