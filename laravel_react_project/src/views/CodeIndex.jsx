import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function CodeIndex() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getCodes();
    }, []);

    const getCodes = () => {
        setLoading(true);
        axiosClient.get('/codes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setLoading(false);
            setCodes(data);
        })
        .catch(() => {
            setLoading(false);
        });
    };

    const handleDelete = (codeId) => {
        if (!window.confirm("Are you sure you want to delete this code?")) {
            return;
        }

        axiosClient.delete(`/codes/${codeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            getCodes(); // Refresh the code list after deletion
        });
    };

    return (
        <div className="card">
            <h2>Codes</h2>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code Name</th>
                            <th>Brand Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="4" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {codes.map((code) => (
                                <tr key={code.id}>
                                    <td>{code.id}</td>
                                    <td>{code.code_name}</td>
                                    <td>{code.brand.brand_name}</td>
                                    <td>
                                        <Link to={`/codes/edit/${code.id}`} className="btn btn-edit">Edit</Link>
                                        &nbsp;
                                        <button onClick={() => handleDelete(code.id)} className="btn btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
