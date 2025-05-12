import supabase from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names

export const updateCoverPic = async (req, res) => {
  const { user_id } = req.body;
  const file = req.file; // File from multer

  console.log("Received user_id:", user_id);
  console.log("Received file:", file);

  if (!user_id || !file) {
    return res.status(400).json({ message: "User ID and file are required" });
  }

  try {
    // Generate a unique file name
    const fileName = `${file.originalname}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-uploads") // Replace with your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { publicUrl } = supabase.storage.from("user-uploads").getPublicUrl(fileName);

    // Update the user's cover_pic in the database
    const{updateError}=await supabase.from("users").update({ cover_pic: publicUrl }).eq("id", user_id);

    if (updateError) {
      console.error("Error updating cover_pic in database:", updateError);
      throw updateError;
    }

    res.status(200).json({ cover_pic: publicUrl });
  }
  
  catch (error) {
    console.error("Error updating cover picture:", error);
    res.status(500).json({ message: "Error updating cover picture" });
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

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-uploads") // Replace with your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { publicUrl } = supabase.storage.from("user-uploads").getPublicUrl(fileName);

    // Update the user's profile_pic in the database
    await supabase.from("users").update({ profile_pic: publicUrl }).eq("id", user_id);

    res.status(200).json({ profile_pic: publicUrl });
  }
  
  catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};