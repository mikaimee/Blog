import axios from 'axios'
import useAuth from './useAuth'

const REFRESHTOKEN_URL = 'http://localhost:8000/auth/refresh'

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        const res = await axios.get(REFRESHTOKEN_URL, {
            withCredentials: true
        })
        setAuth(prev => {
            console.log(JSON.stringify(prev))
            console.log(res.data.accessToken)
            return {
                ...prev,
                roles: res.data.roles,
                accessToken: res.data.accessToken
            }
        })
        return res.data.accessToken
    }
    return refresh
}

export default useRefreshToken