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
    CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

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

export default function FrameAddByTable({ open, handleClose }) {
    //TODO
    const { token } = useStateContext(); // To handle the auth token
    const { showAlert } = useAlert();

    //TODO
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                ss
            </Modal>
        </div>
    );
}
