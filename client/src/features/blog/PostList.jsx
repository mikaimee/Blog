import axios from "axios"
import { useEffect, useState } from "react"

const ALLPOSTS_URL = 'http://localhost:8000/posts'

const PostList = () => {

    const [allPosts, setAllPosts] = useState([])

    useEffect(() => {
        axios.get(ALLPOSTS_URL)
        .then((res) => {
            console.log(res.data)
            setAllPosts(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <section>
            <div>PostList</div>
            {
                allPosts.map((post) => (
                    <div>
                        <h2>{post.title}</h2>
                        <p>{post.createdAt}</p>
                    </div>
                ))
            }
        </section>
    )
}

export default PostList