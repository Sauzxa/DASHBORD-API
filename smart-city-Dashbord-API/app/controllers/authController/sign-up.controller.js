// /controllers/authcontrollers/signUp.controller.js
const supabase = require('../../config/supabaseClient');

// User Sign-Up (Create Account)
exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'Email and password are required!'
    });
  }

  try {
    // Create the user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('Error signing up:', error.message);
      return res.status(400).send({ message: error.message });
    }

    res.status(200).send({
      message: 'User signed up successfully!',
      user: data.user // Return user data
    });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send({
      message: error.message || 'Some error occurred during sign-up.'
    });
  }
};
