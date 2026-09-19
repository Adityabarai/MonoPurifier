const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Initial seed data
const initialSeed = {
  admin_master: [
    {
      inid: 1,
      username: "admin",
      // Bcrypt hash for password: "admin123"
      password: "$2b$10$dU0/fXz5tM87Y.tazollxeCqyN57fhEjp95wYqcakE3fl/s7yrI2e",
      firstname: "Admin",
      lastname: "User",
      emailid: "admin@monopurifier.com",
      created_at: new Date().toISOString(),
    },
  ],
  products: [
    {
      product_id: 1,
      guid: "aqua-ro-elite-001",
      name: "AquaPure RO Elite",
      category: "RO Purifier",
      badge: "Best Seller",
      rating: 4.8,
      reviews_count: 245,
      price: 12999,
      original_price: 16999,
      discount_amount: 4000,
      capacity: "10L Storage Tank",
      image_url: "/uploads/products/aquapure_ro_elite.png",
      technology: "7-Stage RO + UV + UF + TDS",
      description: "Premium 7-stage RO purifier with smart LED display and active copper technology for clean, healthy drinking water.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      product_id: 2,
      guid: "aqua-uv-pro-002",
      name: "AquaPure UV Pro",
      category: "UV Purifier",
      badge: "Popular",
      rating: 4.6,
      reviews_count: 189,
      price: 8999,
      original_price: 11999,
      discount_amount: 3000,
      capacity: "8L Capacity",
      image_url: "/uploads/products/aquapure_uv_pro.png",
      technology: "UV + UF Technology",
      description: "Energy efficient UV + UF purifier kills 99.9% germs and bacteria with auto shut-off function.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      product_id: 3,
      guid: "aqua-copper-plus-003",
      name: "AquaPure Copper+",
      category: "RO Purifier",
      badge: "Premium",
      rating: 4.9,
      reviews_count: 312,
      price: 15999,
      original_price: 19999,
      discount_amount: 4000,
      capacity: "12L Storage",
      image_url: "/uploads/products/aquapure_copper_plus.png",
      technology: "RO + UV + Copper + Alkaline",
      description: "Infuses health benefits of copper and alkaline minerals into pure RO water for enhanced digestion and immunity.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      product_id: 4,
      guid: "aqua-compact-004",
      name: "AquaPure Compact",
      category: "Wall Mount RO",
      badge: "New",
      rating: 4.5,
      reviews_count: 156,
      price: 9999,
      original_price: 12999,
      discount_amount: 3000,
      capacity: "6L Tank",
      image_url: "/uploads/products/aquapure_compact.png",
      technology: "6-Stage Compact RO",
      description: "Space saving sleek wall-mount design with 6-stage purification, perfect for modern compact modular kitchens.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      product_id: 5,
      guid: "aqua-alkaline-max-005",
      name: "AquaPure Alkaline Max",
      category: "Alkaline RO",
      badge: "Premium",
      rating: 5.0,
      reviews_count: 98,
      price: 18999,
      original_price: 22999,
      discount_amount: 4000,
      capacity: "15L Capacity",
      image_url: "/uploads/products/aquapure_alkaline_max.png",
      technology: "9-Stage Alkaline + Copper",
      description: "Ultimate health purification with pH balancing alkaline filters and smartphone app telemetry integration.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      product_id: 6,
      guid: "aqua-basic-006",
      name: "AquaPure Basic",
      category: "UV Purifier",
      badge: "Budget",
      rating: 4.3,
      reviews_count: 234,
      price: 5999,
      original_price: 7999,
      discount_amount: 2000,
      capacity: "5L Storage",
      image_url: "/uploads/products/aquapure_basic.png",
      technology: "UV Purification",
      description: "Reliable and budget-friendly purification for municipal tap water supplies with low maintenance costs.",
      status: 1,
      is_deleted: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  leads: [],
};

// Read database
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), "utf8");
    return JSON.parse(JSON.stringify(initialSeed));
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, re-initializing:", err.message);
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), "utf8");
    return JSON.parse(JSON.stringify(initialSeed));
  }
}

// Write database atomically
function writeDb(data) {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmpFile, DB_FILE);
}

// Local Database Adapter mirroring Supabase Client interface
const localDb = {
  isLocal: true,

  from(table) {
    const db = readDb();
    let records = db[table] || [];

    return {
      select(fields = "*") {
        let filtered = [...records];
        const chain = {
          eq(column, value) {
            filtered = filtered.filter((r) => String(r[column]) === String(value));
            return chain;
          },
          async single() {
            if (filtered.length === 0) {
              return { data: null, error: { message: "Record not found" } };
            }
            return { data: filtered[0], error: null };
          },
          async then(resolve, reject) {
            resolve({ data: filtered, error: null });
          },
        };
        return chain;
      },

      async insert(newRecord) {
        const db = readDb();
        if (!db[table]) db[table] = [];
        const record = {
          ...newRecord,
          id: db[table].length > 0 ? Math.max(...db[table].map((r) => r.id || r.inid || r.lead_id || 0)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        db[table].push(record);
        writeDb(db);
        return { data: [record], error: null };
      },

      update(updateData) {
        let conditionCol = null;
        let conditionVal = null;
        const chain = {
          eq(column, value) {
            conditionCol = column;
            conditionVal = value;
            return chain;
          },
          async then(resolve, reject) {
            const db = readDb();
            let tableRecords = db[table] || [];
            let updatedRecords = [];
            tableRecords = tableRecords.map((r) => {
              if (
                conditionCol &&
                String(r[conditionCol]) === String(conditionVal)
              ) {
                const updated = {
                  ...r,
                  ...updateData,
                  updated_at: new Date().toISOString(),
                };
                updatedRecords.push(updated);
                return updated;
              }
              return r;
            });
            db[table] = tableRecords;
            writeDb(db);
            resolve({ data: updatedRecords, error: null });
          },
        };
        return chain;
      },

      delete() {
        let conditionCol = null;
        let conditionVal = null;
        const chain = {
          eq(column, value) {
            conditionCol = column;
            conditionVal = value;
            return chain;
          },
          async then(resolve, reject) {
            const db = readDb();
            let tableRecords = db[table] || [];
            tableRecords = tableRecords.filter(
              (r) => !conditionCol || String(r[conditionCol]) !== String(conditionVal)
            );
            db[table] = tableRecords;
            writeDb(db);
            resolve({ data: null, error: null });
          },
        };
        return chain;
      },
    };
  },

  async rpc(functionName, params = {}) {
    const db = readDb();

    switch (functionName) {
      case "get_all_products": {
        let list = db.products || [];
        if (!params.include_deleted) {
          list = list.filter((p) => p.is_deleted === 0);
        }
        // sort by product_id DESC
        list = [...list].sort((a, b) => b.product_id - a.product_id);
        return { data: list, error: null };
      }

      case "get_product_by_id": {
        const product = (db.products || []).find(
          (p) => String(p.product_id) === String(params.p_id)
        );
        return { data: product ? [product] : [], error: null };
      }

      case "add_or_modify_product": {
        const {
          p_product_id,
          p_guid,
          p_name,
          p_category,
          p_badge,
          p_rating,
          p_reviews_count,
          p_price,
          p_original_price,
          p_discount_amount,
          p_capacity,
          p_image_url,
          p_technology,
          p_description,
        } = params;

        let products = db.products || [];
        let resultProduct;

        if (p_product_id) {
          // UPDATE
          const index = products.findIndex(
            (p) => String(p.product_id) === String(p_product_id)
          );
          if (index === -1) {
            return { data: [], error: { message: "Product not found" } };
          }

          const existing = products[index];
          resultProduct = {
            ...existing,
            name: p_name !== null && p_name !== undefined ? p_name : existing.name,
            category: p_category !== null && p_category !== undefined ? p_category : existing.category,
            badge: p_badge !== null && p_badge !== undefined ? p_badge : existing.badge,
            rating: p_rating !== null && p_rating !== undefined ? p_rating : existing.rating,
            reviews_count: p_reviews_count !== null && p_reviews_count !== undefined ? p_reviews_count : existing.reviews_count,
            price: p_price !== null && p_price !== undefined ? p_price : existing.price,
            original_price: p_original_price !== null && p_original_price !== undefined ? p_original_price : existing.original_price,
            discount_amount: p_discount_amount !== null && p_discount_amount !== undefined ? p_discount_amount : existing.discount_amount,
            capacity: p_capacity !== null && p_capacity !== undefined ? p_capacity : existing.capacity,
            image_url: p_image_url !== null && p_image_url !== undefined ? p_image_url : existing.image_url,
            technology: p_technology !== null && p_technology !== undefined ? p_technology : existing.technology,
            description: p_description !== null && p_description !== undefined ? p_description : existing.description,
            updated_at: new Date().toISOString(),
          };
          products[index] = resultProduct;
        } else {
          // CREATE
          const maxId = products.reduce((max, p) => (p.product_id > max ? p.product_id : max), 0);
          resultProduct = {
            product_id: maxId + 1,
            guid: p_guid || `product-${Date.now()}`,
            name: p_name || "New Product",
            category: p_category || "Water Purifier",
            badge: p_badge || null,
            rating: p_rating !== null && p_rating !== undefined ? p_rating : 4.5,
            reviews_count: p_reviews_count !== null && p_reviews_count !== undefined ? p_reviews_count : 0,
            price: p_price || 0,
            original_price: p_original_price || p_price || 0,
            discount_amount: p_discount_amount || 0,
            capacity: p_capacity || "",
            image_url: p_image_url || "",
            technology: p_technology || "",
            description: p_description || "",
            status: 1,
            is_deleted: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          products.unshift(resultProduct);
        }

        db.products = products;
        writeDb(db);
        return { data: [resultProduct], error: null };
      }

      case "delete_product": {
        let products = db.products || [];
        if (params.permanent) {
          products = products.filter(
            (p) => String(p.product_id) !== String(params.p_id)
          );
        } else {
          const index = products.findIndex(
            (p) => String(p.product_id) === String(params.p_id)
          );
          if (index !== -1) {
            products[index].is_deleted = 1;
            products[index].updated_at = new Date().toISOString();
          }
        }
        db.products = products;
        writeDb(db);
        return { error: null };
      }

      case "bulk_delete_products": {
        let products = db.products || [];
        const ids = (params.p_ids || []).map((id) => String(id));
        if (params.permanent) {
          products = products.filter((p) => !ids.includes(String(p.product_id)));
        } else {
          products = products.map((p) => {
            if (ids.includes(String(p.product_id))) {
              return { ...p, is_deleted: 1, updated_at: new Date().toISOString() };
            }
            return p;
          });
        }
        db.products = products;
        writeDb(db);
        return { error: null };
      }

      case "restore_product": {
        let products = db.products || [];
        const ids = params.p_ids
          ? params.p_ids.map((id) => String(id))
          : [String(params.p_id)];
        products = products.map((p) => {
          if (ids.includes(String(p.product_id))) {
            return { ...p, is_deleted: 0, updated_at: new Date().toISOString() };
          }
          return p;
        });
        db.products = products;
        writeDb(db);
        return { error: null };
      }

      case "update_product_status": {
        let products = db.products || [];
        const ids = params.p_ids
          ? params.p_ids.map((id) => String(id))
          : [String(params.p_id)];
        const newStatus = params.action === "activate" ? 1 : 0;
        products = products.map((p) => {
          if (ids.includes(String(p.product_id))) {
            return { ...p, status: newStatus, updated_at: new Date().toISOString() };
          }
          return p;
        });
        db.products = products;
        writeDb(db);
        return { error: null };
      }

      default:
        return { data: null, error: { message: `Unknown RPC function: ${functionName}` } };
    }
  },

  storage: {
    from(bucketName) {
      return {
        async upload(fileName, fileBuffer, options = {}) {
          try {
            const targetPath = path.join(UPLOAD_DIR, fileName);
            const targetDir = path.dirname(targetPath);
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.writeFileSync(targetPath, fileBuffer);
            return { data: { path: fileName }, error: null };
          } catch (err) {
            return { data: null, error: err };
          }
        },
        getPublicUrl(fileName) {
          // Normalize forward slashes for URLs
          const normalized = fileName.replace(/\\/g, "/");
          return {
            data: {
              publicUrl: `/uploads/${normalized}`,
            },
          };
        },
      };
    },
  },
};

module.exports = localDb;
