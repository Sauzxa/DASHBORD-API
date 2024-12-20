require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const supabase = require('./app/config/supabaseClient'); // Ensure this file uses env variables
const { create } = require("./app/controllers/addHauberge.controller");
const { delete: deleteHauberg } = require("./app/controllers/deleteHauberg.controller");
const authMiddleware = require("./app/middleware/authMiddleware"); // Include auth middleware

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Use built-in Express middleware for JSON

// Helper function to check superadmin with email, password, and ID
const checkSuperAdmin = async (email, password, userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password, role")
    .eq("email", email)
    .eq("password", password) // Ensure passwords are hashed and validated securely
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    throw new Error("Could not verify superadmin credentials.");
  }

  return data.role === 0; // Return true if role is superadmin (role = 0)
};

// Route to fetch all Hauberg data (public route)
app.get("/haubergs", async (req, res) => {
  try {
    const { data, error } = await supabase.from("hauberg").select("*");
    if (error) {
      console.error("Error fetching Hauberg data:", error.message);
      return res.status(500).json({ message: error.message || "Error fetching Haubergs" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error occurred:", err.message);
    res.status(500).json({ message: "Some error occurred while fetching Hauberg data." });
  }
});

// Route to create a new Hauberg (protected route)
app.post("/haubergs", authMiddleware, async (req, res) => {
  try {
    const { email, password, id } = req.user; // Extract user info from middleware

    const isSuperAdmin = await checkSuperAdmin(email, password, id);
    if (!isSuperAdmin) {
      return res.status(403).json({ message: "Access denied: Superadmin role required." });
    }

    await create(req, res);
  } catch (err) {
    console.error("Error occurred while creating Hauberg:", err.message);
    res.status(500).json({ message: "Error creating Hauberg." });
  }
});

// Route to delete a Hauberg by ID (protected route)
app.delete("/haubergs/:id", authMiddleware, async (req, res) => {
  try {
    const { email, password, id } = req.user; // Extract user info from middleware

    const isSuperAdmin = await checkSuperAdmin(email, password, id);
    if (!isSuperAdmin) {
      return res.status(403).json({ message: "Access denied: Superadmin role required." });
    }

    await deleteHauberg(req, res);
  } catch (err) {
    console.error("Error occurred while deleting Hauberg:", err.message);
    res.status(500).json({ message: "Error deleting Hauberg." });
  }
});

// Basic route for testing
app.get("/test", (req, res) => {
  res.status(200).send("Welcome to the Hauberge API!");
});

// Error handling middleware for 404 not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found. Please check the URL and try again." });
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Set the port, default to 4000 if not provided in .env
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
