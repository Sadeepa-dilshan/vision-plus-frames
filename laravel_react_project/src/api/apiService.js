import axiosClient from "../axiosClient";

export const getBrandWithID = async (id, token) => {
    try {
        const response = await axiosClient.get(`/brands/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
export const getBrandList = async (id, token) => {
    try {
        const response = await axiosClient.get(`/brands`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
export const getCodeWithID = async (id, token) => {
    try {
        const response = await axiosClient.get(`/codes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
export const getCodeList = async (id, token) => {
    try {
        const response = await axiosClient.get(`/codes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
