import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import CreatePostModal from "../../components/createPostModal/createPostModal";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";  // Add this import

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();  // Get userId from URL params

  console.log("Raw userId from URL:", userId);
  console.log("Raw currentUser.id:", currentUser?.id);
  
  // Use the URL userId if available, otherwise use currentUser.id (for own profile)
  const profileUserId = userId || currentUser?.id?.toString();

  console.log("Final profileUserId:", profileUserId, "Type:", typeof profileUserId);

  console.log("URL userId:", userId);
  console.log("currentUser.id:", currentUser?.id);
  console.log("profileUserId:", profileUserId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverPic, setCoverPic] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userData, setUserData] = useState({
    full_name: "Loading...",
    location: "Location not set",
    website: "Website not set"
  });
  
  // Fetch profile user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (profileUserId) {
        try {
          console.log("Fetching user data for ID:", profileUserId);
          const res = await makeRequest.get(`/users/${profileUserId}`);
          console.log("User data response:", res.data);
          
          if (res.data && res.data.data) {
            const user = res.data.data;
            setUserData({
              full_name: user.full_name || "User",
              location: user.location || "Location not set",
              website: user.website || "Website not set"
            });
            setCoverPic(user.cover_pic || "");
            setProfilePic(user.profile_pic || "");
          }
        }
        
        catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [profileUserId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCoverPicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", currentUser.id);

      try {
        const res = await makeRequest.post("/users/update-cover-pic", formData);
        setCoverPic(res.data.cover_pic);
      }
      
      catch (error) {
        console.error("Error updating cover picture:", error);
      }
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", currentUser.id);

    try {
      const res = await makeRequest.post(
        "/users/update-profile-pic",
        formData
      );
      // Add this line to update the profile pic state
      setProfilePic(res.data.profile_pic); 
      console.log("Profile pic updated:", res.data.profile_pic);
    }
    
    catch (error) {
      console.error("Error updating profile picture:", error);
    }
  }
  };

  // Fetch the user's posts
  const { isLoading, error, data: posts } = useQuery({
    queryKey: ["userPosts", profileUserId],
    queryFn: async () => {
      try {
        console.log(`Fetching posts for user ID: ${profileUserId}`);
        const res = await makeRequest.get(`/posts/${profileUserId}`);
        console.log("Posts response:", res.data);
        return res.data.data || [];
      } catch (err) {
        console.error("Error fetching posts:", err);
        throw err;
      }
    },
    enabled: !!profileUserId,
  });
  
  // Determine if the profile belongs to the current user
  const isOwnProfile = currentUser?.id && 
    (profileUserId === currentUser.id.toString());

  console.log("Is own profile?", isOwnProfile);

  return (
    <div className="profile">
      <div className="images">
        <label htmlFor="coverPicInput">
          <img
            src={
              coverPic ||
              "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            alt="Cover Pic"
            className="cover"
          />
          {isOwnProfile && (
            <input
              type="file"
              id="coverPicInput"
              style={{ display: "none" }}
              onChange={handleCoverPicChange}
            />
          )}
        </label>

        <label htmlFor="profilePicInput">
          <img
            src={
              profilePic ||
              "https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            }
            alt="Profile"
            className="profilePic"
          />
          {isOwnProfile && (
            <input
              type="file"
              id="profilePicInput"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          )}
        </label>
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <span>{userData.full_name}</span>
          <div className="bottom">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon style={{fontSize:"30px"}}  />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon style={{fontSize:"30px"}} />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon style={{fontSize:"30px"}} />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon style={{fontSize:"30px"}} />
              </a>
            </div>
            <div className="center">
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{userData.location}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{userData.website}</span>
                </div>
              </div>
              {!isOwnProfile && <button>follow</button>}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="postsContainer">
        <h3>{isOwnProfile ? "Your Posts" : `${userData.full_name}'s Posts`}</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading posts</p>
        ) : posts && posts.length > 0 ? (
          <Posts posts={posts} />
        ) : (
          <p>No posts to display</p>
        )}
      </div>

      {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}
    </div>
  );
}

export default Profile;