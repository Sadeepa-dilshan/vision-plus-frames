import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useCodeList = () => {
    const { showAlert } = useAlert();
    const [codeDataList, setCodeDataList] = useState([]);
    const [loadingCodeList, setLoadingCodeList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchCodeData = useCallback(async () => {
        setLoadingCodeList(true);
        try {
            const response = await axiosClient.get(`/codes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCodeDataList(response.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingCodeList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCodeData(); // Fetch data on mount
    }, [fetchCodeData]);

    return {
        codeDataList,
        loadingCodeList,
        refreshCodeList: fetchCodeData,
    }; // Expose refresh function
};

export default useCodeList;
