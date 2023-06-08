import { useState, useEffect } from "react"
import axios from "axios"

const ALLUSER_URL = 'http://localhost:8000/users'

const AllUsers = () => {

    const [users, setUsers] = useState()

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getUsers = async () => {
            try{
                const res = await axios.get(ALLUSER_URL, {
                    signal: controller.signal
                })
                console.log(res.data)
                isMounted && setUsers(res.data)
            }
            catch (err) {
                console.error(err)
            }
        }

        getUsers()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    return (
        <article>
            <h2>User List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to be displayed</p>
            }
        </article>
    )
}

export default AllUsers