import supabase from "../config/supabaseClient.js";

export const getPosts = async (req, res) => {
    try {
        // Fetch all posts from the 'posts' table
        const { data, error } = await supabase
            .from("posts")
            .select("*"); // Select all columns

        // Handle errors from Supabase
        if (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ message: "Error fetching posts", error });
        }

        // Return the fetched posts
        res.status(200).json({ message: "Posts fetched successfully", data });
    }
	
	catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

export const getPostsByUser = async (req, res) => {
    const { user_id } = req.params; // Extract user_id from request parameters

    console.log("Received user_id:", user_id); // Log the user_id
    
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ message: "Invalid or missing user ID" });
    };

    try {
        // Fetch posts for the given user_id
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", user_id); // Filter by user_id

        // Handle errors from Supabase
        if (error) {
            console.error("Error fetching posts by user:", error);
            return res.status(500).json({ message: "Error fetching posts by user", error });
        }

        // Return the fetched posts
        res.status(200).json({ message: "Posts fetched successfully", data });
    }
	
	catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

export const getPostsOfFollowedUsers = async (req, res) => {
    const { user_id } = req.params; // Extract the current user's ID from request parameters

    try {
        // Fetch the IDs of users followed by the current user
        const { data: followedUsers, error: followsError } = await supabase
            .from("user_relations")
            .select("followed_id")
            .eq("follower_id", user_id);

        if (followsError) {
            console.error("Error fetching followed users:", followsError);
            return res.status(500).json({ message: "Error fetching followed users", error: followsError });
        }

        // Extract the followed user IDs
        const followedUserIds = followedUsers.map(follow => follow.followed_id);

        // Fetch posts from the followed users
        const { data: posts, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .in("user_id", followedUserIds); // Filter posts by followed user IDs

        if (postsError) {
            console.error("Error fetching posts of followed users:", postsError);
            return res.status(500).json({ message: "Error fetching posts of followed users", error: postsError });
        }

        // Return the fetched posts
        res.status(200).json({ message: "Posts fetched successfully", data: posts });
    }
    
    catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

export const createPost = async (req, res) => {
    const { user_id, content, image_url, video_url } = req.body;

    // Validate input: Ensure only one of `image_url` or `video_url` is provided
    if (image_url && video_url) {
        return res.status(400).json({ message: "You can only upload an image or a video, not both." });
    }

    try {
        // Insert the new post into the database
        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    user_id,
                    content,
                    image_url: image_url || null, // Use null if no image is provided
                    video_url: video_url || null, // Use null if no video is provided
                },
            ])
            .select();

        if (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ message: "Error creating post", error });
        }

        res.status(201).json({ message: "Post created successfully", data });
    }
    
    catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};