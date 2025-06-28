import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getApiURL } from '../lib/route';
import { usePathname, useRootNavigationState, useRouter } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
    user: any; // Replace `any` with your actual user type
    loading: boolean;
    error: string | null;
    login: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContextProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    // useEffect(() => {
    //     setLoading(true);
    //     const validateToken = async () => {
    //         try {
    //             const response = await axios.get(`${getApiURL()}/auth/validate`, { withCredentials: true });
    //             if (response.status === 200) {
    //                 setUser(response.data);
    //             }
    //             setLoading(false);
    //         } catch (err) {
    //             setUser(null);
    //             setLoading(false);
    //         }
    //     };
    //     validateToken();
    // }, []);

    // Function to handle login
    const login = async (userData: any) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${getApiURL()}/auth/login`, userData);
            const data = res.data;
            await AsyncStorage.setItem('token', data.token);
            console.log("Login response:", data);
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setError("Login failed");
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${getApiURL()}/auth/logout`, {}, { withCredentials: true });
            setUser(null);
            setError(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                setError
            }}
        >
            {loading ? (
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 8 }}>Loading…</Text>
                </View>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthContextProvider");
    }
    return context;
}