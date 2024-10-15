import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useFrame = (id) => {
    const { showAlert } = useAlert();

    const [frameData, setFrameData] = useState(null);
    const [loadingFrame, setLoadingFrame] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingFrame(true);
        axiosClient
            .get(`/frames/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setFrameData(data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingFrame(false);
            });
    }, [id, token]);

    return { frameData, loadingFrame };
};

export default useFrame;
