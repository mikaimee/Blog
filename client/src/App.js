import {Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import HomeContent from './components/HomeContent'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import HomeLayout from './components/HomeLayout'
import PostList from './features/blog/PostList'

function App() {
  return (
    <Routes>
      <Route path="/" >
        {/* Public Screens */}
        <Route index element={<HomeContent/>} />
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>} />

        {/* Private Screens */}
        <Route path="users">
          {/* Edit User */}
        </Route>

        <Route path="posts">
          <Route index element ={<PostList/>} />
          {/* Edit Note */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
