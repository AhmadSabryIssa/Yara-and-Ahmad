/* =========================================================
   SUPABASE CONNECTION
   =========================================================
   Replace the two placeholder values below with the values
   from your Supabase project.

   IMPORTANT:
   - Use the PROJECT URL.
   - Use the PUBLISHABLE key (or legacy anon key).
   - NEVER put a service_role/secret key in this file.
========================================================= */

const SUPABASE_URL = "https://okwvndbcvxaxppfptbxs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_R-tsw0trvHgtS30VGaVXnA_f2i-NGYl";

const weddingDbConfigured =
    Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

let weddingDb = null;

if (weddingDbConfigured) {
    weddingDb = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}
