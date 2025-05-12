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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal visibility
  const [coverPic, setCoverPic] = useState(currentUser.cover_pic || ""); // State for cover image
  const [profilePic, setProfilePic] = useState(currentUser.profile_pic || ""); // State for profile image

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleCoverPicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", currentUser.id);

      try {
        const res = await makeRequest.post("/users/update-cover-pic", formData);
        setCoverPic(res.data.cover_pic); // Update the coverPic state
      } catch (error) {
        console.error("Error updating cover picture:", error);
      }
    }
  };

  // Handle profile image upload
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
        setProfilePic(res.data.profile_pic); // Update the profilePic state
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  // Fetch the user's posts
  const {
    isLoading,
    error,
    data: posts,
  } = useQuery({
    queryKey: ["userPosts", currentUser.id], // Unique query key for user's posts
    queryFn: async () => {
      try {
        console.log(currentUser.id);
        const res = await makeRequest.get(`/posts/${currentUser.id}`);
        console.log("API Response:", res.data.data); // Debug: Log the API response
        console.log("obj", res.data.data[0]);

        // Check if the response contains the expected data structure
        if (res.data && Array.isArray(res.data.data)) {
          return res.data.data;
        } else {
          console.warn(
            "API response does not contain expected data structure:",
            res.data
          );
          return []; // Return empty array if structure is not as expected
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        return []; // Return empty array on error
      }
    },
    enabled: !!currentUser?.id, // Only run the query if currentUser.id is defined
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
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>Jane Doe</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>USA</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>lama.dev</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
            <button onClick={handleOpenModal}>Create Post</button>{" "}
            {/* Button to open modal */}
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

      {/* Modal for creating posts */}
      {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Profile;
