import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useColor = (id) => {
    const { showAlert } = useAlert();

    const [colorData, setColorData] = useState(null);
    const [loadingColor, setLoadingColor] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingColor(true);
        axiosClient
            .get(`/colors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setColorData(data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingColor(false);
            });
    }, [id, token]);

    return { colorData, loadingColor };
};

export default useColor;
