const fs = require("fs");
const path = require("path");
const supabase = require("../config/db");

const DATA_DIR = path.join(__dirname, "..", "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "hero");

const DEFAULT_HERO_IMAGE = "/products/aquapure_copper_plus.png";

// Ensure upload & data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// In-memory cache
let cachedSettings = null;

// Read settings helper
async function readSettings() {
  if (cachedSettings) return cachedSettings;

  // 1. Try to read from local file
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
      cachedSettings = JSON.parse(raw);
      if (cachedSettings && cachedSettings.hero_image) {
        return cachedSettings;
      }
    } catch (e) {
      console.warn("Error parsing settings.json:", e.message);
    }
  }

  // 2. Try to read from Supabase storage if available
  if (supabase && supabase.storage) {
    try {
      const dl = await supabase.storage
        .from("product-images")
        .download("site-settings.json");
      if (dl.data) {
        const text = await dl.data.text();
        const parsed = JSON.parse(text);
        if (parsed && parsed.hero_image) {
          cachedSettings = parsed;
          try {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify(parsed, null, 2), "utf8");
          } catch (_) {}
          return cachedSettings;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Fallback to default
  cachedSettings = {
    hero_image: DEFAULT_HERO_IMAGE,
    updated_at: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(cachedSettings, null, 2), "utf8");
  } catch (_) {}

  return cachedSettings;
}

// Write settings helper
async function writeSettings(newSettings) {
  cachedSettings = {
    ...newSettings,
    updated_at: new Date().toISOString(),
  };

  // 1. Write to local file atomically
  try {
    const tmpFile = `${SETTINGS_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(cachedSettings, null, 2), "utf8");
    fs.renameSync(tmpFile, SETTINGS_FILE);
  } catch (err) {
    console.error("Failed to write local settings.json:", err.message);
  }

  // 2. Write to Supabase Storage if available
  if (supabase && supabase.storage) {
    try {
      const content = Buffer.from(JSON.stringify(cachedSettings, null, 2));
      await supabase.storage
        .from("product-images")
        .upload("site-settings.json", content, {
          upsert: true,
          contentType: "application/json",
        });
    } catch (storageErr) {
      console.warn("Supabase storage sync notice:", storageErr.message);
    }
  }

  return cachedSettings;
}

// GET /api/settings/hero-image
exports.getHeroImage = async (req, res) => {
  try {
    const settings = await readSettings();
    res.json({
      success: true,
      image_url: settings.hero_image || DEFAULT_HERO_IMAGE,
      updated_at: settings.updated_at || null,
    });
  } catch (error) {
    console.error("Error fetching hero image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero image settings",
      image_url: DEFAULT_HERO_IMAGE,
    });
  }
};

// POST /api/settings/hero-image
exports.updateHeroImage = async (req, res) => {
  try {
    let newImageUrl = null;

    // A. File Upload via multer
    if (req.file) {
      const file = req.file;
      const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `hero_${Date.now()}_${cleanName}`;
      const storagePath = `hero/${fileName}`;

      // Try Supabase Storage first
      if (supabase && supabase.storage) {
        try {
          const uploadRes = await supabase.storage
            .from("product-images")
            .upload(storagePath, file.buffer, {
              contentType: file.mimetype,
              upsert: true,
            });

          if (!uploadRes.error) {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(storagePath);
            newImageUrl = urlData?.publicUrl;
          }
        } catch (storageErr) {
          console.warn("Supabase hero image upload notice:", storageErr.message);
        }
      }

      // Local fallback
      if (!newImageUrl) {
        const localPath = path.join(UPLOAD_DIR, fileName);
        fs.writeFileSync(localPath, file.buffer);
        newImageUrl = `/uploads/hero/${fileName}`;
      }
    } else if (req.body && req.body.image_url) {
      // B. Direct URL passed in JSON
      newImageUrl = req.body.image_url.trim();
    }

    if (!newImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image file or an image URL",
      });
    }

    const currentSettings = await readSettings();
    const updated = await writeSettings({
      ...currentSettings,
      hero_image: newImageUrl,
    });

    res.json({
      success: true,
      message: "Home page main section image updated successfully!",
      image_url: updated.hero_image,
      updated_at: updated.updated_at,
    });
  } catch (error) {
    console.error("Error updating hero image:", error);
    res.status(500).json({
      success: false,
      message: "Error updating hero image",
      error: error.message,
    });
  }
};

// POST /api/settings/hero-image/reset
exports.resetHeroImage = async (req, res) => {
  try {
    const currentSettings = await readSettings();
    const updated = await writeSettings({
      ...currentSettings,
      hero_image: DEFAULT_HERO_IMAGE,
    });

    res.json({
      success: true,
      message: "Hero section image restored to default flagship model!",
      image_url: DEFAULT_HERO_IMAGE,
      updated_at: updated.updated_at,
    });
  } catch (error) {
    console.error("Error resetting hero image:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting hero image",
      error: error.message,
    });
  }
};
