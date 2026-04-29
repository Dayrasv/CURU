import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://izpjpvawfipeyrbrldav.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cGpwdmF3ZmlwZXlyYnJsZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODQwNTgsImV4cCI6MjA5Mjg2MDA1OH0.yfYH4n9rwRmJhEOCVVxtqCm0Lnx6OxqbkF77NMoo5V0";

export const supabase = createClient(supabaseUrl, supabaseKey);



