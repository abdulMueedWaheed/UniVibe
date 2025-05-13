import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateTokenFromCookie = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request
        next();
    }
	
	catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authenticateTokenFromCookie;