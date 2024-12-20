require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const supabase = require('./app/config/supabaseClient'); // Ensure this file uses env variables
const { create } = require("./app/controllers/addHauberge.controller");
const { delete: deleteHauberg } = require("./app/controllers/deleteHauberg.controller");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Use built-in Express middleware for JSON

// Route to fetch all Hauberg data (rows)
app.get("/haubergs", async (req, res) => {
  try {
    const { data, error } = await supabase.from("hauberg").select("*"); // Fetch all Haubergs
    if (error) {
      console.error("Error fetching Hauberg data:", error.message);
      return res.status(500).send({ message: error.message || "Error fetching Haubergs" });
    }
    res.json(data); // Send back all Haubergs
  } catch (err) {
    console.error("Error occurred:", err.message);
    res.status(500).send({ message: "Some error occurred while fetching Hauberg data." });
  }
});

// Route to create a new Hauberg
app.post("/haubergs", create);

// Route to delete a Hauberg by ID
app.delete("/haubergs/:id", deleteHauberg);

// Basic route for testing
app.get("/test", (req, res) => {
  res.send("Welcome to the Hauberge API!");
});

// Error handling middleware for 404 not found
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found. Please check the URL and try again." });
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Set the port, default to 4000 if not provided in .env
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
