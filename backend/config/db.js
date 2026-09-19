const { createClient } = require("@supabase/supabase-js");
const localDb = require("./localDb");

let db;

const hasSupabaseCreds =
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
  !process.env.SUPABASE_URL.includes("your-project");

if (hasSupabaseCreds) {
  try {
    db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log("✅ Supabase Cloud client initialized");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase, falling back to Local Database:", err.message);
    db = localDb;
  }
} else {
  console.log("ℹ️ No Supabase credentials found. Running with ✅ Local Database Engine (zero-setup mode)");
  db = localDb;
}

module.exports = db;