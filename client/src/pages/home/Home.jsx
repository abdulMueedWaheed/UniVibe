import './home.scss'
import Stories from '../../components/stories/Stories'
import Posts from '../../components/posts/Posts'
import Share from '../../components/share/Share'
import { useState, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import { AuthContext } from '../../context/AuthContext'

const Home = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all" or "followed"
  const { currentUser } = useContext(AuthContext);
  
  // Query for fetching all posts
  const { 
    isLoading: allPostsLoading, 
    error: allPostsError, 
    data: allPosts 
  } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      const res = await makeRequest.get("/posts");
      // Shuffle the posts array
      const shuffledPosts = [...(res.data.data || [])].sort(() => Math.random() - 0.5);
      return { ...res.data, data: shuffledPosts };
    },
    refetchOnWindowFocus: false,
  });

  // Query for fetching posts from followed users
  const { 
    isLoading: followedPostsLoading, 
    error: followedPostsError, 
    data: followedPosts 
  } = useQuery({
    queryKey: ['followedPosts', currentUser?.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/posts/followed/${currentUser?.id}`);
      // Shuffle the posts array
      const shuffledPosts = [...(res.data.data || [])].sort(() => Math.random() - 0.5);
      return { ...res.data, data: shuffledPosts };
    },
    refetchOnWindowFocus: false,
    enabled: !!currentUser?.id // Only run if we have a user ID
  });

  // Filter posts to exclude current user's posts
  const filteredAllPosts = useMemo(() => {
    if (!allPosts?.data || !currentUser) return allPosts?.data || [];
    
    return allPosts.data.filter(post => post.user_id !== currentUser.id);
  }, [allPosts?.data, currentUser]);

  // Filter followed posts to exclude current user's posts
  const filteredFollowedPosts = useMemo(() => {
    if (!followedPosts?.data || !currentUser) return followedPosts?.data || [];
    
    return followedPosts.data.filter(post => post.user_id !== currentUser.id);
  }, [followedPosts?.data, currentUser]);

  return (
    <div className='home'>
      <Stories />
      <Share />
      
      <div className="feed-tabs">
        <button 
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Discover
        </button>
        <button 
          className={`tab-button ${activeTab === "followed" ? "active" : ""}`}
          onClick={() => setActiveTab("followed")}
          disabled={!currentUser}
        >
          Following
        </button>
      </div>
      
      {activeTab === "all" ? (
        allPostsLoading ? (
          <div className="loading-state">Loading posts...</div>
        ) : allPostsError ? (
          <div className="error-state">Error loading posts</div>
        ) : filteredAllPosts.length ? (
          <Posts posts={filteredAllPosts} />
        ) : (
          <div className="empty-state">No posts to discover yet!</div>
        )
      ) : (
        followedPostsLoading ? (
          <div className="loading-state">Loading posts from people you follow...</div>
        ) : followedPostsError ? (
          <div className="error-state">Error loading posts</div>
        ) : filteredFollowedPosts.length ? (
          <Posts posts={filteredFollowedPosts} />
        ) : (
          <div className="empty-state">No posts from people you follow yet.</div>
        )
      )}
    </div>
  )
}

export default Home