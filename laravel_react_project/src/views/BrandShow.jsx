import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function BrandShow() {
    const { id } = useParams(); // Get the brand ID from the URL
    const [brand, setBrand] = useState(null);
    const { token } = useStateContext(); // Get the auth token

    useEffect(() => {
        axiosClient.get(`/brands/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setBrand(data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [id, token]);

    if (!brand) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card">
            <h2>Brand Details</h2>
            <div className="card-body">
                <p><strong>ID:</strong> {brand.id}</p>
                <p><strong>Brand Name:</strong> {brand.brand_name}</p>
                {/* Add more fields if necessary */}
            </div>
        </div>
    );
}
