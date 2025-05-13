import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve Supabase credentials from environment variables
const SUPABASE_URI = process.env.SUPABASE_URI;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Check if credentials are missing
if (!SUPABASE_URI || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URI or Anon Key is missing in environment variables.');
}

// Initialize and export the Supabase client
const supabase = createClient(SUPABASE_URI, SUPABASE_ANON_KEY);

export default supabase;