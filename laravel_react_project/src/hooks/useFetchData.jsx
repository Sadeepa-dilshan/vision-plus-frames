import axiosClient from "../axiosClient";

export const fetchData = async (url, token) => {
    try {
        const response = await axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { state: true, data: response.data };
    } catch (err) {
        return {
            state: false,
            message: err.response ? err.response.data : err.message,
        };
    }
};
