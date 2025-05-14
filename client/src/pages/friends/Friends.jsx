import "./friends.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const Friends = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Current user:", currentUser);

  // Step 1: Get followed user IDs
  const { data: followedUserIds, isLoading, error: idsError } = useQuery({
    queryKey: ["followedUsers"],
    queryFn: async () => {
      const res = await makeRequest.get("/relationships", {
        params: { followerUserId: currentUser.id }
      });
      console.log("Response from /relationships:", res.data);
      return res.data;
    },
    enabled: !!currentUser?.id
  });

  useEffect(() => {
    console.log("followedUserIds:", followedUserIds);
    if (idsError) {
      console.error("Error fetching followed user IDs:", idsError);
    }
  }, [followedUserIds, idsError]);

  // Step 2: Fetch user details for each followed user
  useEffect(() => {
    const fetchFriends = async () => {
      if (followedUserIds && followedUserIds.length > 0) {
        setLoading(true);
        try {
          const userDetails = await Promise.all(
            followedUserIds.map(async (id) => {
              try {
                const res = await makeRequest.get(`/users/${id}`);
                console.log(`User details for id ${id}:`, res.data.data);
                return res.data.data; // Adjust if your API response structure is different
              } catch (err) {
                console.error(`Error fetching user with id ${id}:`, err);
                return null;
              }
            })
          );
          setFriends(userDetails.filter(Boolean));
        } catch (err) {
          console.error("Error in Promise.all for user details:", err);
          setFriends([]);
        }
        setLoading(false);
      } else {
        setFriends([]);
        setLoading(false);
      }
    };
    fetchFriends();
  }, [followedUserIds]);

  useEffect(() => {
    console.log("Final friends array:", friends);
  }, [friends]);

  const uniqueFriends = Array.from(new Map(friends.map(f => [f.id, f])).values());

  if (isLoading || loading) {
    return (
      <div className="friends">
        <div className="container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="friends">
      <div className="container">
        <h2>Your Friends</h2>
        <div className="friends-grid">
          {uniqueFriends.length > 0 ? (
            uniqueFriends.map((user) => (
              <Link to={`/profile/${user.id}`} key={user.id} className="friend-card">
                <div className="friend-info">
                  <img src={user.profile_pic} alt="" />
                  <span>{user.full_name}</span>
                </div>
                <button className="view-profile">View Profile</button>
              </Link>
            ))
          ) : (
            <div className="no-friends">
              <h3>You haven't followed anyone yet</h3>
              <p>Start following people to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends; 