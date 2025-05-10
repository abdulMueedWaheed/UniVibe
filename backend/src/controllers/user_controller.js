import supabase from "../config/supabaseClient.js";

export const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*"); // Select all columns from the table

        if (error) {
            console.error("Error fetching users:", error);
            return { success: false, error };
        }

        console.log("Users fetched successfully:", data);
        return { success: true, data };
    }
	
	catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error };
    }
};

export const getUserById = async (id) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*") // Select all columns
            .eq("id", id) // Filter by the `id` column
            .single(); // Ensure only one row is returned

        if (error) {
            console.error("Error fetching user:", error);
            return { success: false, error };
        }

        console.log("User fetched successfully:", data);
        return { success: true, data };
    }
	
	catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error };
    }
};