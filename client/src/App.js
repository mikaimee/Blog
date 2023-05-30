import {Routes, Route} from 'react-router-dom'
import {authContextProvider} from './context/authContext'
import Layout from './components/Layout'
import HomeContent from './components/HomeContent'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import HomeLayout from './components/HomeLayout'
import PostList from './features/blog/PostList'
import Post from './features/blog/Post'
import Profile from './features/users/Profile'
import CreatePost from './features/blog/CreatePost'

function App() {
  return (
    <Routes>
      <Route path="/" >
        <Route index element={<HomeContent/>} />
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>} />

        <Route path="users">
          {/* Public */}
          {/* Display Logged User Info */}
          {/* <Route path="/" element={<Profile/>} /> */}

          {/* Private */}
          {/* Edit User (Blogger + Admin) */}
          {/* <Route path="/edit" element /> */}
          {/* Display All Users (Admin)*/}
          {/* <Route index element /> */}
        </Route>

        <Route path="posts">
          <Route index element ={<PostList/>} />
          <Route path="" element={<Post/>} />
          <Route path="new" element={<CreatePost/>} />

          {/* Private */}
          {/* Create Post (Blogger + Admin) */}
          {/* <Route path="/new" element /> */}
          {/* Edit Post (Blogger + Admin)*/}
          {/* <Route path="/edit" element /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
