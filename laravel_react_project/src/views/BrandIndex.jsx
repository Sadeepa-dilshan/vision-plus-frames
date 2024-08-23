import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function BrandIndex() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // Get the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = () => {
        setLoading(true);
        axiosClient.get('/brands', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setLoading(false);
            setBrands(data);
        })
        .catch(() => {
            setLoading(false);
        });
    };

    const handleDelete = (brandId) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) {
            return;
        }

        axiosClient.delete(`/brands/${brandId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            getBrands(); // Refresh the brand list after deletion
        });
    };

    return (
        <div className="card">
            <h2>Brands</h2>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Brand Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="3" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.id}</td>
                                    <td>{brand.brand_name}</td>
                                    <td>
                                        <Link to={`/brands/show/${brand.id}`} className="btn btn-edit">View</Link>
                                        &nbsp;
                                        <Link to={`/brands/edit/${brand.id}`} className="btn btn-edit">Edit</Link>
                                        &nbsp;
                                        <button onClick={() => handleDelete(brand.id)} className="btn btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            <Link to="/codes/new" className="btn btn-primary">Create New Code</Link>
        </div>
    );
}
