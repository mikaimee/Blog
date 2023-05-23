import { Link } from "react-router-dom";

const NavBar = () => {

    const content = (
        <header>
            <div>
                <Link to="/">
                    <h1>My Blog Space</h1>
                </Link>
                <nav>
                    <Link to="/register">
                        <p>Register</p>
                    </Link>
                    <Link to="/login">
                        <p>Login</p>
                    </Link>
                    {/* add nav buttons here */}
                </nav>
            </div>
        </header>
    )

    return content
}

export default NavBar