import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import generateSocietyToken from '../utils/generateSocietyToken.js';


export const registerSociety = async (req, res) => {

  // TEMPORARY HARD CODED UNI
  const university_id = 1;
  try {
    const { 
      society_name, 
      email_address, 
      password, 
      society_description 
    } = req.body; 

    // Validate required fields
    if (!society_name || !email_address || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided (society_name, university_id, email_address, password)"
      });
    }

    // Check if email already exists
    const { data: existingSociety } = await supabase
      .from('societies')
      .select('email_address')
      .eq('email_address', email_address)
      .single();

    if (existingSociety) {
      return res.status(409).json({
        success: false,
        message: "A society with this email already exists"
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new society
    const { data, error } = await supabase
      .from('societies')
      .insert({
        society_name,
        university_id,
        email_address,
        password: hashedPassword,
        society_description: society_description || "",
        profile_pic: null,
        cover_pic: null
      })
      .select();

    if (error) {
      console.error("Error creating society:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating society account",
        error: error.message
      });
    }

    // Return success without the password
    return res.status(201).json({
      success: true,
      message: "Society registered successfully",
      data: {
        ...data[0],
        password: undefined
      }
    });
  }
  
  catch (error) {
    console.error("Society registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Society login function
export const loginSociety = async (req, res) => {
  const { email_address, password } = req.body;
  
  try {
    // Validate required fields
    if (!email_address || !password) {
      return res.status(400).json({
        success: false,
        message: "Email address and password are required"
      });
    }
    
    // Find society by email
    const { data: society, error } = await supabase
      .from("societies")
      .select("*")
      .eq("email_address", email_address)
      .single();
      
    if (error || !society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, society.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Generate JWT token using the utility function
    generateSocietyToken(
      society.society_id, 
      society.society_name,
      society.email_address,
      res
    );
    
    // Return success with society data (excluding password)
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        society_id: society.society_id,
        society_name: society.society_name,
        email_address: society.email_address,
        profile_pic: society.profile_pic,
        cover_pic: society.cover_pic,
        society_description: society.society_description,
        university_id: society.university_id
      }
    });
  } 
  catch (error) {
    console.error("Error logging in society:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const logoutSociety = (req, res) => {
  try {
    // Make sure this cookie name matches what was set in generateSocietyToken
    res.clearCookie("token", {
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none"
    });

    return res.status(200).json({
      success: false, // This should be true for successful logout
      message: "Society logged out successfully"
    });
  } 

  catch (error) {
    console.error("Society logout error:", error);
    return res.status(500).json({
      success: false, 
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get a single society by ID
export const getSociety = async (req, res) => {
  const { society_id } = req.params;
  
  try {
    console.log(`Fetching society with ID: ${society_id}`);
    
    // Fetch the society by ID
    const { data, error } = await supabase
      .from("societies")
      .select("*")
      .eq("society_id", society_id)
      .single();
      
    if (error) {
      console.error("Error fetching society:", error);
      return res.status(500).json({ message: "Error fetching society", error });
    }
    
    if (!data) {
      return res.status(404).json({ message: "Society not found" });
    }
    
    // Don't send password in response
    const society = {
      ...data,
      password: undefined
    };
    
    res.status(200).json({ message: "Society fetched successfully", data: society });
  }
  
  catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};

// Get all societies (with optional limit)
export const getAllSocieties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    let query = supabase
      .from("societies")
      .select("society_id, society_name, profile_pic, society_description, university_id")
      .limit(limit);
    
    // Add university filter if provided
    if (req.query.university_id) {
      query = query.eq('university_id', req.query.university_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching societies:", error);
      return res.status(500).json({ message: "Error fetching societies", error });
    }
    
    res.status(200).json({ message: "Societies fetched successfully", data });
  }
  
  catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ message: "Error fetching societies", error });
  }
};

// Update society profile pic
export const updateProfilePic = async (req, res) => {
  const { file } = req;
  const society_id = req.body.society_id;

  if (!society_id || !file) {
    return res.status(400).json({ message: "Society ID and file are required" });
  }

  try {
    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `societies/${uuidv4()}-${file.originalname}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log("Generated public URL:", publicUrl);
    
    // Update the society's profile_pic in the database
    const { data: societyData, error: updateError } = await supabase
      .from("societies")
      .update({ profile_pic: publicUrl })
      .eq("society_id", society_id)
      .select();

    if (updateError) {
      console.error("Error updating profile_pic in database:", updateError);
      throw updateError;
    }

    console.log("Society profile updated successfully:", societyData);
    res.status(200).json({ profile_pic: publicUrl });
  }

  catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture", error: error.message });
  }
};

// Update society cover pic
export const updateCoverPic = async (req, res) => {
  const { file } = req;
  const society_id = req.body.society_id;

  if (!society_id || !file) {
    return res.status(400).json({ message: "Society ID and file are required" });
  }

  try {
    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `societies/${uuidv4()}-${file.originalname}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    
    // Update the society's cover_pic in the database
    const { data: societyData, error: updateError } = await supabase
      .from("societies")
      .update({ cover_pic: publicUrl })
      .eq("society_id", society_id)
      .select();

    if (updateError) {
      console.error("Error updating cover_pic in database:", updateError);
      throw updateError;
    }

    res.status(200).json({ cover_pic: publicUrl });
  }

  catch (error) {
    console.error("Error updating cover picture:", error);
    res.status(500).json({ message: "Error updating cover picture", error: error.message });
  }
};

// Update society info
export const updateSocietyInfo = async (req, res) => {
  const { society_id } = req.params;
  const { society_name, society_description, email_address } = req.body;
  
  try {
    // Check if request is authenticated
    if (req.society && req.society.id) {
      // Verify the authenticated society is updating their own profile
      if (req.society.id.toString() !== society_id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own society information"
        });
      }
    }
    
    // Rest of your function logic...
    const updateData = {};
    if (society_name) updateData.society_name = society_name;
    if (society_description) updateData.society_description = society_description;
    if (email_address) updateData.email_address = email_address;
    
    const { data, error } = await supabase
      .from("societies")
      .update(updateData)
      .eq("society_id", society_id)
      .select();
      
    // Error handling and response...
  } catch (error) {
    console.error("Error updating society:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating society", 
      error: error.message 
    });
  }
};

export const changeSocietyPassword = async (req, res) => {
  const { society_id } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required"
    });
  }
  
  try {
    // Verify the authenticated society is changing their own password
    if (req.society.id.toString() !== society_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only change your own password"
      });
    }
    
    // Get current society data including password
    const { data: society, error: fetchError } = await supabase
      .from("societies")
      .select("*")
      .eq("society_id", society_id)
      .single();
      
    if (fetchError || !society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, society.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    const { error: updateError } = await supabase
      .from("societies")
      .update({ password: hashedPassword })
      .eq("society_id", society_id);
      
    if (updateError) {
      return res.status(500).json({
        success: false,
        message: "Error updating password",
        error: updateError
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  }

  catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message
    });
  }
};