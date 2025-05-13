import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user_id, user_name, email_address, res) => {
	const token = jwt.sign(
			{ id: user_id, user_name: user_name, email_address: email_address },
            JWT_SECRET,
            { expiresIn: "3d" } // Token expires in 3 days
        );
		
		res.cookie("token", token, {
			httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
			secure: process.env.NODE_ENV === "production", // Use HTTPS in production
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
			
		});

		return token;
};

export default generateToken;