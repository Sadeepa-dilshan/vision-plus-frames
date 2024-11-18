import { useState, useCallback, useEffect } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";

const useDataById = (endpoint) => {
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
                setData(null);
                setError(err.response?.data?.message || "Network Error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [endpoint, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh };
};

export default useDataById;
