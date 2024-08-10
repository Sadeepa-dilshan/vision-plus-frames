import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function FrameIndex() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useStateContext(); // To handle the auth token
    const navigate = useNavigate();

    useEffect(() => {
        getFrames();
    }, []);

    const getFrames = () => {
        setLoading(true);
        axiosClient.get('/frames', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(({ data }) => {
            setLoading(false);
            setFrames(data);
        })
        .catch(() => {
            setLoading(false);
        });
    };

    const handleDelete = (frameId) => {
        if (!window.confirm("Are you sure you want to delete this frame?")) {
            return;
        }

        axiosClient.delete(`/frames/${frameId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            getFrames(); // Refresh the frame list after deletion
        });
    };
    const getTotalQuantity = (stocks) => {
        if (!stocks || stocks.length === 0) return 'No Stock';
        return stocks.reduce((total, stock) => total + stock.qty, 0);
    };


    return (
        <div className="card">
            <h2>Frames</h2>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Brand</th>
                            <th>Code</th>
                            <th>Color</th>
                            <th>Price</th>
                            <th>Shape</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="9" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {frames.map((frame) => (
                                <tr key={frame.id}>
                                    <td>{frame.id}</td>
                                    <td>
                                        {frame.image ? (
                                                <img src={`images/frames/${frame.image}`} width="50" height="50" />
                                            ) : (
                                                "No Image"
                                        )}
                                    </td>
                                    <td>{frame.brand.brand_name}</td>
                                    <td>{frame.code.code_name}</td>
                                    <td>{frame.color.color_name}</td>
                                    <td>{frame.price}</td>
                                    <td>{frame.size}</td>
                                    <td>{getTotalQuantity(frame.stocks)}</td> {/* Summing stock quantities */}
                                    <td>
                                        <Link to={`/frames/edit/${frame.id}`} className="btn btn-edit">Edit</Link>
                                        &nbsp;
                                        <button onClick={() => handleDelete(frame.id)} className="btn btn-delete">Delete</button>
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
