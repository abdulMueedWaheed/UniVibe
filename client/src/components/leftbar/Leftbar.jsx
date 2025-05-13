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
import { Link } from 'react-router-dom';

const Leftbar = () => {

  return (
    <div className='leftbar'>
      <div className="container">
        <div className="menu">
          <div className="explore-btn">
            <Button variant='contained' sx={{ backgroundColor: "#f77a13" }} endIcon={<Explore />}>
              Explore
            </Button>
          </div>
          <hr></hr>
          <div className="item">
            <Link>
              <EmojiPeopleOutlinedIcon />
              <span>Friends</span>
            </Link>
          </div>
          <div className="item">
            <Link to="/societies">
              <Diversity2OutlinedIcon />
              <span>Societies</span>
            </Link>
          </div>
          <div className="item">
            <Link to="/events">
              <EventIcon />
              <span>Events</span>
            </Link>
          </div>
          <hr />
        </div>
        <div className="menu">
          <span>Coming Soon...</span>
          <div className="item">
            <Link>
              <PlayCircleOutlinedIcon />
              <span>Watch</span>
            </Link>
          </div>
          <div className="item">
            <Link>
              <Groups2OutlinedIcon />
              <span>Groups</span>
            </Link>
          </div>
          <div className="item">
            <Link>
              <GamesOutlinedIcon />
              <span>Gaming</span>
            </Link>
          </div>
          <div className="item">
            <Link>
              <InsertPhotoOutlinedIcon />
              <span>Gallery</span>
            </Link>
          </div>
          <div className="item">
            <Link>
              <OndemandVideoOutlinedIcon />
              <span>Videos</span>
            </Link>
          </div>
          <div className="item">
            <Link>
              <ChatBubbleOutlineOutlinedIcon />
              <span>Messages</span>
            </Link>
          </div>
          {/* <hr /> */}
        </div>
      </div>
    </div>
  )
}

export default Leftbar