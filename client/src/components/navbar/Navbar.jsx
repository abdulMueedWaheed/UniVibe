import './navbar.scss'
import { Link, useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { makeRequest } from '../../axios';

// const DEFAULT_AVATAR = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
  }, [currentUser.id]);

  // Handle clicks outside search results to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search users when typing
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const res = await makeRequest.get(`/users/search?q=${searchQuery}`);
        if (res.data && res.data.success) {
          setSearchResults(res.data.data || []);
          setShowResults(true);
        } else {
          setSearchResults([]);
          console.error("search response error: ", res.data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className='navbar'>
      <div className="left">
        <span className="logo">UniVibe</span>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <HomeOutlinedIcon sx={{ cursor: 'pointer' }} />
        </Link>

        {(darkMode === false) ? 
          <DarkModeOutlinedIcon onClick={toggle} sx={{ cursor: 'pointer' }} /> : 
          <LightModeOutlinedIcon sx={{ cursor: 'pointer' }} onClick={toggle} />}

        <div className="search" ref={searchRef}>
          <SearchOutlinedIcon />
          <input 
            type='text' 
            placeholder='Search users...' 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
          />
          {searchQuery && (
            <CloseIcon className="clear-search" onClick={handleClearSearch} />
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div 
                  key={user.id} 
                  className="search-result-item"
                  onClick={() => handleUserClick(user.id)}
                >
                  <img 
                    src={user.profile_pic || "/path/to/default-avatar.jpg"} 
                    alt={user.name} 
                  />
                  <div className="user-info">
                    <span className="name">{user.full_name}</span>
                    <span className="username">@{user.user_name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <NotificationsOutlinedIcon sx={{ cursor: 'pointer' }} />
        <div className="user">
          <Link to={`/profile/${currentUser.id}`}>
            <img 
              src={profilePic || "/path/to/default-avatar.jpg"} 
              alt="Profile Pic" 
              style={{border: "2px solid black"}}  
            />
            <span>{currentUser.full_name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;