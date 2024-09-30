import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
    console.log(selectedframeIDs);

    // State to handle stock reduction and selected branch
    const [stock, setStock] = React.useState("");
    const [branch, setBranch] = React.useState("");
    const handleSubmic = () => {
        console.log("Stock reduced:", stock);
        console.log("Selected branch:", branch);
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
                        <form
                            onSubmit={handleSubmic}
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            {/* Add TextField for reducing stock */}
                            <TextField
                                label="Reduce Stock Amount"
                                type="number"
                                fullWidth
                                required
                                margin="normal"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                sx={{ marginTop: 3, width: 300 }}
                            />

                            {/* Add Select for selecting branch */}
                            <FormControl
                                fullWidth
                                margin="normal"
                                sx={{ marginTop: 2, width: 300 }}
                                required
                            >
                                <InputLabel>Select Branch</InputLabel>
                                <Select
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    label="Select Branch"
                                >
                                    <MenuItem value="Mathugama">
                                        Mathugama
                                    </MenuItem>
                                    <MenuItem value="Aluthgama">
                                        Aluthgama
                                    </MenuItem>
                                    <MenuItem value="Colombo">Colombo</MenuItem>
                                </Select>
                            </FormControl>

                            {/* You can add a button to submit or confirm actions */}
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                sx={{ marginTop: 2, display: "block" }}
                            >
                                Tranfer Stock
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
