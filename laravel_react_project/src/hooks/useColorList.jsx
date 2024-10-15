import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useColorList = () => {
    const { showAlert } = useAlert();
    const [colorDataList, setColorDataList] = useState([]);
    const [loadingColorList, setLoadingColorList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchColorData = useCallback(async () => {
        setLoadingColorList(true);
        try {
            const response = await axiosClient.get(`/colors`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setColorDataList(response.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingColorList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchColorData(); // Fetch data on mount
    }, [fetchColorData]);

    return {
        colorDataList,
        loadingColorList,
        refreshColorList: fetchColorData,
    }; // Expose refresh function
};

export default useColorList;
