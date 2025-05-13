import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  // Fetch users from the database to use as stories
  const { isLoading, error, data: users } = useQuery({
    queryKey: ["storyUsers"],
    queryFn: async () => {
      try {
        // Fetch a list of users (limit to 6 for stories)
        const res = await makeRequest.get("/users?limit=6");
        console.log("Story users response:", res.data);
        return res.data.data || [];
      } catch (err) {
        console.error("Error fetching users for stories:", err);
        return [];
      }
    }
  });

  return (
    <div className='stories'>
      <div className="story">
        <img src={currentUser.profile_pic || "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"} />
        <button id="add-story-btn">+</button>
      </div>
      
      {isLoading ? (
        // Show placeholder stories while loading
        Array(3).fill(0).map((_, i) => (
          <div className="story" key={`loading-${i}`}>
            <div className="skeleton-image"></div>
          </div>
        ))
      ) : error ? (
        <div>Error loading stories</div>
      ) : users && users.length > 0 ? (
        // Map through actual users from database
        users.filter(user => user.id !== currentUser.id).map(user => (
          <div className="story" key={user.id}>
            <Link to={`/profile/${user.id}`}>
              <img 
                src={user.profile_pic || "https://i.pinimg.com/736x/64/e8/00/64e80093aa9e4e2bc3ff5aba88bc22f4.jpg"} 
                alt={user.full_name} 
              />
              <span>{user.full_name}</span>
            </Link>
          </div>
        ))
      ) : (
        <div>No stories to display</div>
      )}
    </div>
  );
};

export default Stories;