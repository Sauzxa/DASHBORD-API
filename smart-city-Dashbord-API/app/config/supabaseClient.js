require('dotenv').config({ path: './config/.env' });  // Specify the correct path
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL =  'https://opapfnetafzmdincqsxl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYXBmbmV0YWZ6bWRpbmNxc3hsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY0OTg4OSwiZXhwIjoyMDUwMjI1ODg5fQ.do0N7D4Eb1gU_5vBLzITCBb22TB_iGGA5UJ319NKjzE';

if (!SUPABASE_URL || ! SUPABASE_KEY) {
  console.error("Supabase URL or Key is missing!");
  process.exit(1); // Exit the process if there is no URL or Key
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
