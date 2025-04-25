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

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="left">
        <Link to="/" style={{textDecoration: 'none'}}>
          <span className="logo">UniVibe</span>
        </Link>
        <HomeOutlinedIcon sx={{ cursor: 'pointer' }}/> 
        <DarkModeOutlinedIcon sx={{ cursor: 'pointer' }}/>
        <LightModeOutlinedIcon sx={{ cursor: 'pointer' }}/>
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
          <img src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg" alt="Profile Pic" />
          <span>John Doe</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar