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
import { red } from "@mui/material/colors";

const Post = ({ post }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  
  // TEMPORARY
  const liked = true;

  // Debug: Log the post object to see its structure
  console.log("Post data:", post);

  // Get user information from the joined data
  const user = post.users || {};
  
  // Set default profile image if none exists
  const profileImage = user.profile_pic || "https://via.placeholder.com/40";
  
  // Set user name with fallback
  const userName = user.full_name || "User";
  
  // Format date (assuming created_at is ISO format)
  const formattedDate = post.created_at 
    ? new Date(post.created_at).toLocaleString() 
    : "1 min ago";

  // Get comments count from post data
  const commentsCount = post.comments_count || 0;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="user-info">
            <img src={profileImage} alt="" />
            <div className="user-details">
              <Link to={`/profile/${post.user_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="user-name">{userName}</span>
              </Link>
              <span className="time">{formattedDate}</span>
            </div>
          </div>
          <MoreVertOutlinedIcon />
        </div>

        <div className="content">
          <p>{post.content}</p>
          {post.image_url && (
            <div className="media-container">
              <img 
                src={post.image_url} 
                alt="Post image" 
                onError={(e) => {
                  console.error("Image failed to load:", {
                    url: post.image_url,
                    error: e.target.error,
                    status: e.target.naturalWidth === 0 ? "Failed to load" : "Loaded but invalid"
                  });
                  e.target.onerror = null; 
                  e.target.src = {profileImage} ;
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", post.image_url);
                }}
              />
            </div>
          )}
          {post.video_url && (
            <div className="media-container">
              <video 
                controls 
                width="100%" 
                onError={() => {
                  console.error("Video failed to load:", post.video_url);
                }}
              >
                <source src={post.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="interaction">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon style={{color: red}} /> : <FavoriteBorderOutlinedIcon />}
            <span>
               Likes
            </span>
          </div>
          <div className="item" onClick={() => setCommentsOpen(!commentsOpen)}>
            <ChatBubbleOutlineOutlinedIcon />
            <span>
               {commentsCount} Comments
            </span>
          </div>
          <div className="item">
            <ShareIcon />
            <span>
              Share
            </span>
          </div>
        </div>
        {commentsOpen && <Comments postsID={post.id} />}
      </div>
    </div>
  );
};

export default Post;