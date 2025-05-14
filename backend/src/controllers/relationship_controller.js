import supabase from "../config/supabaseClient.js";

// Get relationships (followers/following)
export const getRelationships = async (req, res) => {
  const { followedUserId } = req.query;
  
  try {
    const { data, error } = await supabase
      .from("user_relations")
      .select("follower_id")
      .eq("followed_id", followedUserId);

    if (error) throw error;

    const followerIds = data.map(relation => relation.follower_id);
    res.status(200).json(followerIds);
  } catch (error) {
    console.error("Error fetching relationships:", error);
    res.status(500).json({ message: "Error fetching relationships", error: error.message });
  }
};

// Add relationship (follow)
export const addRelationship = async (req, res) => {
  const { userId } = req.body;
  const followerId = req.user.id; // From auth middleware

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const { error } = await supabase
      .from("user_relations")
      .insert([{ follower_id: followerId, followed_id: userId }]);

    if (error) throw error;
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

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const { error } = await supabase
      .from("user_relations")
      .delete()
      .eq("follower_id", followerId)
      .eq("followed_id", userId);

    if (error) throw error;
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error deleting relationship:", error);
    res.status(500).json({ message: "Error deleting relationship", error: error.message });
  }
}; 