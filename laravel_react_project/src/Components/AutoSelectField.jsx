import PropTypes from "prop-types";
import {
    Box,
    Button,
    Typography,
    TextField,
    Autocomplete,
} from "@mui/material";

const AutoSelectField = ({
    label,
    options,
    selectedValue,
    onChange,
    onAdd,
    onEdit,
    onDelete,
}) => {
    return (
        <div>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {label}
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                mb={2}
                sx={{ flexWrap: "wrap", gap: 2 }}
            >
                <Autocomplete
                    sx={{ flexGrow: 1 }}
                    options={options}
                    value={selectedValue}
                    getOptionLabel={(option) => option.toString()}
                    onChange={(event, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={`Select ${label}`}
                        />
                    )}
                />
                <Box sx={{ ml: 1 }}>
                    <Button variant="contained" color="primary" onClick={onAdd}>
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onEdit}
                        disabled={!selectedValue}
                        sx={{ mx: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onDelete}
                        disabled={!selectedValue}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

// Add PropTypes validation
AutoSelectField.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selectedValue: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default AutoSelectField;
