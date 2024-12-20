const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();  // Ensure dotenv is loaded

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase URL or Key is missing!");
  process.exit(1); // Exit the process if there is no URL or Key
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
