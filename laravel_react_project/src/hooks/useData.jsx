import { useState, useCallback, useEffect } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";

const useData = (endpoint) => {
    const [data, setData] = useState([]);
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
                setData([]);
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

export default useData;
