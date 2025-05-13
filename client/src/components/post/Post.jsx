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
import { useState, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import debounce from "lodash/debounce";

const Post = ({ post }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch likes for this post with optimized settings
  const { isLoading, data: likes = [] } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get(`/likes?postId=${post.id}`).then((res) => res.data),
    enabled: !!post.id,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Like/Unlike mutation with optimistic updates
  const likeMutation = useMutation({
    mutationFn: (liked) => {
      if (liked) {
        return makeRequest.delete(`/likes?postId=${post.id}&userId=${currentUser.id}`);
      }
      return makeRequest.post("/likes", { postId: post.id, userId: currentUser.id });
    },
    onMutate: async (liked) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["likes", post.id]);

      // Snapshot the previous value
      const previousLikes = queryClient.getQueryData(["likes", post.id]) || [];

      // Optimistically update to the new value
      queryClient.setQueryData(["likes", post.id], (old) => {
        if (liked) {
          return old.filter((id) => id !== currentUser.id);
        }
        return [...old, currentUser.id];
      });

      // Return a context object with the snapshotted value
      return { previousLikes };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["likes", post.id], context.previousLikes);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries(["likes", post.id]);
    },
  });

  // Debounced like handler to prevent rapid clicks
  const handleLike = useCallback(
    debounce(() => {
      if (!currentUser) return;
      const isLiked = likes.includes(currentUser.id);
      likeMutation.mutate(isLiked);
    }, 300),
    [currentUser, likes, likeMutation]
  );

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(post.id);
    }
  };

  // TEMPORARY
  // const liked = true;

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
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.user_id === currentUser?.id && (
            <button onClick={handleDelete}>delete</button>
          )}
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
            {isLoading ? (
              "loading"
            ) : likes.includes(currentUser?.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            <span>
               {likes.length} Likes
            </span>
          </div>
          <div className="item" onClick={() => setCommentsOpen(!commentsOpen)}>
            <TextsmsOutlinedIcon />
            <span>
               {commentsCount} Comments
            </span>
          </div>
          <div className="item">
            <ShareOutlinedIcon />
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