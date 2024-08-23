import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function ColorIndex() {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token

    useEffect(() => {
        getColors();
    }, []);

    const getColors = () => {
        setLoading(true);
        axiosClient.get('/colors', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setLoading(false);
            setColors(data);
        })
        .catch(() => {
            setLoading(false);
        });
    };

    const handleDelete = (colorId) => {
        if (!window.confirm("Are you sure you want to delete this color?")) {
            return;
        }

        axiosClient.delete(`/colors/${colorId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            getColors(); // Refresh the color list after deletion
        });
    };

    return (
        <div className="card">
            <h2>Colors</h2>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Color Name</th>
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
                            {colors.map((color) => (
                                <tr key={color.id}>
                                    <td>{color.id}</td>
                                    <td>{color.color_name}</td>
                                    <td>
                                        <Link to={`/colors/edit/${color.id}`} className="btn btn-edit">Edit</Link>
                                        &nbsp;
                                        <button onClick={() => handleDelete(color.id)} className="btn btn-delete">Delete</button>
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
