import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { frame } from 'framer-motion';

export default function FrameHistory() {
    const { id } = useParams(); // Get frame ID from the URL
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axiosClient.get(`/frames/${id}/stock-history`);
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            {loading ? (
                <CircularProgress />
            ) : (
                history && (
                    <>
                        <Typography variant="h5">Stock History for Frame : {history.frame.code.code_name}</Typography>
                        <Card sx={{ marginTop: 2 }}>
                            <CardContent>
                                <Typography variant="body1">
                                    Initial Count: {history.initial_count}
                                </Typography>
                                <Typography variant="body1">
                                    Created At: {new Date(history.stock_created_at).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            Stock Changes:
                        </Typography>

                        {history.changes.length > 0 ? (
                            history.changes.map((change, index) => (
                                <Card key={index} sx={{ marginTop: 1 }}>
                                    <CardContent>
                                        <Typography variant="body2">
                                            Change Date: {new Date(change.change_date).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            Quantity Changed: {change.change_qty}
                                        </Typography>
                                        <Typography variant="body2">
                                            Status: {change.status === 'plus' ? 'Added' : 'Removed'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No changes recorded.</Typography>
                        )}
                    </>
                )
            )}
        </Box>
    );
}
