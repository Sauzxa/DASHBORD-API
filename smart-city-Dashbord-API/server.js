const express = require("express");
const cors = require("cors");
const supabase = require('./app/config/supabaseClient');
const { create } = require("./app/controllers/addHauberge.controller");
const { delete: deleteHauberg } = require("./app/controllers/deleteHauberg.controller");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Login route to authenticate superadmin with hardcoded credentials
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the provided email and password match the superadmin credentials
  if (email === "boumerdes@gmail.com" && password === "123") {
    try {
      // Fetch all Hauberg data if credentials are valid
      const { data, error } = await supabase.from("hauberg").select("*");
      if (error) {
        console.error("Error fetching Hauberg data:", error.message);
        return res.status(500).json({ message: "Error fetching Haubergs" });
      }
      // Return Hauberg data along with a success message
      return res.status(200).json({ message: "Login successful. Superadmin authenticated.", haubergs: data });
    } catch (err) {
      console.error("Error occurred:", err.message);
      return res.status(500).json({ message: "Some error occurred while fetching Hauberg data." });
    }
  } else {
    return res.status(401).json({ message: "Invalid email or password." });
  }
});


// Route to fetch all Hauberg data (protected for superadmin)
app.get("/haubergs", async (req, res) => {
  const { email, password } = req.body;

  // Check for superadmin credentials
  if (email === "boumerdes@gmail.com" && password === "123") {
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
  } else {
    return res.status(403).json({ message: "Access denied. Superadmin role required." });
  }
});

// Route to create a new Hauberg (protected for superadmin)
app.post("/haubergs", async (req, res) => {
  const { email, password } = req.body;

  // Check for superadmin credentials
  if (email === "boumerdes@gmail.com" && password === "123") {
    await create(req, res);
  } else {
    return res.status(403).json({ message: "Access denied. Superadmin role required." });
  }
});

// Route to delete a Hauberg by ID (protected for superadmin)
app.delete("/haubergs/:id", async (req, res) => {
  const { email, password } = req.body;

  // Check for superadmin credentials
  if (email === "boumerdes@gmail.com" && password === "123") {
    await deleteHauberg(req, res);
  } else {
    return res.status(403).json({ message: "Access denied. Superadmin role required." });
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
