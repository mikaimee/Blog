import {useRef, useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'

const LOGIN_URL = 'http://localhost:8000/auth/login'


const Login = () => {

    const {setAuth} = useContext(AuthContext)

    // const navigate = useNavigate()
    // const location = useLocation()
    // const from = location.state?.from?.pathname || "/"

    const userRef = useRef()
    const errRef = useRef()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMessage('')
    }, [username, password])

    const handleLogin = async (e) => {
        e.preventDefault()

        try{
            const res = await axios.post(LOGIN_URL, JSON.stringify({username, password}),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            })
            console.log(JSON.stringify(res?.data))
            
            const accessToken = res?.data?.accessToken
            const roles = res?.data?.roles
            setAuth({username, password, roles, accessToken})
            // localStorage.setItem('UserInfo', JSON.stringify(res?.data))
            setUsername('')
            setPassword('')
            setSuccess(true)
            // navigate(from, {replace: true})
        }
        catch (err) {
            if (!err?.res) {
                setErrorMessage('No server response')
            }
            else if (err.res?.status === 400) {
                setErrorMessage('Missing username or password input')
            }
            else if (err.res?.status === 401) {
                setErrorMessage('Unauthorized')
            }
            else {
                setErrorMessage('Failed to Login')
            }
            errRef.current.focus()
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Successfully logged in!</h1>
                    <p>
                        <Link to="/">Go back home</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errorMessage ? "errMsg" : "offscreen"} aria-live='assertive'>{errorMessage}</p>
                    <h1>Sign in</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor='username'>
                            Username: 
                        </label>
                        <input
                            type='text'
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />

                        <label htmlFor='password'>Password: </label>
                        <input
                            type='password'
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account? <br/>
                        <Link to="/register">Sign Up</Link>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login