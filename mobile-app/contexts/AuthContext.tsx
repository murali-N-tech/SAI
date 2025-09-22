import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/api';

interface AuthContextType {
    user: User | null;
    login: (email, password) => Promise<any>;
    register: (userData) => Promise<any>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                try {
                    const decodedUser: User = jwtDecode(token);
                    setUser(decodedUser);
                } catch (error) {
                    await AsyncStorage.removeItem('accessToken');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken } = response.data.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        const decodedUser: User = jwtDecode(accessToken);
        setUser(decodedUser);
        return response.data;
    };

    const register = async (userData) => {
        return api.post('/auth/register', userData);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};