import { useQuery } from '@tanstack/react-query';
import Posts from '../../components/posts/Posts';
import { makeRequest } from '../../axios';
import "./explore.scss";


const Explore = () => {
    // Fetch all posts
    const { isLoading, error, data: posts } = useQuery({
        queryKey: ["explorePosts"],
        queryFn: async () => {
            try {
                const res = await makeRequest.get('/posts');
                console.log("Explore posts response:", res.data.data);
                return res.data.data || [];
            } catch (err) {
                console.error("Error fetching posts:", err);
                throw err;
            }
        }
    });

    return (
        <div className="explore">
            <div className="container">
                <h1>Explore</h1>
                <div className='idk'>
                {isLoading ? (
                    <div className="loading">Loading posts...</div>
                ) : error ? (
                    <div className="error">Error loading posts: {error.message}</div>
                ) : posts && posts.length > 0 ? (
                    <Posts posts={posts} />
                ) : (
                    <div className="no-posts">No posts to display</div>
                )}
                </div>
            </div>
        </div>
    );
};

export default Explore;