import './navbar.scss'
import { Link, Links } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOulintedIcon from '@mui/icons-material/SearchOutlined';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeRequest } from '../../axios';

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [ profilePic, setProfilePic ] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await makeRequest.get(`/users/${currentUser.id}`);

        if (res.data && res.data.data) {
          const user = res.data.data;
          setProfilePic(user.profile_pic || "");
        }
      }
      catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [])

  return (
    <div className='navbar'>
      <div className="left">
        <span className="logo">UniVibe</span>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <HomeOutlinedIcon sx={{ cursor: 'pointer' }} />
        </Link>

        {(darkMode === false) ? <DarkModeOutlinedIcon onClick={toggle} sx={{ cursor: 'pointer' }} /> : <LightModeOutlinedIcon sx={{ cursor: 'pointer' }} onClick={toggle} />}
        {/* <GridViewOutlinedIcon sx={{ cursor: 'pointer' }} /> */}

        <div className="search">
          <SearchOulintedIcon />
          <input type='text' placeholder='search' />
        </div>
      </div>

      <div className="right">
        {/* <PersonOutlinedIcon sx={{ cursor: 'pointer' }}/> */}
        {/* <EmailOutlinedIcon sx={{ cursor: 'pointer' }}/> */}
        <NotificationsOutlinedIcon sx={{ cursor: 'pointer' }} />
        <div className="user">

          <Link to={`/profile/${currentUser.id}`}>
            <img src={profilePic || null} alt="Profile Pic" style={{border: "2px solid black"}}  />
            <span>{currentUser.full_name}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Navbar