import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { useAlert } from "../contexts/AlertContext";
import { fetchData } from "../hooks/useFetchData";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Typography,
    Autocomplete,
    Skeleton,
} from "@mui/material";

import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditLoading from "../Components/EditLoading";
import useFrame from "../hooks/useFrame";
import useColorList from "../hooks/useColorList";
import useBrandList from "../hooks/useBrandList";
import useCodeList from "../hooks/useCodeList";
import DropdownInput from "../Components/DropdownInput";
import useFrameList from "../hooks/useFrameList";

export default function FrameEdit() {
    const { id } = useParams();

    //Hooks
    const { frameData, loadingFrame } = useFrame(id);
    const { brandDataList, loadingBrandList } = useBrandList();
    const { colorDataList, loadingColorList } = useColorList();
    const { codeDataList, loadingCodeList } = useCodeList();

    //TODO
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { token } = useStateContext();
    const [frame, setFrame] = useState({
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

    const [imagePreview, setImagePreview] = useState(null);

    const [filterCode, setFilterCode] = useState([]);

    const uploadSingleImages = async (ID, image, index) => {
        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `images/${ID}/${index}`);

            // Upload the image file to Firebase Storage
            await uploadBytes(storageRef, image);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            return { success: true, downloadURL: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFrame({ ...frame, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFrame({ ...frame, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();

        formData.append("brand_id", frame.brand_id || "");
        formData.append("code_id", frame.code_id || "");
        formData.append("color_id", frame.color_id || "");
        formData.append("price", frame.price || "");
        formData.append("size", frame.size || "");
        formData.append("species", frame.species || "");
        formData.append("quantity", frame.quantity || "");
        formData.append("branch", frame.branch || "");

        if (frame.code_id) {
            if (frame.image instanceof File) {
                const imageUploard = await uploadSingleImages(
                    frame.code_id,
                    frame.image,
                    frame.code_id
                );

                if (imageUploard && imageUploard.success) {
                    formData.append("image", imageUploard.downloadURL);
                } else {
                    formData.append("image", frame.image);
                }
            } else {
                formData.append("image", frame.image);
            }

            try {
                const getData = await fetchData("/frames", token);
                if (getData.state) {
                    const exists = getData["data"].some(
                        (item) => item.code_id === frame.code_id
                    );
                    if (!exists) {
                        showAlert(
                            "Frame with this code already exists",
                            "error"
                        );
                    } else {
                        //GET INPUT & FRAME TOTAL
                        formData.set("quantity", parseInt(frame.quantity));
                        formData.set("branch", "stock");
                        await axiosClient.post(`/frames/${id}`, formData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        });
                        showAlert("Frame updated successfully", "success");

                        navigate("/frames");
                    }
                }
            } catch (err) {
                if (err.response && err.response.status === 422) {
                    showAlert("Frame update error refresh the page", "error");
                } else {
                    showAlert("Frame update error refresh the page", "error");
                }
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        if (frameData) {
            setFrame({
                ...frame,
                brand_id: frameData.brand_id,
                code_id: frameData.code_id,
                color_id: frameData.color_id,
                price: frameData.price,
                size: frameData.size,
                species: frameData.species,
                quantity: frameData.stocks[0]["qty"],
                branch: frameData.branch,
                image: frameData.image,
            });
        }
    }, [codeDataList, frameData]);
    useEffect(() => {
        if (frameData) {
            setFilterCode(
                codeDataList.filter(
                    (code) => code.brand_id === parseInt(frame.brand_id)
                )
            );
        }
    }, [frame.brand_id]);

    //HADLE DROPDOWN INPUTS
    const handleDropdownBrandChange = (selectedValue) => {
        setFrame({ ...frame, brand_id: selectedValue });
    };
    const handleDropdowColorChange = (selectedValue) => {
        setFrame({ ...frame, color_id: selectedValue });
    };
    const handleDropdownCodeChange = (selectedValue) => {
        setFrame({ ...frame, code_id: selectedValue });
    };
    console.log(frameData);

    return (
        <Card>
            <CardHeader title="Edit Frame" />
            <CardContent>
                {
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Brand Selection */}
                            <Grid item xs={12} md={6}>
                                <DropdownInput
                                    //pass array list [{name: "Brand 1", id: 1}]
                                    options={brandDataList.map((brand) => ({
                                        name: brand.brand_name,
                                        id: brand.id,
                                    }))}
                                    onChange={handleDropdownBrandChange} // Will receive the selected brand's id
                                    loading={loadingBrandList}
                                    labelName="Select Brand"
                                    defaultId={frame.brand_id} // Pass the Defalt value
                                />
                            </Grid>
                            {/* Code Selection */}

                            <Grid item xs={12} md={6}>
                                <DropdownInput
                                    //pass array list [{name: "Brand 1", id: 1}]
                                    options={filterCode.map((code) => ({
                                        name: code.code_name,
                                        id: code.id,
                                    }))}
                                    onChange={handleDropdownCodeChange} // Will receive the selected brand's id
                                    loading={loadingCodeList}
                                    labelName="Select Code"
                                    defaultId={frame.code_id} // Pass the Defalt value
                                />
                            </Grid>

                            {/* Color Selection */}
                            <Grid item xs={12} md={6}>
                                <DropdownInput
                                    options={colorDataList.map((color) => ({
                                        name: color.color_name,
                                        id: color.id,
                                    }))}
                                    onChange={handleDropdowColorChange} // Will receive the selected brand's id
                                    loading={loadingCodeList}
                                    labelName="Select Color"
                                    defaultId={frame.color_id} // Pass the Defalt value
                                />
                            </Grid>
                            {/* Price Input */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    sx={{ marginTop: 0 }}
                                    fullWidth
                                    margin="normal"
                                    id="price"
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={frame.price}
                                    onChange={handleInputChange}
                                    required
                                    InputProps={{
                                        endAdornment: loadingFrame ? (
                                            <CircularProgress size={24} />
                                        ) : null, // Show spinner when loading
                                    }}
                                    disabled={loadingFrame}
                                />
                            </Grid>
                            {/* Frame Shape Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="size-label">
                                        Frame Shape
                                    </InputLabel>
                                    <Select
                                        label="Frame Shape"
                                        labelId="size-label"
                                        id="size"
                                        name="size"
                                        value={frame.size}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loadingFrame}
                                    >
                                        <MenuItem value="Full">Full</MenuItem>
                                        <MenuItem value="Half">Half</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Frame Species Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="species-label">
                                        Frame Species
                                    </InputLabel>
                                    <Select
                                        label="Frame Species"
                                        labelId="species-label"
                                        id="species"
                                        name="species"
                                        value={frame.species}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loadingFrame}
                                    >
                                        <MenuItem value="Plastic">
                                            Plastic
                                        </MenuItem>
                                        <MenuItem value="Metal">Metal</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Image Upload */}
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal">
                                    <label htmlFor="image">
                                        <Typography variant="body1">
                                            Upload Image
                                        </Typography>
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleImageChange}
                                        style={{ marginTop: 10 }}
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            width="100"
                                            style={{ marginTop: 10 }}
                                        />
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}
                                    fullWidth
                                    style={{ marginTop: 16 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                }
            </CardContent>
        </Card>
    );
}
