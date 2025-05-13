import jwt from 'jsonwebtoken';

export const societyAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify this is a society token
    if (!decoded.society_name) {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a society"
      });
    }
    
    // Add society info to request object
    req.society = {
      id: decoded.id,
      name: decoded.society_name,
      email: decoded.email_address
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};