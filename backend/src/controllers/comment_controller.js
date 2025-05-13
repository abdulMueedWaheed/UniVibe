import supabase from "../config/supabaseClient.js";

// Get comments for a post
export const getComments = async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ message: "postId is required" });

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      users:user_id (
        id,
        full_name,
        profile_pic
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ message: "Error fetching comments", error });
  res.status(200).json(data);
};

// Add a new comment
export const addComment = async (req, res) => {
  const { desc, postId, userId } = req.body;
  if (!desc || !postId || !userId) return res.status(400).json({ message: "desc, postId, and userId are required" });

  const { data: userExists } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  const { data: postExists } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .single();

  if (!userExists || !postExists) {
    return res.status(400).json({ message: "Invalid userId or postId" });
  }

  const { data, error } = await supabase
  .from("comments")
  .insert([{ content: desc, post_id: postId, user_id: userId }])
  .select(`
    *,
    users:user_id (
      id,
      full_name,
      profile_pic
    )
  `);
  if (error) return res.status(500).json({ message: "Error adding comment", error });
  res.status(201).json(data[0]);
};
