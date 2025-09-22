import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { AxiosResponse } from 'axios';

type ApiCall = () => Promise<AxiosResponse<any>>;

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async <T>(apiCall: ApiCall): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall();
            Toast.show({
                type: 'success',
                text1: response.data.message || 'Success!',
            });
            return response.data.data as T;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
};