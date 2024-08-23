import React, { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

// Create a Context for the AlertBar
const AlertContext = createContext();

// Create a Provider component
export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showAlert = (message, severity) => {
        setAlertState({
            open: true,
            message,
            severity,
        });
    };

    // Function to close the alert
    const closeAlert = () => {
        setAlertState({
            open: false,
        });
    };
    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={closeAlert}
                    severity={alertState.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

// Custom hook to use the AlertContext
export const useAlert = () => {
    return useContext(AlertContext);
};
