import './leftbar.scss'
import Button from '@mui/material/Button';
import Explore from '@mui/icons-material/ExploreOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import EventIcon from '@mui/icons-material/Event';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import GamesOutlinedIcon from '@mui/icons-material/GamesOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import { AuthContext } from '../../context/AuthContext';

const Leftbar = () => {

  return (
    <div className='leftbar'>
      <div className="container">
        <div className="menu">
        <div className="explore-btn">
            <Button variant='contained' sx={{backgroundColor:"#f77a13"}} endIcon={<Explore/>}>
              Explore
            </Button>
          </div>
          <div className="item">
            <EmojiPeopleOutlinedIcon/>
            <span>Friends</span>
          </div>
          <div className="item">
            <Groups2OutlinedIcon/>
            <span>Groups</span>
          </div>
          <div className="item">
            <Diversity2OutlinedIcon/>
            <span>Societies</span>
          </div>
          <div className="item">
            <PlayCircleOutlinedIcon/>
            <span>Watch</span>
          </div>
          <hr />
        </div>
        <div className="menu">
          <span>Shortcuts</span>
          <div className="item">
            <EventIcon/>
            <span>Events</span>
          </div>
          <div className="item">
            <GamesOutlinedIcon/>
            <span>Gaming</span>
          </div>
          <div className="item">
            <InsertPhotoOutlinedIcon/>
            <span>Gallery</span>
          </div>
          <div className="item">
            <OndemandVideoOutlinedIcon/>
            <span>Videos</span>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon/>
            <span>Messages</span>
          </div>
          <hr />
        </div>
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <QuestionMarkOutlinedIcon/>
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <QuestionMarkOutlinedIcon/>
            <span>Tutorials</span>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Leftbar