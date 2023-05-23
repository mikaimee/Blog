import {Link} from 'react-router-dom'
import NavBar from './NavBar'
import PostList from '../features/blog/PostList'

const HomeContent = () => {

    const content = (
        <section>
            <header>
                HomePage
                <NavBar />
            </header>
            <main>
                <PostList />
            </main>
            <footer>

            </footer>
        </section>
    )

    return content
}

export default HomeContent