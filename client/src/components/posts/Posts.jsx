import React from "react";
import Post from "../post/Post";

const Posts = React.memo(({posts}) => {
  console.log("Posts received:", posts);
  
  // Check if posts is undefined or null
  if (!posts) {
    return <div className="no-posts">No posts available</div>;
  }

  // Check if posts is an object with a data property (direct API response)
  if (posts.data && Array.isArray(posts.data)) {
    // If posts is the entire API response object
    return (
      <div className="posts">
        {posts.data.map((post) => (
          <div className="post" key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }
  
  // Check if posts is an array (already extracted data)
  if (Array.isArray(posts)) {
    // If posts is already the array of post objects
    if (posts.length === 0) {
      return <div className="no-posts">No posts available</div>;
    }
    
    return (
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    );
  }
  
  // If posts is neither an object with data nor an array
  console.error("Posts component received invalid data format:", posts);
  return <div className="no-posts">No posts available</div>;
});

export default Posts;