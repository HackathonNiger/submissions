import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
    token: string | null;
    role: string;
    login: (token: string, role:string) => void;
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(null)
    const [role, setRole] = useState<string>("")

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedRole = localStorage.getItem('role')

        if (storedToken) setToken(storedToken)

        if (storedRole) setRole(storedRole)
    }, [])

    const login = (newToken: string, newRole:string) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('role', newRole)

        setToken(newToken)
        setRole(newRole)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        
        setToken(null)
        setRole("")
    }

    return <AuthContext.Provider value={{ role, token, login, logout }}>
        {children}
    </AuthContext.Provider>

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

