import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

// API通信の関数 (Contextファイル内にまとめてもOK)
const registerUser = async (userData) => {
    const response = await axios.post('/register', userData);
    return response.data;
};

const loginUser = async (credentials) => {
    const response = await axios.post('/login', credentials);
    return response.data;
};

const logoutUser = async () => {
    await axios.post('/logout');
};

const getUser = async () => {
    const response = await axios.get('/user');
    return response.data;
};


// 1. Contextの作成
const AuthContext = createContext();

// 2. Context Providerの作成
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // アプリケーション起動時にトークンがあれば、ユーザー情報を取得しにいく
        const verifyUser = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await getUser();
                    if (response.status === 'success') {
                        setUser(response.data);
                    }
                } catch (error) {
                    console.error("Token is invalid, logging out.", error);
                    setToken(null);
                    localStorage.removeItem('authToken');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setIsLoading(false);
        };
        verifyUser();
    }, [token]);

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        if (response.status === 'success') {
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            setUser(response.data.user);
        }
        return response;
    };

    const register = async (userData) => {
        const response = await registerUser(userData);
        if (response.status === 'success') {
            setToken(response.data.token);
            localStorage.setItem('authToken', response.data.token);
            setUser(response.data.user);
        }
        return response;
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. カスタムフックの作成・エクスポート
export const useAuth = () => useContext(AuthContext);