const supabase = require("../config/db");

// ✅ Single function for CREATE and UPDATE
exports.addOrModifyProduct = async (req, res) => {
  try {
    const {
      product_id,       // if provided → UPDATE, if null/missing → CREATE
      name, category, badge, rating, reviews_count, price,
      original_price, discount_amount, capacity, image_url,
      technology, description,
    } = req.body;

    // Validate required fields for CREATE only
    if (!product_id && (!name || !category || !price)) {
      return res.status(400).json({
        message: "Name, category, and price are required for creating a product",
      });
    }

    const { v4: uuidv4 } = require("uuid");

    const { data, error } = await supabase.rpc("add_or_modify_product", {
      p_product_id: product_id ? parseInt(product_id) : null,
      p_guid: product_id ? null : uuidv4(),   // only needed for create
      p_name: name || null,
      p_category: category || null,
      p_badge: badge || null,
      p_rating: rating ? parseFloat(rating) : null,
      p_reviews_count: reviews_count ? parseInt(reviews_count) : null,
      p_price: price ? parseInt(price) : null,
      p_original_price: original_price ? parseInt(original_price) : null,
      p_discount_amount: discount_amount ? parseInt(discount_amount) : null,
      p_capacity: capacity || null,
      p_image_url: image_url || null,
      p_technology: technology || null,
      p_description: description || null,
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isUpdate = !!product_id;
    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Product updated successfully" : "Product created successfully",
      product: data[0],
    });

  } catch (error) {
    console.error("Error in addOrModifyProduct:", error);
    res.status(500).json({ message: "Error saving product", error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    const { data, error } = await supabase.rpc("get_all_products", {
      include_deleted: includeDeleted === "true",
    });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.rpc("get_product_by_id", {
      p_id: parseInt(id),
    });
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(data[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Soft delete (is_deleted = 1)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.rpc("delete_product", {
      p_id: parseInt(id),
    });
    if (error) throw error;
    res.json({ message: "Product deleted successfully", is_deleted: 1 });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Bulk soft delete
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }
    const { error } = await supabase.rpc("bulk_delete_products", {
      p_ids: ids,
    });
    if (error) throw error;
    res.json({
      message: `${ids.length} product(s) deleted successfully`,
      is_deleted: 1,
    });
  } catch (error) {
    console.error("Error bulk deleting:", error);
    res.status(500).json({ message: "Error deleting products", error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const file = req.file;
    const fileName = `products/${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("product-images")     
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    res.json({ image_url: urlData.publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
};