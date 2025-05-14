import supabase from "../config/supabaseClient.js";

// Get relationships (followers/following)
export const getRelationships = async (req, res) => {
  const { followerUserId } = req.query;
  console.log("[getRelationships] Query params:", req.query);
  
  try {
    const { data, error } = await supabase
      .from("user_relations")
      .select("followed_id")
      .eq("follower_id", followerUserId);
    console.log("[getRelationships] Supabase data:", data);
    if (error) {
      console.error("[getRelationships] Supabase error:", error);
      throw error;
    }

    const followedIds = data.map(relation => relation.followed_id);
    console.log("[getRelationships] followedIds:", followedIds);
    res.status(200).json(followedIds);
  } catch (error) {
    console.error("Error fetching relationships:", error);
    res.status(500).json({ message: "Error fetching relationships", error: error.message });
  }
};

// Add relationship (follow)
export const addRelationship = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.id; // From auth middleware
  console.log("[addRelationship] Body:", req.body, "FollowerId:", followerId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
 
  try {
    const { data: existing } = await supabase
      .from("user_relations")
      .select("*")
      .eq("follower_id", followerId)
      .eq("followed_id", userId)
      .single();

    if (existing) {
      return res.status(400).json({ message: "Already following" });
    }

    const { error } = await supabase
      .from("user_relations")
      .insert([{ follower_id: followerId, followed_id: userId }]);
    if (error) {
      console.error("[addRelationship] Supabase error:", error);
      throw error;
    }
    console.log("[addRelationship] Followed successfully");
    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error adding relationship:", error);
    res.status(500).json({ message: "Error adding relationship", error: error.message });
  }
};

// Delete relationship (unfollow)
export const deleteRelationship = async (req, res) => {
  const { userId } = req.query;
  const followerId = req.user.id; // From auth middleware
  console.log("[deleteRelationship] Query:", req.query, "FollowerId:", followerId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const { error } = await supabase
      .from("user_relations")
      .delete()
      .eq("follower_id", followerId)
      .eq("followed_id", userId);
    if (error) {
      console.error("[deleteRelationship] Supabase error:", error);
      throw error;
    }
    console.log("[deleteRelationship] Unfollowed successfully");
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error deleting relationship:", error);
    res.status(500).json({ message: "Error deleting relationship", error: error.message });
  }
}; 