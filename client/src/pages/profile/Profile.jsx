import React from 'react'
import './profile.scss'

const Profile = () => {
  return (
    <div className='profile'>
      <div className="images">
        <img src="" alt="" className='cover'/>
        <img src="" alt="" className='profilePic'/>
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large"/>
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large"/>
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large"/>
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large"/>
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large"/>
            </a>
          </div>
          <div className="center"></div>
          <div className="right"></div>
        </div>
      </div>
    </div>
  )
}

export default Profile