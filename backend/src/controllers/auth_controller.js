import bcrypt from "bcrypt";
import supabase from "../config/supabaseClient.js";
import generateToken from '../utils/generateToken.js'

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
export const register = async (req, res) => {
    const { user_name, password, full_name, email_address } = req.body;

    console.log("Register request received:", { user_name, full_name, email_address });

    // Basic validation
    if (!user_name || !password || !full_name || !email_address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

	// Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailRegex.test(email_address)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        // Check if the user already exists
        const { data: existingUser, error: existingUserError } = await supabase
            .from("users")
            .select("*")
            .or(`user_name.eq.${user_name},email_address.eq.${email_address}`)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (existingUserError && existingUserError.code !== "PGRST116") {
            console.error("Error checking existing user:", existingUserError);
            return res.status(500).json({ message: "Error checking existing user", error: existingUserError });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    user_name,
                    password: hashedPassword,
                    full_name,
                    email_address,
                },
            ])
            .select();

        if (error) {
            console.error("Error inserting user:", error);
            return res.status(400).json({ message: "Error registering user", error });
        }

        // Generate a JWT token
        const token = generateToken(data[0].id, data[0].user_name, data[0].email_address, res);

        console.log("User registered successfully");
        res.status(201).json({ message: "User registered successfully", data, token });
    }
	
	catch (error) {
        console.error("Unexpected error during registration:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

// Login a user
export const login = async (req, res) => {
    const { user_name, password, email_address } = req.body;

    console.log("Login request received:", { user_name, email_address });

    // Basic validation
    if (!user_name || !password || !email_address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the user exists
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_name", user_name)
            .eq("email_address", email_address)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = generateToken(user.id, user.user_name, user.email_address, res);

        console.log("User logged in successfully");
        res.status(200).json({ message: "Login successful",user , token });
    } catch (error) {
        console.error("Unexpected error during login:", error);
        res.status(500).json({ message: "Unexpected error", error });
    }
};

// Logout a user
export const logout = (req, res) => {
    console.log("Logout request received");

    // Clear the token cookie
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};