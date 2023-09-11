import { CircularProgress } from '@mui/material'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthState = createContext({
    role: null
})
const AuthContext = ({ children }) => {
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(false)
    const getRole =  () => {
        setLoading(true)
        const role =  localStorage.getItem('role')
        setRole(role)
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }
    useEffect(() => {
        getRole()
    }, [role])
    return (
        <AuthState.Provider value={{ role, setRole }}>
            {loading ? (
                <div style={{display:'flex' , alignItems:'center',justifyContent:'center',height:'100vh'}}>

                <CircularProgress />
                </div>
            ) : children}
        </AuthState.Provider>
    )

}
export default AuthContext;

export const useAuthContext = () => useContext(AuthState)