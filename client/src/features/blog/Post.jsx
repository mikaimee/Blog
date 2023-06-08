import axios from 'axios'
import { useContext } from 'react'
import { useLocation, Link} from 'react-router-dom'
import { AuthProvider } from '../../context/AuthProvider'
import { useEffect, useState } from 'react'

const GETSINGLEPOST_URL = 'http://localhost:8000/posts/'

const Post = () => {
    const location = useLocation()
    const path = location.pathname.split('/')[2]
    const [post, setPost] = useState({})
    const {auth} = useContext(AuthProvider)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [updateMode, setUpdateMode] = useState(false)

    useEffect(() => {
        const getSinglePost = async () => {
            const res = await axios.get(GETSINGLEPOST_URL + path)
            setPost(res.data)
            setTitle(res.data.title)
            setBody(res.data.body)
        }
        getSinglePost()
    }, [path])

    const handleDelete = async () => {
        const DELETEPOST_URL = `http://localhost:8000/posts/${post._id}`
        try {
            await axios.delete(DELETEPOST_URL, {
                data: {username: auth.username}
            })
            window.location.replace('/')
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleUpdate = async () => {
        const UPDATEPOST_URL = `http://localhost:8000/posts/${post._id}`
        try{
            axios.patch(UPDATEPOST_URL, {
                username: auth.username,
                title,
                body
            })
            setUpdateMode(false)
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <div>
                {updateMode ? (
                    <input
                        type="text"
                        value={title}
                        className=''
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                    />
                ) : (
                    <h1>
                        {title}
                        {post.username === auth?.username && (
                            <div>
                                <i
                                    className='edit'
                                    onClick={() => setUpdateMode(true)}
                                />
                                <i
                                    onClick={handleDelete}
                                />
                            </div>
                        )}
                    </h1>
                )}
                <div>
                    <span>Author: 
                        <Link to={`/?user=${post.username}`}>
                            <b>{post.username}</b>
                        </Link>
                    </span>
                    <span>
                        {new Date(post.createdAt).toDateString()}
                    </span>
                </div>
                {updateMode ? (
                    <textarea
                        className=''
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                ) : (
                    <p>{body}</p>
                )}
                {updateMode && (
                    <button onClick={handleUpdate}>
                        Update
                    </button>
                )}
            </div>
        </div>
    )
}

export default Post