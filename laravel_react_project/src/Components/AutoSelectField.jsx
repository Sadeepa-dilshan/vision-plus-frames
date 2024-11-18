import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import DropdownInput from "./DropdownInput";
const AutoSelectField = ({
    label,
    options,
    loading,
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
                <DropdownInput
                    testid="color-input"
                    options={options.map((data) => ({
                        name: data.name,
                        id: data.id,
                    }))}
                    onChange={(e) => onChange(e)}
                    loading={loading}
                    labelName="Select Code"
                    defaultId={selectedValue} // Pass the Defalt value
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
    loading: PropTypes.bool.isRequired,
};

export default AutoSelectField;
