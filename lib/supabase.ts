
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.https://blobvpevlltzpqdeyhzl.supabase.co;
const supabaseKey = process.env.sb_publishable_ZndTbRYePSuLXfCSTkurhg_TVyn22C-;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Check .env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
