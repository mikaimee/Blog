import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
// import { UserContext } from "../context/UserContext";
import AuthContext from "../context/AuthProvider";
import axios from "axios";

const USER_URL = 'http://localhost:8000/users'
const LOGOUT_URL = "http://localhost:8000/auth/logout"

const NavBar = () => {

    const {setAuth, auth} = useContext(AuthContext)
    const navigate = useNavigate();

    const logout = async () => {
        setAuth({})
        console.log(auth)
        console.log("You have logged out")
        navigate('/')
    }

    const content = (
        <header>
            <div>
                <Link to="/">
                    <h1>My Blog Space</h1>
                </Link>
                <nav>
                    <Link to="/posts/new">Write</Link>
                    <button onClick={logout}>Logout</button>
                    <Link to="/register"> Register </Link>
                    <Link to="/login"> Login </Link>
                </nav>
            </div>
        </header>
    )

    return content
}

export default NavBar