const jwt = require('jsonwebtoken'); // Add this if needed for custom JWT validation
const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token is missing or malformed." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from the "Authorization" header

    // Option 1: Validate the token using Supabase
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error("Error verifying token:", error?.message);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
    }

    // Option 2: Validate the token server-side with a library like 'jsonwebtoken'
    // Uncomment this if you use a custom JWT for Supabase service role
    // const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    // const userId = decoded.sub; // Extract the user ID from the token
    // const { data: user, error } = await supabase.auth.admin.getUserById(userId);

    // Attach user information to the request object
    req.user = {
      email: user.email,
      id: user.id,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error in authMiddleware:", err.message);
    res.status(500).json({ message: "Authentication failed. Please try again." });
  }
};

module.exports = authMiddleware;
