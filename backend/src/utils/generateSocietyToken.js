import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT token for a society and sets it as a cookie
 * @param {number|string} society_id - The society's ID
 * @param {string} society_name - The society's name
 * @param {string} email_address - The society's email address
 * @param {object} res - Express response object to set cookie
 * @returns {string} The generated JWT token
 */
const generateSocietyToken = (society_id, society_name, email_address, res) => {
    const token = jwt.sign(
        { 
            id: society_id, 
            society_name: society_name, 
            email_address: email_address,
            type: 'society' // Mark as a society token for auth middleware
        },
        JWT_SECRET,
        { expiresIn: "3d" } // Token expires in 3 days
    );
    
    // Set token as a cookie
    res.cookie("token", token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    });

    return token;
};

export default generateSocietyToken;