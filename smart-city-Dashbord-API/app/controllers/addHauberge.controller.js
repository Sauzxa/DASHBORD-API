const supabase = require("../config/supabaseClient");
const validator = require("validator"); // Import validator library
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// Create and Save a new Hauberg
exports.create = async (req, res) => {
  const {
    type,
    capacite,
    nom,
    emplacement,
    adresse,
    email,
    password,
    telephone,
    image_list,
    offres,
  } = req.body;

  // Validate required fields
  if (
    !type ||
    !capacite ||
    !nom ||
    !emplacement ||
    !adresse ||
    !email ||
    !password ||
    !telephone ||
    !image_list ||
    !offres
  ) {
    return res.status(400).send({
      message: "All fields are required!",
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).send({
      message: "Invalid email format.",
    });
  }

  // Validate capacite (must be an integer)
  if (!validator.isInt(String(capacite), { min: 1 })) {
    return res.status(400).send({
      message: "Capacite must be a positive integer.",
    });
  }

  // Validate telephone format
  if (!validator.isMobilePhone(telephone)) {
    return res.status(400).send({
      message: "Invalid telephone number format.",
    });
  }

  // Validate type (must be 'maison' or 'camp')
  if (!validator.isIn(type, ['maison', 'camp'])) {
    return res.status(400).send({
      message: "Type must be 'maison' or 'camp'.",
    });
  }

  try {
    // Check if a Hauberg with the same name already exists
    const { data: existingHauberg, error: checkError } = await supabase
      .from("hauberg")
      .select("*")
      .eq("nom", nom); // Check for existing Hauberg by name

    if (checkError) {
      console.error("Error checking data:", checkError.message);
      return res.status(500).send({
        message: checkError.message || "Error occurred while checking for existing Hauberg.",
      });
    }

    if (existingHauberg.length > 0) {
      return res.status(400).send({
        message: "A Hauberg with this name already exists.",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Proceed to insert the new Hauberg entry into Supabase
    const { data, error: insertError } = await supabase
      .from("hauberg")
      .insert([
        {
          type,           // Required
          capacite,       // Required
          nom,            // Required
          emplacement,    // Required
          adresse,        // Required
          email,          // Required
          password: hashedPassword, // Store the hashed password
          telephone,      // Required
          image_list,     // Required
          offres,         // Required
        },
      ]);

    if (insertError) {
      console.error("Error inserting data:", insertError.message);
      return res.status(500).send({
        message: insertError.message || "Error occurred while inserting new Hauberg data.",
      });
    }

    // Successfully inserted the new Hauberg data
    res.status(201).send({
      message: "Hauberg created successfully!",
      data: data, // Send back the inserted data
    });

  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Hauberg.",
    });
  }
};
