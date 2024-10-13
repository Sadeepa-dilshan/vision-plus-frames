import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useBrandList = () => {
    const { showAlert } = useAlert();
    const [brandDataList, setBrandDataList] = useState([]);
    const [loadingBrandList, setLoadingBrandList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchBrandData = useCallback(async () => {
        setLoadingBrandList(true);
        try {
            const response = await axiosClient.get(`/brands`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBrandDataList(response.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingBrandList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBrandData(); // Fetch data on mount
    }, [fetchBrandData]);

    return {
        brandDataList,
        loadingBrandList,
        refreshBrandList: fetchBrandData,
    }; // Expose refresh function
};

export default useBrandList;
