import React, { createContext } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    return (
        <AuthProvider.Provider value={{token, user, login, logout}}>
            {children}
        </AuthProvider.Provider>
    )
}

export default AuthContext