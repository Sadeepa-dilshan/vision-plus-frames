import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useBranch = (id) => {
    const { showAlert } = useAlert();

    const [branchData, setBranchData] = useState(null);
    const [loadingBranch, setLoadingBranch] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingBranch(true);
        axiosClient
            .get(`/branches/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setBranchData(data.data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingBranch(false);
            });
    }, [id, token]);

    return { branchData, loadingBranch };
};

export default useBranch;
