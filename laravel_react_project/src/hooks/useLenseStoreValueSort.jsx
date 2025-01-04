import { useState, useEffect, useCallback } from "react";

import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";

export default function useLenseStoreValueSort() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useStateContext();

    // Function to fetch and sort data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/lenses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const sortedData = response.data.map((lens) => {
                // Extract and remap powers
                const powerValues = lens.powers.reduce((acc, power) => {
                    acc[power.name] = power.pivot.value;
                    return acc;
                }, {});

                // Ensure all required power values exist
                return {
                    ...lens,
                    sph: powerValues.sph ? parseFloat(powerValues.sph) : "-",
                    cyl: powerValues.cyl ? parseFloat(powerValues.cyl) : "-",
                    add: powerValues.add ? parseFloat(powerValues.add) : "-",
                };
            });
            console.log(sortedData);

            setData(sortedData);
            setError(null);
        } catch (err) {
            setData([]);
            setError(err.response?.data?.message || "Network Error");
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch data on initial render
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Return data, error, loading state, and refresh function
    return { data, error, loading, refresh: fetchData };
}
