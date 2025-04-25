import {Routes, Route, Outlet, Navigate} from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Leftbar from './components/leftbar/Leftbar'
import Rightbar from './components/rightbar/Rightbar'

import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'

function App() {
  
  const currentUser = true;

  const Layout = () => {


    return (
    <>
      <Navbar/>
      <div style={{display: 'flex'}}>
        <Leftbar/>
        <div style={{flex:6}}>
          <Outlet/>
        </div>
        <Rightbar/>
      </div>
    </>
    );
  }

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to='/login'/>
    }

    return children;
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Home/>}/>
          <Route path='/profile/:id' element={<Profile/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
