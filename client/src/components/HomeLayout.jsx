import { Outlet } from "react-router-dom";
import NavBar from './NavBar'

const HomeLayout = () => {
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default HomeLayout