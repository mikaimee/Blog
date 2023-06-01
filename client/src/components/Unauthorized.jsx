import { useNavigate } from "react-router-dom";

const Unauthorized = () => {

    const navigate = useNavigate()
    const backHome = () => navigate(-1)

    return (
        <section>
            <h1>Unauthorized</h1>
            <p>You do not have access for the requested page</p>
            <div>
                <button onClick={backHome}>Go back</button>
            </div>
        </section>
    )
}

export default Unauthorized