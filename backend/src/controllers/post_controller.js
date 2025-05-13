import supabase from "../config/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

export const getPosts = async (req, res) => {
    try {
        // Fetch all posts from the 'posts' table with user information and comments count
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    profile_pic,
                    cover_pic
                ),
                comments:comments(count)
            `)
            .order('created_at', { ascending: false }); // Most recent posts first

        // Handle errors from Supabase
        if (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ message: "Error fetching posts", error });
        }

        // Transform the data to include comments count
        const transformedData = data.map(post => ({
            ...post,
            comments_count: post.comments?.[0]?.count || 0
        }));

        // Return the fetched posts
        res.status(200).json({ message: "Posts fetched successfully", data: transformedData });
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
        // Fetch posts for the given user_id with user information and comments count
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    profile_pic,
                    cover_pic
                ),
                comments:comments(count)
            `)
            .eq("user_id", user_id) // Filter by user_id
            .order('created_at', { ascending: false }); // Most recent posts first

        // Handle errors from Supabase
        if (error) {
            console.error("Error fetching posts by user:", error);
            return res.status(500).json({ message: "Error fetching posts by user", error });
        }

        // Transform the data to include comments count
        const transformedData = data.map(post => ({
            ...post,
            comments_count: post.comments?.[0]?.count || 0
        }));

        // Return the fetched posts
        res.status(200).json({ message: "Posts fetched successfully", data: transformedData });
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
        
        // If there are no followed users, return empty array
        if (followedUserIds.length === 0) {
            return res.status(200).json({ 
                message: "No followed users found", 
                data: [] 
            });
        }

        // Fetch posts from the followed users with user information
        const { data: posts, error: postsError } = await supabase
            .from("posts")
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    profile_pic,
                    cover_pic
                )
            `)
            .in("user_id", followedUserIds) // Filter posts by followed user IDs
            .order('created_at', { ascending: false }); // Most recent posts first

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
    try {
        const { user_id, content } = req.body;
        const file = req.file; // File from multer middleware
        
        console.log("Creating post with:", {
            user_id,
            content,
            file: file ? { 
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            } : "No file"
        });
        
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let image_url = null;
        let video_url = null;

        // Handle file upload to Supabase storage if a file was provided
        if (file) {
            // Generate a unique filename
            const fileName = `posts/${uuidv4()}-${file.originalname}`;
            
            // Determine if it's an image or video based on mimetype
            const isVideo = file.mimetype.startsWith('video/');
            const isImage = file.mimetype.startsWith('image/');
            
            console.log("File type:", {
                isImage,
                isVideo,
                mimetype: file.mimetype
            });
            
            // Upload the file to Supabase Storage
            const { data, error } = await supabase.storage
                .from("user-uploads") // Your bucket name
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });

            if (error) {
                console.error("Error uploading file to storage:", error);
                return res.status(500).json({ 
                    message: "Error uploading file", 
                    error 
                });
            }

            // Get the public URL of the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from("user-uploads")
                .getPublicUrl(fileName);
            
            const publicUrl = publicUrlData.publicUrl;
            console.log("Generated public URL:", publicUrl);

            // Set the appropriate URL based on file type
            if (isImage) {
                image_url = publicUrl;
            }
            
            else if (isVideo) {
                video_url = publicUrl;
            }
        }

        // Insert the new post into the database with file URLs if they exist
        console.log("Creating post entry with:", {
            user_id,
            content,
            image_url,
            video_url
        });
        
        const { data: postData, error: postError } = await supabase
            .from("posts")
            .insert([
                {
                    user_id,
                    content,
                    image_url,
                    video_url
                },
            ])
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    profile_pic,
                    cover_pic
                )
            `); // Select the post with user information

        if (postError) {
            console.error("Error creating post:", postError);
            return res.status(500).json({ 
                message: "Error creating post", 
                error: postError 
            });
        }

        res.status(201).json({ 
            message: "Post created successfully", 
            data: postData 
        });
    }
    
    catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ 
            message: "Unexpected error", 
            error 
        });
    }
};