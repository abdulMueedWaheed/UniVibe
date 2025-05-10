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
          <div className="item">
          <Link>
            <EmojiPeopleOutlinedIcon />
            <span>Friends</span>
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
            <Diversity2OutlinedIcon />
            <span>Societies</span>
          </Link>
          </div>
          <div className="item">
          <Link>
            <PlayCircleOutlinedIcon />
            <span>Watch</span>
          </Link>
          </div>
          <hr />
        </div>
        <div className="menu">
          <span>Shortcuts</span>
          <div className="item">
            <Link to="/events">
              <EventIcon />
              <span>Events</span>
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
          <hr />
        </div>
        <div className="menu">
          <span>Others</span>
          <div className="item">
          <Link>
            <QuestionMarkOutlinedIcon />
            <span>Fundraiser</span>
          </Link>
          </div>
          <div className="item">
          <Link>
            <QuestionMarkOutlinedIcon />
            <span>Tutorials</span>
          </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Leftbar