const supabase = require('../config/supabaseClient'); // Ensure the correct path to your Supabase client

const authMiddleware = async (req, res, next) => {
  try {
    // Assuming the client sends 'email' and 'userId' in the request body
    const { email, userId } = req.body;
    if (!email || !userId) {
      return res.status(400).json({ message: "Bad Request: email and userId are required." });
    }

    // Fetch the user details from Supabase based on the email and userId
    const { data: userDetails, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", userId)
      .eq("email", email)
      .single();

    if (userError || !userDetails) {
      console.error("Error fetching user details:", userError?.message);
      return res.status(500).json({ message: "Error verifying user details." });
    }

    // Check if the user has a superadmin role (role === 0)
    if (userDetails.role !== 0) {
      return res.status(403).json({ message: "Forbidden: Only superadmins can access this resource." });
    }

    // Attach the user information to the request object
    req.user = {
      email: userDetails.email,
      id: userDetails.id,
      role: userDetails.role,  // Include the role if needed
    };

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error in authMiddleware:", err.message);
    res.status(500).json({ message: "Authentication failed. Please try again." });
  }
};

module.exports = authMiddleware;
