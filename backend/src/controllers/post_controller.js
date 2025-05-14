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

export const deletePost = async (req, res) => {
    const { post_id } = req.params;
    // Get user_id from the authenticated token instead of request body
    const user_id = req.user.id;
    
    try {
        console.log(`Attempting to delete post ${post_id} by user ${user_id}`);
        
        // Check if the post exists and belongs to the user
        const { data: existingPost, error: fetchError } = await supabase
            .from("posts")
            .select("user_id")
            .eq("id", post_id)
            .single();
        
        if (fetchError) {
            console.error("Error fetching post for deletion:", fetchError);
            return res.status(404).json({ 
                success: false,
                message: "Post not found", 
                error: fetchError.message 
            });
        }
        
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        // Verify ownership of the post
        if (existingPost.user_id !== Number(user_id)) {
            return res.status(403).json({ 
                success: false,
                message: "You can only delete your own posts"
            });
        }
        
        // Delete any comments associated with the post
        const { error: commentsError } = await supabase
            .from("comments")
            .delete()
            .eq("post_id", post_id);
        
        if (commentsError) {
            console.error("Error deleting comments:", commentsError);
            // Continue with post deletion even if comment deletion fails
        }
        
        // Delete any likes associated with the post
        const { error: likesError } = await supabase
            .from("likes")
            .delete()
            .eq("post_id", post_id);
        
        if (likesError) {
            console.error("Error deleting likes:", likesError);
            // Continue with post deletion even if likes deletion fails
        }
        
        // Delete the post
        const { error: deleteError } = await supabase
            .from("posts")
            .delete()
            .eq("id", post_id);
        
        if (deleteError) {
            console.error("Error deleting post:", deleteError);
            return res.status(500).json({ 
                success: false,
                message: "Error deleting post", 
                error: deleteError.message 
            });
        }
        
        // Return success response
        res.status(200).json({ 
            success: true,
            message: "Post deleted successfully" 
        });
    } catch (error) {
        console.error("Unexpected error during post deletion:", error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting post", 
            error: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const file = req.file; // From multer middleware
    
    // Get user ID from auth token
    const user_id = req.user?.id;
    
    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        console.log(`Attempting to update post ${post_id} by user ${user_id}`);
        
        // Check if the post exists and belongs to the user
        const { data: existingPost, error: fetchError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", post_id)
            .single();
        
        if (fetchError) {
            console.error("Error fetching post for update:", fetchError);
            return res.status(404).json({ 
                success: false,
                message: "Post not found", 
                error: fetchError.message 
            });
        }
        
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        // Verify ownership of the post
        if (existingPost.user_id !== Number(user_id)) {
            return res.status(403).json({ 
                success: false,
                message: "You can only update your own posts"
            });
        }
        
        // Initialize update data with content if provided
        const updateData = {};
        if (content !== undefined) {
            updateData.content = content;
        }
        
        // Handle file upload if a file is provided
        if (file) {
            try {
                // Generate a unique filename
                const fileName = `posts/${uuidv4()}-${file.originalname}`;
                
                // Determine file type from mimetype
                const isImage = file.mimetype.startsWith('image/');
                const isVideo = file.mimetype.startsWith('video/');
                
                if (!isImage && !isVideo) {
                    return res.status(400).json({
                        success: false,
                        message: "Only image and video files are allowed"
                    });
                }
                
                // Upload file to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from("user-uploads")
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                        cacheControl: '3600'
                    });
                
                if (uploadError) {
                    throw uploadError;
                }
                
                // Get the public URL
                const { data: urlData } = supabase.storage
                    .from("user-uploads")
                    .getPublicUrl(fileName);
                
                const publicUrl = urlData.publicUrl;
                
                console.log("Media uploaded successfully, URL:", publicUrl);
                
                // Remove old media file if it exists
                if (isImage) {
                    updateData.image_url = publicUrl;
                    updateData.video_url = null; // Clear video if switching to image
                    
                    // Delete old image if exists
                    if (existingPost.image_url) {
                        try {
                            const oldPath = existingPost.image_url.split('/').pop();
                            await supabase.storage
                                .from("user-uploads")
                                .remove([`posts/${oldPath}`]);
                        } catch (removeError) {
                            console.warn("Failed to remove old image:", removeError);
                            // Continue anyway - this is not critical
                        }
                    }
                } 
                else if (isVideo) {
                    updateData.video_url = publicUrl;
                    updateData.image_url = null; // Clear image if switching to video
                    
                    // Delete old video if exists
                    if (existingPost.video_url) {
                        try {
                            const oldPath = existingPost.video_url.split('/').pop();
                            await supabase.storage
                                .from("user-uploads")
                                .remove([`posts/${oldPath}`]);
                        } catch (removeError) {
                            console.warn("Failed to remove old video:", removeError);
                            // Continue anyway - this is not critical
                        }
                    }
                }
            } 
            catch (fileError) {
                console.error("Error handling file upload:", fileError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file",
                    error: fileError.message
                });
            }
        }
        
        // If no update data was provided, return an error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }
        
        // Update the post in the database
        const { data: updatedPost, error: updateError } = await supabase
            .from("posts")
            .update(updateData)
            .eq("id", post_id)
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    profile_pic
                ),
                comments:comments(count)
            `);
        
        if (updateError) {
            console.error("Error updating post:", updateError);
            return res.status(500).json({ 
                success: false,
                message: "Error updating post", 
                error: updateError.message 
            });
        }
        
        // Return success with updated post data
        return res.status(200).json({ 
            success: true,
            message: "Post updated successfully",
            data: updatedPost[0]
        });
    } 
    catch (error) {
        console.error("Unexpected error during post update:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error updating post", 
            error: error.message 
        });
    }
};