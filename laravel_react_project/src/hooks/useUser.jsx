import { useState, useEffect } from "react";
// Adjust the path as needed
import { useStateContext } from "../contexts/contextprovider";

import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useUser = (id) => {
    const { showAlert } = useAlert();

    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        setLoadingUser(true);
        axiosClient
            .get(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                setUserData(data);
            })
            .catch((err) => {
                showAlert(
                    err.response.data.message || "Network Error",
                    "error"
                );
            })
            .finally(() => {
                setLoadingUser(false);
            });
    }, [id, token]);

    return { userData, loadingUser };
};

export default useUser;
