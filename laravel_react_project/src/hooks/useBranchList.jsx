import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useBranchList = () => {
    const { showAlert } = useAlert();
    const [branchDataList, setBranchDataList] = useState([]);
    const [loadingBranchList, setLoadingBranchList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchBranchData = useCallback(async () => {
        setLoadingBranchList(true);
        try {
            const response = await axiosClient.get(`/branches`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBranchDataList(response.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingBranchList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBranchData(); // Fetch data on mount
    }, [fetchBranchData]);

    return {
        branchDataList,
        loadingBranchList,
        refreshBranchList: fetchBranchData,
    }; // Expose refresh function
};

export default useBranchList;
