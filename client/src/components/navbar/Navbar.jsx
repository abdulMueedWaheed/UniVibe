import './navbar.scss'
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOulintedIcon from '@mui/icons-material/SearchOutlined';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const {darkMode, toggle} = useContext(DarkModeContext);
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='navbar'>
      <div className="left">
        <Link to="/" style={{textDecoration: 'none'}}>
          <span className="logo">UniVibe</span>
        </Link>

        <HomeOutlinedIcon sx={{ cursor: 'pointer' }}/> 
        {(darkMode === false)? <DarkModeOutlinedIcon onClick={toggle} sx={{ cursor: 'pointer' }} /> :<LightModeOutlinedIcon sx={{ cursor: 'pointer' }} onClick={toggle}/>}
        <GridViewOutlinedIcon sx={{ cursor: 'pointer' }}/>

        <div className="search">
          <SearchOulintedIcon/>
          <input type='text' placeholder='search'/>
        </div>
      </div>
      
      <div className="right">
        <PersonOutlinedIcon sx={{ cursor: 'pointer' }}/>
        <EmailOutlinedIcon sx={{ cursor: 'pointer' }}/>
        <NotificationsOutlinedIcon sx={{ cursor: 'pointer' }}/>
        <div className="user">
          <img src={currentUser.profile_pic} alt="Profile Pic" />
          <span>{currentUser.full_name}</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar