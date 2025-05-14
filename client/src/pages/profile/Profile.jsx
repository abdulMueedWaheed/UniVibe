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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverPic, setCoverPic] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userData, setUserData] = useState({
    full_name: "Loading...",
    location: "Location not set",
    website: "Website not set",
  });

  const profileUserId = userId || currentUser?.id?.toString();

  // Fetch profile user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (profileUserId) {
        try {
          const res = await makeRequest.get(`/users/${profileUserId}`);
          if (res.data && res.data.data) {
            const user = res.data.data;
            setUserData({
              full_name: user.full_name || "User",
              location: user.location || "Location",
              website: user.website || "Website URL",
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
  }, [profileUserId]);

  // Fetch relationship data
  const { data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: async () => {
      const response = await makeRequest.get("/relationships", {
        params: { followerUserId: currentUser.id },
      });
      return response.data;
    },
  });

  // Fetch the user's posts
  const { isLoading, error, data: posts } = useQuery({
    queryKey: ["userPosts", profileUserId],
    queryFn: async () => {
      try {
        const res = await makeRequest.get(`/posts/${profileUserId}`);
        return res.data.data || [];
      } catch (err) {
        console.error("Error fetching posts:", err);
        throw err;
      }
    },
    enabled: !!profileUserId,
  });

  // Optimistic update for follow/unfollow
  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        return await makeRequest.delete("/relationships", {
          params: { userId: profileUserId },
        });
      } else {
        return await makeRequest.post("/relationships", { userId: profileUserId });
      }
    },
    onMutate: async (following) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries(["relationship"]);

      // Snapshot the previous value
      const previousRelationship = queryClient.getQueryData(["relationship", userId]);

      // Optimistically update the relationship data
      queryClient.setQueryData(["relationship", userId], (old) => {
        if (following) {
          // Remove the userId from the array (unfollow)
          return old.filter((id) => id !== Number(profileUserId));
        } else {
          // Add the userId to the array (follow)
          return [...(old || []), Number(profileUserId)];
        }
      });

      // Return the previous state in case of rollback
      return { previousRelationship };
    },
    onError: (err, following, context) => {
      // If the mutation fails, revert to the previous state
      queryClient.setQueryData(["relationship", userId], context.previousRelationship);
      console.error("Error following/unfollowing:", err);
    },
    onSettled: () => {
      // Invalidate the query to refetch the actual data after the mutation
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const isOwnProfile = currentUser?.id && profileUserId === currentUser.id.toString();
  const isFollowing = relationshipData?.includes(Number(profileUserId));

  const handleFollow = () => {
    if (!currentUser) {
      alert("Please log in to follow/unfollow.");
      return;
    }
    mutation.mutate(isFollowing);
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
        const res = await makeRequest.post("/users/update-profile-pic", formData);
        setProfilePic(res.data.profile_pic);
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;

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
              "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"
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
                <InstagramIcon style={{ fontSize: "30px" }} />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon style={{ fontSize: "30px" }} />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon style={{ fontSize: "30px" }} />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon style={{ fontSize: "30px" }} />
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
              {!isOwnProfile && (
                <button onClick={handleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="postsContainer">
        <h3 style={{ color: "white", fontSize: "30px" }}>
          {isOwnProfile ? "Your Posts" : `${userData.full_name}'s Posts`}
        </h3>
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
};

export default Profile;