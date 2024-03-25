import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    name: null,
    token: null,
    Notification: null,
    email: null,
    role: null,
    user_ID: null,
    permission: null,
    setName: () => {},
    setToken: () => {},
    setNotification: () => {},
    setEmail: () => {},
    setRole: () => {},
    setUser_ID: () => {},
    setPermission: () => {}

})

export const ContextProvider = ({children}) => {
    const [name, setName] = useState({})
    const [notification, _setNotification] = useState('')
    const [useremail, setUserEmail] = useState('')
    const [role, _setRole] = useState(localStorage.getItem('USER_ROLE'))
    const [user_ID, _setUser_ID] = useState(localStorage.getItem('USER_ID'))
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))
    const [permission, _setPermission] = useState(localStorage.getItem('PERMISSION'))

    const setNotification = (message) => {
        _setNotification(message)
        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }

    const setPermission = (permission) => {
        _setPermission(permission)
        if (permission) {
            localStorage.setItem('PERMISSION', permission)
        } else {
            localStorage.removeItem('PERMISSION')
        } 
    }

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        } 
    }

    const setRole = (role) => {
        _setRole(role)
        if (role) {
            localStorage.setItem('USER_ROLE', role)
        } else {
            localStorage.removeItem('USER_ROLE')
        } 
    }

    const setUser_ID = (user_ID) => {
        _setUser_ID(user_ID)
        if (user_ID) {
            localStorage.setItem('USER_ID', user_ID)
        } else {
            localStorage.removeItem('USER_ID')
        } 
    }

    return (
        <StateContext.Provider value={{
            name,
            setName,
            token,
            setToken,
            notification,
            setNotification,
            useremail,
            setUserEmail,
            role,
            setRole,
            user_ID,
            setUser_ID,
            permission,
            setPermission
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)