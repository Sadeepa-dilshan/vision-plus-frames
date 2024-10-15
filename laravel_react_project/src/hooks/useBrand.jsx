import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useBrand = (id) => {
    const { showAlert } = useAlert();

    const [brandData, setBrandData] = useState(null);
    const [loadingBrand, setLoadingBrand] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingBrand(true);
        axiosClient
            .get(`/brands/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setBrandData(data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingBrand(false);
            });
    }, [id, token]);

    return { brandData, loadingBrand };
};

export default useBrand;
