import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState({})
    console.log("user: ", user)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("UserInfo"))
        setUser(userInfo)
        console.log("userInfo: ", userInfo)
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthState = () => {
    return useContext(AuthContext)
}

export default AuthProvider

// import { createContext, useState } from "react";

// export const authContext = createContext({})

// export function authContextProvider({childred}) {
//     const [userInfo, setUserInfo] = useState({})
//     return (
//         <authContext.Provider value={{userInfo, setUserInfo}}>
//             {children}
//         </authContext.Provider>
//     )
// }