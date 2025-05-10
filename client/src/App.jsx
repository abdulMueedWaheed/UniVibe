import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import './App.scss'
import Navbar from './components/navbar/Navbar'
import Leftbar from './components/leftbar/Leftbar'
import Rightbar from './components/rightbar/Rightbar'

import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import Events from "./pages/events/Events"
import { useContext } from 'react'
import { DarkModeContext } from './context/DarkModeContext'
import { AuthContext } from "./context/AuthContext"

function App() {

  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const HomeLayout = () => {
    return (
      <div className={`${darkMode ? 'dark' : 'light'}-theme`}>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Leftbar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <Rightbar />
        </div>
      </div>
    );
  }

  // EVENTS LAYOUT  
  const EventsLayout = () => {
    return (
      <div className={`${darkMode ? 'dark' : 'light'}-theme`}>
        <Navbar />
        <Events />
      </div>
    )
  }

  // CHECK IF LOGGED IN, AND ONLY ALLOW RENDER WHEN LOGGED IN
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/login' />
    }

    return children;
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Route>
        <Route path='/events' element={<ProtectedRoute><EventsLayout /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
