import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://www.visionplusframes.com/public/api",
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
            }
        } else {
            // Log the error if it doesn't have a `response`
            console.error("Network error or no response:", error);
        }
        throw error;
    }
);

export default axiosClient;
