import supabase from "../config/supabaseClient.js";

// Get likes for a post
export const getLikes = async (req, res) => {
    const { postId } = req.query;
    
    if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
    }

    try {
        // Fetch all user IDs who liked the post
        const { data, error } = await supabase
            .from("likes")
            .select("user_id, created_at")
            .eq("post_id", postId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching likes:", error);
            return res.status(500).json({ message: "Error fetching likes", error });
        }

        // Extract just the user IDs from the response
        const userIds = data.map(like => like.user_id);
        
        res.status(200).json(userIds);
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

// Add a like to a post
export const addLike = async (req, res) => {
    const { postId, userId } = req.body;
    console.log("Received addLike request:", { postId, userId });

    if (!postId || !userId) {
        return res.status(400).json({ message: "Post ID and User ID are required" });
    }

    try {
        // Check if the like already exists
        const { data: existingLike, error: checkError } = await supabase
            .from("likes")
            .select("*")
            .eq("post_id", postId)
            .eq("user_id", userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error checking existing like:", checkError);
            return res.status(500).json({ message: "Error checking existing like", error: checkError });
        }

        if (existingLike) {
            console.log("Like already exists for:", { postId, userId });
            return res.status(400).json({ message: "User has already liked this post" });
        }

        // Add the new like
        const { data, error } = await supabase
            .from("likes")
            .insert([
                {
                    post_id: postId,
                    user_id: userId,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error("Supabase error adding like:", error);
            return res.status(500).json({ message: "Error adding like", error });
        }

        console.log("Like added successfully:", data);
        res.status(201).json({ message: "Like added successfully", data });
    } catch (error) {
        console.error("Unexpected error in addLike:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

// Remove a like from a post
export const deleteLike = async (req, res) => {
    const { postId, userId } = req.query;
    console.log("Received deleteLike request:", { postId, userId });

    if (!postId || !userId) {
        return res.status(400).json({ message: "Post ID and User ID are required" });
    }

    try {
        // Delete the like
        const { error } = await supabase
            .from("likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error removing like:", error);
            return res.status(500).json({ message: "Error removing like", error });
        }

        console.log("Like removed successfully for:", { postId, userId });
        res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
        console.error("Unexpected error in deleteLike:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
}; 