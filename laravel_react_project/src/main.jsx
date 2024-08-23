import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import { ContextProvider } from "./contexts/contextprovider.jsx";
import "./index.css";
import router from "./router.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AlertProvider>
            <ContextProvider>
                <RouterProvider router={router} />
            </ContextProvider>
        </AlertProvider>
    </React.StrictMode>
);
