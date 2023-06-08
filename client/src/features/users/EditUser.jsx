import axios from 'axios'
import { useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'


const EditUser = () => {

    const {id} = useParams()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [desc, setDesc] = useState('')

    const [errors, setErrors] = useState([])

    return (
        <div>EditUser</div>
    )
}

export default EditUser