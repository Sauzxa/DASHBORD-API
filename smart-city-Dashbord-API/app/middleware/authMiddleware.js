const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the "Authorization" header
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token is missing." });
    }

    // Verify the token using Supabase
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error("Error verifying token:", error?.message);
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    // Attach user information to the request object
    req.user = {
      email: user.email,
      id: user.id,
      password: user.password, // Adjust if using hashed passwords
    };

    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err.message);
    res.status(500).json({ message: "Authentication failed." });
  }
};

module.exports = authMiddleware;
