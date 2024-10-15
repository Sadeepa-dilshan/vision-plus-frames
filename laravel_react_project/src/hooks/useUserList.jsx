import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useUserList = () => {
    const { showAlert } = useAlert();
    const [userDataList, setUserDataList] = useState([]);
    const [loadingUserList, setLoadingUserList] = useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchUserData = useCallback(async () => {
        setLoadingUserList(true);
        try {
            const response = await axiosClient.get(`/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserDataList(response.data.data);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingUserList(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUserData(); // Fetch data on mount
    }, [fetchUserData]);

    return {
        userDataList,
        loadingUserList,
        refreshUserList: fetchUserData,
    }; // Expose refresh function
};

export default useUserList;
