import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useCode = (id) => {
    const { showAlert } = useAlert();

    const [codeData, setCodeData] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingCode(true);
        axiosClient
            .get(`/codes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setCodeData(data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingCode(false);
            });
    }, [id, token]);

    return { codeData, loadingCode };
};

export default useCode;
