import "./post.scss"
import { Link } from "react-router-dom";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import Comments from "../comments/Comments";
import { useState } from "react";

const Post = ({ post }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);

  // TEMPORARY
  const liked = true;

  return (
    <div className="post">
      <div className="container">

        <div className="user">
          <div className="user-info">
            <img src={post.profilePic} alt="" />
            <div className="user-details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="user-name">{post.name}</span>
              </Link>
              <span className="time">1 min ago</span>
            </div>
          </div>
          <MoreVertOutlinedIcon />
        </div>

        <div className="content">
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
        </div>

        <div className="interaction">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            <span>
              12 Likes
            </span>
          </div>
          <div className="item" onClick={() => setCommentsOpen(!commentsOpen)}>
            <ChatBubbleOutlineOutlinedIcon />
            <span>
              12 Comments
            </span>
          </div>
          <div className="item">
            <ShareIcon />
            <span>
              Share
            </span>
          </div>
        </div>
        {commentsOpen && <Comments />}
      </div>
    </div>
  )
}

export default Post