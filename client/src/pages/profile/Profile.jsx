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

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverPic, setCoverPic] = useState(currentUser?.cover_pic || "");
  const [profilePic, setProfilePic] = useState(currentUser?.profile_pic || "");
  const [userData, setUserData] = useState({
    full_name: currentUser?.full_name || "Loading...",
    location: currentUser?.location || "Location not set",
    website: currentUser?.website || "Website not set"
  });

  // Fetch latest user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.id) {
        try {
          const res = await makeRequest.get(`/users/${currentUser.id}`);
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
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser?.id]);

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
      } catch (error) {
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
        setProfilePic(res.data.profile_pic);
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  // Fetch the user's posts
  const { isLoading, error, data: posts } = useQuery({
    queryKey: ["userPosts", currentUser?.id],
    queryFn: async () => {
      try {
        const res = await makeRequest.get(`/posts/${currentUser.id}`);
        return res.data.data;
      } catch (err) {
        console.error("Error fetching posts:", err);
        return [];
      }
    },
    enabled: !!currentUser?.id,
  });

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
          <input
            type="file"
            id="coverPicInput"
            style={{ display: "none" }}
            onChange={handleCoverPicChange}
          />
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
        </label>
        <input
          type="file"
          id="profilePicInput"
          style={{ display: "none" }}
          onChange={handleProfilePicChange}
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{userData.full_name}</span>
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
            <button>follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
            <button onClick={handleOpenModal}>Create Post</button>
          </div>
        </div>
      </div>

      <div className="postsContainer">
        <h3>Your Posts</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading posts</p>
        ) : (
          <Posts posts={posts} />
        )}
      </div>

      {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Profile;