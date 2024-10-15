import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useFrameList = () => {
    const { showAlert } = useAlert();
    const [frameDataList, setFrameDataList] = useState([]);
    const [loadingFrameList, setLoadingFrameList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchFrameData = useCallback(async () => {
        setLoadingFrameList(true);
        try {
            const response = await axiosClient.get(`/frames`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFrameDataList(response.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingFrameList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFrameData(); // Fetch data on mount
    }, [fetchFrameData]);

    return {
        frameDataList,
        loadingFrameList,
        refreshFrameList: fetchFrameData,
    }; // Expose refresh function
};

export default useFrameList;
