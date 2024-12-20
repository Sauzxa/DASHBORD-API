// /controllers/authcontrollers/signIn.controller.js
const supabase = require('../../config/supabaseClient');

// User Sign-In (Log In)
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'Email and password are required!'
    });
  }

  try {
    // Sign the user in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error signing in:', error.message);
      return res.status(400).send({ message: error.message });
    }

    // Get the JWT token
    const token = data.session.access_token;

    res.status(200).send({
      message: 'User signed in successfully!',
      token // Return the token to the client
    });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send({
      message: error.message || 'Some error occurred during sign-in.'
    });
  }
};
