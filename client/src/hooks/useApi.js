import { useState, useCallback } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (apiCall) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall();
            toast.success(response.data.message || 'Success!');
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            toast.error(errorMessage);
            return null; // Or throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
};