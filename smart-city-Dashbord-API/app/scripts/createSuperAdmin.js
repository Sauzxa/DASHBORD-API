// Load environment variables
require('dotenv').config({ path: '../utils/.env' });

// Import the necessary module
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client instance
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createSuperAdmin() {
  const email = 'boumerdes@gmail.com';
  const password = '123'; // Plain password

  try {
    // Use Supabase Admin API to create a new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        role: 'superadmin', // Custom metadata to indicate superadmin role
      },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('Superadmin user created successfully:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Call the function to create the superadmin
createSuperAdmin();
