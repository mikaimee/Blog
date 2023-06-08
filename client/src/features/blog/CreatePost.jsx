import axios from 'axios'
import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const CREATEPOST_URL = 'http://localhost:8000/posts'

const CreatePost = () => {

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [body, setBody] = useState('')
    const [pictures, setPictures] = useState('')
    // const {auth} = useContext(AuthProvider)
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const onTitleChanged = e => setTitle(e.target.value)
    const onSummaryChanged = e => setSummary(e.target.value)
    const onBodyChanged = e => setBody(e.target.value)
    const onPicturesChanged = e => setPictures(e.target.value)

    useEffect(() => {
        setErrorMessage('')
    }, [title, summary, body, pictures])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(CREATEPOST_URL, JSON.stringify(
                {
                    // user: auth.username,
                    title,
                    summary,
                    body,
                    pictures
                }, 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            ))
            console.log(JSON.stringify(res?.data))
            setSuccess(true)
            navigate('/posts')
        }
        catch (err) {
            if (!err?.res) {
                setErrorMessage('No server response')
            }
            else if (err.res?.status === 400) {
                setErrorMessage('Missing input')
            }
            else if (err.res?.status === 401) {
                setErrorMessage('Unauthorized')
            }
            setErrorMessage('Failed to Create New Post')
        }
    }

    return (
        <div>
            <p>{errorMessage}</p>
            <h1>New Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text" 
                        id='title'
                        name='title'
                        autoComplete='off'
                        value={title}
                        onChange={onTitleChanged}
                    />
                </div>
                <div>
                    <label htmlFor="summary">Summary:</label>
                    <input 
                        type="text" 
                        id='summary'
                        name='summary'
                        autoComplete='off'
                        value={summary}
                        onChange={onSummaryChanged}
                    />
                </div>
                <div>
                    <label htmlFor="title">Body:</label>
                    <input 
                        type="text" 
                        id='body'
                        name='body'
                        autoComplete='off'
                        value={body}
                        onChange={onBodyChanged}
                    />
                </div>
                <button>Create Post</button>
            </form>
        </div>
    )
}

export default CreatePost