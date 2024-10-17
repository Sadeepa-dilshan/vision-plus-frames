/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

const AutocompleteInputFiled = ({
    options,
    onChange,
    loading,
    labelName,
    defaultId,
}) => {
    const [selectedOption, setSelectedOption] = useState(null);

    // Set the default option based on the passed id
    useEffect(() => {
        if (defaultId) {
            const defaultOption = options.find(
                (option) => option.id === defaultId
            );
            setSelectedOption(defaultOption || null);
        } else {
            setSelectedOption(null);
        }
    }, [defaultId, options]);

    const handleChange = (event, newValue) => {
        setSelectedOption(newValue);
        onChange(newValue ? newValue.id : null); // Pass only the selected option's id to parent
    };

    return (
        <Autocomplete
            fullWidth
            disabled={loading}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            loading={loading}
            getOptionLabel={(option) => option.name || ""} // Show the name in the dropdown
            isOptionEqualToValue={(option, value) => option.id === value?.id} // Compare by id
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={labelName}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AutocompleteInputFiled;
