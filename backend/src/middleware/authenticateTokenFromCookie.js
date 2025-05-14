import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateTokenFromCookie = (req, res, next) => {
    // Try to get token from cookie first
    let token = req.cookies.token;
    
    // If no cookie token, try Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            token = authHeader.split(" ")[1]; // Bearer TOKEN format
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authenticateTokenFromCookie;