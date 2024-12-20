const express = require("express");
const router = express.Router();

// Import controllers
const { create } = require("../controllers/addHauberge.controller");
const { delete: deleteHauberg } = require("../controllers/deleteHauberge.controller");

// POST route to create a new Hauberg
router.post("/create", create);

// DELETE route to delete a Hauberg by ID
router.delete("/delete/:id", deleteHauberg);

module.exports = router;
