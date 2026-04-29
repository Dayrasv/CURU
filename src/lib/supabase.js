import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://izpjpvawfipeyrbrldav.supabase.co";
const supabaseKey = " sb_publishable_7I6RPKTZgc0lxycww9Fx9A_Hn-hU7xw";

export const supabase = createClient(supabaseUrl, supabaseKey);



