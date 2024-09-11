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

// export const postData = () => {
//     const postData = async (path, data, token) => {
//         try {
//             const response = await axiosClient.post(path, data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             return response.data;
//         } catch (err) {
//             if (err.response && err.response.status === 422) {
//                 return err.response.data.errors;
//             } else {
//                 return err;
//             }
//         }
//     };

//     return { postData };
// };
