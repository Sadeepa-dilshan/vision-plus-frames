import { useState, useCallback, useEffect } from "react";
import { useAlert } from "../contexts/AlertContext";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";

const useApiData = (endpoint) => {
    const { showAlert } = useAlert();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useStateContext();

    const fetchData = useCallback(() => {
        setLoading(true);
        axiosClient
            .get(`/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setData(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Network Error");
                showAlert(
                    err.response?.data?.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [endpoint, token, showAlert]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh };
};

export default useApiData;
