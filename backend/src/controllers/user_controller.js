import supabase from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names

export const updateCoverPic = async (req, res) => {
  const { user_id } = req.body;
  const file = req.file; // File from multer

  console.log("Received user_id:", user_id);
  console.log("Received file:", file ? file.originalname : "none");

  if (!user_id || !file) {
    return res.status(400).json({ message: "User ID and file are required" });
  }

  try {
    // Generate a unique file name with folder structure
    const fileName = `cover-pics/${uuidv4()}-${file.originalname}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-uploads") // Replace with your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Error uploading file to storage:", error);
      throw error;
    }

    // Get the public URL of the uploaded file
    // FIXED: The correct way to get publicUrl
    const { data: urlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(fileName);
      
    const publicUrl = urlData.publicUrl;
    console.log("Generated public URL:", publicUrl);

    // Update the user's cover_pic in the database
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({ cover_pic: publicUrl })
      .eq("id", user_id)
      .select();

    if (updateError) {
      console.error("Error updating cover_pic in database:", updateError);
      throw updateError;
    }

    console.log("User cover pic updated successfully:", userData);
    res.status(200).json({ cover_pic: publicUrl });
  }
  catch (error) {
    console.error("Error updating cover picture:", error);
    res.status(500).json({ message: "Error updating cover picture", error: error.message });
  }
};

export const updateProfilePic = async (req, res) => {
  const { user_id } = req.body;
  const file = req.file; // File from multer

  if (!user_id || !file) {
    return res.status(400).json({ message: "User ID and file are required" });
  }

  try {
    // Generate a unique file name
    const fileName = `profile-pics/${uuidv4()}-${file.originalname}`;
    
    console.log(`Uploading file ${fileName} for user ${user_id}`);

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-uploads") // Replace with your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Error uploading file to storage:", error);
      throw error;
    }

    // Get the public URL of the uploaded file
    // FIXED: The correct way to get publicUrl 
    const { data: urlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log("Generated public URL:", publicUrl);
    
    // Update the user's profile_pic in the database
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({ profile_pic: publicUrl })
      .eq("id", user_id)
      .select();

    if (updateError) {
      console.error("Error updating profile_pic in database:", updateError);
      throw updateError;
    }

    console.log("User profile updated successfully:", userData);
    res.status(200).json({ profile_pic: publicUrl });
  }
  catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture", error: error.message });
  }
};

// Add this function to your user_controller.js file

export const getUser = async (req, res) => {
  const { user_id } = req.params;
  
  try {
    console.log(`Fetching user with ID: ${user_id}`);
    
    // Fetch the user by ID
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();
      
    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Error fetching user", error });
    }
    
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User fetched successfully", data });
  }
  
  catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};

export const getUsersForStories = async(req, res) => {
    try {
        const limit = req.query.limit || 10;
    
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, profile_pic')
          .limit(limit);
        
        if (error) throw error;
        
        return res.status(200).json({
          success: true,
          data
        });
  }
  
  catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

// gett all the users based on query
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // Get the search query from request
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }
    
    console.log(`Searching for users with query: ${q}`);
    
    // Search in both user_name and full_name fields
    const { data, error } = await supabase
      .from('users')
      .select('id, user_name, full_name, profile_pic')
      .or(`user_name.ilike.%${q}%,full_name.ilike.%${q}%`)
      .limit(10); // Limit to 10 results
    
    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    
    return res.status(200).json({
      success: true,
      data
    });
  }
  catch (error) {
    console.error("Error in search users:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};