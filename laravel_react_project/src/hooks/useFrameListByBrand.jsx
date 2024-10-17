import { useState, useEffect, useCallback } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import { useAlert } from "../contexts/AlertContext";

const useFrameListByBrand = () => {
    const { showAlert } = useAlert();
    const [frameListByBrand, setFrameListByBrand] = useState([]); // Store the final processed data
    const [loadingFrameListByBrand, setLoadingFrameListByBrand] =
        useState(true);
    const { token } = useStateContext(); // To handle the auth token

    const fetchFrameData = useCallback(async () => {
        setLoadingFrameListByBrand(true); // Start loading
        try {
            // Fetch data from API
            const response = await axiosClient.get(`/frames`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Apply data manipulation logic only after receiving the data
            const frameDataList = response.data;
            const outputData = frameDataList.reduce((acc, curr) => {
                const combineIDS = `${curr.brand_id}_${curr.code_id}`;

                if (!acc[combineIDS]) {
                    acc[combineIDS] = {
                        code_name: curr.code.code_name,
                        code_id: curr.code_id,
                        brand_name: curr.brand.brand_name,
                        totalQty: 0,
                        frames: [],
                    };
                }

                acc[combineIDS].totalQty += curr.stocks[0]["qty"];
                acc[combineIDS].frames.push(curr);

                return acc;
            }, {});

            // Map the reduced output into the  final format
            const mappedData = Object.keys(outputData).map((key) => ({
                code_id: outputData[key].code_id,
                code_name: outputData[key].code_name,
                brand_name: outputData[key].brand_name,
                image: outputData[key]["frames"][0].image,
                totalQty: outputData[key].totalQty,
                frames: outputData[key]["frames"],
            }));

            // Set the final processed data to state
            setFrameListByBrand(mappedData);
        } catch (err) {
            showAlert(err.response?.data?.message || "Network Error", "error");
        } finally {
            setLoadingFrameListByBrand(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFrameData(); // Fetch and process data on mount
    }, [fetchFrameData]);

    return {
        frameListByBrand, //  processed data
        loadingFrameListByBrand,
        refreshFrameListByBrand: fetchFrameData, // Expose the refresh function for manual data fetching
    };
};

export default useFrameListByBrand;
