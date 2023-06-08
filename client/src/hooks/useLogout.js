import axios from 'axios'
import useAuth from './useAuth'

const LOGOUT_URL = 'http://localhost:8000/auth/logout'

const useLogout = () => {
    const {setAuth} = useAuth()

    const logout = async () => {
        setAuth({})
        try {
            const response = await axios.post(LOGOUT_URL, {
                withCredentials: true
            })
        } catch (err) {
            console.error(err)
        }
    }
    return logout
}
export default useLogout