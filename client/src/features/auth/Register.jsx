import { useRef, useState, useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";

const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL = 'http://localhost:8000/users'

const Register = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [usernameFocus, setUsernameFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [match, setMatch] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    },[])

    useEffect(() => {
        setValidPassword(PASSWORD_VALID.test(password))
        setValidMatch(password === match)
    }, [password, match])

    useEffect(() => {
        setErrorMessage('')
    }, [username, password, match])

    const handleRegister = async (e) => {
        e.preventDefault()
        const invalid = PASSWORD_VALID.test(password)
        if (!invalid) {
            setErrorMessage('Invalid Entry')
            return
        }
        try {
            const res = await axios.post(REGISTER_URL, JSON.stringify({username, password}),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            })
            console.log(res?.data)
            console.log(JSON.stringify(res))
            setSuccess(true)
            setUsername('')
            setPassword('')
            setMatch('')
        }
        catch(err) {
            if(!err?.res) {
                setErrorMessage('No server response')
            }
            else if (err.res?.status === 409) {
                setErrorMessage('Username Taken')
            }
            else {
                setErrorMessage('Failed Registration')
            }
            errRef.current.focus()
        }
    }


    return (
        <>
            {success ? (
                <section>
                    <h1>Successful with Registration</h1>
                    <p>
                        <Link to="/login">Login Here</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef}>{errorMessage}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                        />

                        <label htmlFor="password">Password: </label>
                        <input
                            type="text"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="passwordNote">
                            8 to 24 characters. <br/>
                            Must include uppercase and lowercase letters, a number and a special character. <br/>
                            Allowed special characters: !, @, #, $, %
                        </p>

                        <label htmlFor="match">Confirm Password: </label>
                        <input
                            type="text"
                            id="match"
                            onChange={(e) => setMatch(e.target.value)}
                            value={match}
                            required
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="passwordNote">
                            Must match with password
                        </p>

                        <button disabled={!validPassword || !validMatch ? true: false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br/>
                        <span>
                            <Link to="/login">Login Here</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register