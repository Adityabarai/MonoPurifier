const fs = require("fs");
const path = require("path");
const supabase = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Single function for CREATE and UPDATE
exports.addOrModifyProduct = async (req, res) => {
  try {
    const {
      product_id, // if provided → UPDATE, if null/missing → CREATE
      name,
      category,
      badge,
      rating,
      reviews_count,
      price,
      original_price,
      discount_amount,
      capacity,
      image_url,
      technology,
      description,
    } = req.body;

    // Validate required fields for CREATE only
    if (!product_id && (!name || !category || !price)) {
      return res.status(400).json({
        message: "Name, category, and price are required for creating a product",
      });
    }

    let savedProduct = null;
    const isUpdate = !!product_id;

    // First attempt: try RPC function
    try {
      const { data, error } = await supabase.rpc("add_or_modify_product", {
        p_product_id: product_id ? parseInt(product_id) : null,
        p_guid: product_id ? null : uuidv4(),
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

      if (!error && data && data.length > 0) {
        savedProduct = data[0];
      }
    } catch (rpcErr) {
      console.warn("RPC add_or_modify_product failed, falling back to direct table query:", rpcErr.message);
    }

    // Direct table fallback if RPC was not available or threw constraint error
    if (!savedProduct) {
      if (isUpdate) {
        const updatePayload = {
          name: name || undefined,
          category: category || undefined,
          badge: badge || undefined,
          rating: rating ? parseFloat(rating) : undefined,
          reviews_count: reviews_count ? parseInt(reviews_count) : undefined,
          price: price ? parseInt(price) : undefined,
          original_price: original_price ? parseInt(original_price) : undefined,
          discount_amount: discount_amount ? parseInt(discount_amount) : undefined,
          capacity: capacity || undefined,
          image_url: image_url || undefined,
          technology: technology || undefined,
          description: description || undefined,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("product_master")
          .update(updatePayload)
          .eq("product_id", parseInt(product_id))
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          return res.status(404).json({ message: "Product not found" });
        }
        savedProduct = data[0];
      } else {
        // Create new product
        const { data: maxRows } = await supabase
          .from("product_master")
          .select("product_id")
          .order("product_id", { ascending: false })
          .limit(1);

        const nextId = (maxRows && maxRows.length > 0 ? maxRows[0].product_id : 0) + 1;

        const insertPayload = {
          product_id: nextId,
          product_guid: uuidv4(),
          name: name.trim(),
          category: category.trim(),
          badge: badge ? badge.trim() : null,
          rating: rating ? parseFloat(rating) : 4.5,
          reviews_count: reviews_count ? parseInt(reviews_count) : 0,
          price: parseInt(price),
          original_price: original_price ? parseInt(original_price) : null,
          discount_amount: discount_amount ? parseInt(discount_amount) : null,
          capacity: capacity ? capacity.trim() : null,
          image_url: image_url || null,
          technology: technology ? technology.trim() : null,
          description: description ? description.trim() : null,
          is_deleted: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("product_master")
          .insert(insertPayload)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Failed to insert product record");
        }
        savedProduct = data[0];
      }
    }

    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate
        ? "Product updated successfully"
        : "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error in addOrModifyProduct:", error);
    res
      .status(500)
      .json({ message: "Error saving product", error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let products = null;

    try {
      const { data, error } = await supabase.rpc("get_all_products", {
        include_deleted: includeDeleted === "true",
      });
      if (!error && data) {
        products = data;
      }
    } catch (_) {}

    if (!products) {
      let query = supabase.from("product_master").select("*");
      if (includeDeleted !== "true") {
        query = query.eq("is_deleted", 0);
      }
      const { data, error } = await query.order("product_id", { ascending: false });
      if (error) throw error;
      products = data || [];
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    try {
      const { data, error } = await supabase.rpc("get_product_by_id", {
        p_id: parseInt(id),
      });
      if (!error && data && data.length > 0) {
        product = data[0];
      }
    } catch (_) {}

    if (!product) {
      const { data, error } = await supabase
        .from("product_master")
        .select("*")
        .eq("product_id", parseInt(id))
        .single();
      if (error || !data) {
        return res.status(404).json({ message: "Product not found" });
      }
      product = data;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Delete product (supports soft delete and permanent delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const permanent = req.query.permanent === "true";

    let success = false;
    try {
      const { error } = await supabase.rpc("delete_product", {
        p_id: parseInt(id),
        permanent,
      });
      if (!error) success = true;
    } catch (_) {}

    if (!success) {
      if (permanent) {
        const { error } = await supabase
          .from("product_master")
          .delete()
          .eq("product_id", parseInt(id));
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("product_master")
          .update({ is_deleted: 1 })
          .eq("product_id", parseInt(id));
        if (error) throw error;
      }
    }

    res.json({
      message: permanent
        ? "Product permanently deleted"
        : "Product deleted successfully",
      is_deleted: permanent ? 2 : 1,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const ids = req.body.ids || req.body.data?.ids;
    const permanent =
      req.body.permanent === true || req.body.data?.permanent === true;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    let success = false;
    try {
      const { error } = await supabase.rpc("bulk_delete_products", {
        p_ids: ids,
        permanent,
      });
      if (!error) success = true;
    } catch (_) {}

    if (!success) {
      if (permanent) {
        const { error } = await supabase
          .from("product_master")
          .delete()
          .in("product_id", ids);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("product_master")
          .update({ is_deleted: 1 })
          .in("product_id", ids);
        if (error) throw error;
      }
    }

    res.json({
      message: `${ids.length} product(s) deleted successfully`,
      is_deleted: permanent ? 2 : 1,
    });
  } catch (error) {
    console.error("Error bulk deleting:", error);
    res
      .status(500)
      .json({ message: "Error deleting products", error: error.message });
  }
};

// Restore soft-deleted product
exports.restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let success = false;

    try {
      const { error } = await supabase.rpc("restore_product", {
        p_id: parseInt(id),
      });
      if (!error) success = true;
    } catch (_) {}

    if (!success) {
      const { error } = await supabase
        .from("product_master")
        .update({ is_deleted: 0 })
        .eq("product_id", parseInt(id));
      if (error) throw error;
    }

    res.json({ message: "Product restored successfully", is_deleted: 0 });
  } catch (error) {
    console.error("Error restoring product:", error);
    res
      .status(500)
      .json({ message: "Error restoring product", error: error.message });
  }
};

// Toggle product active status (1 = Active, 0 = Inactive)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    let success = false;

    try {
      const { error } = await supabase.rpc("update_product_status", {
        p_id: parseInt(id),
        action,
      });
      if (!error) success = true;
    } catch (_) {}

    if (!success) {
      const newStatus = action === "activate" ? 1 : 0;
      const { error } = await supabase
        .from("product_master")
        .update({ status: newStatus })
        .eq("product_id", parseInt(id));
      if (error) throw error;
    }

    res.json({
      message: `Product ${
        action === "activate" ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res
      .status(500)
      .json({ message: "Error updating product status", error: error.message });
  }
};

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const file = req.file;
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${cleanName}`;
    const storagePath = `products/${fileName}`;

    let imageUrl = null;

    // 1. If Supabase storage is available
    if (supabase && supabase.storage) {
      try {
        let uploadRes = await supabase.storage
          .from("product-images")
          .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        // If bucket does not exist, auto-create it and retry
        if (
          uploadRes.error &&
          (uploadRes.error.message?.includes("not found") ||
            uploadRes.error.statusCode === "404")
        ) {
          console.log("Bucket 'product-images' not found, creating automatically...");
          await supabase.storage.createBucket("product-images", {
            public: true,
            fileSizeLimit: 10485760,
          });
          uploadRes = await supabase.storage
            .from("product-images")
            .upload(storagePath, file.buffer, {
              contentType: file.mimetype,
              upsert: true,
            });
        }

        if (!uploadRes.error) {
          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(storagePath);
          imageUrl = urlData?.publicUrl;
        } else {
          console.warn(
            "Supabase storage upload error, falling back to local storage:",
            uploadRes.error.message
          );
        }
      } catch (storageErr) {
        console.warn(
          "Supabase storage exception, falling back to local storage:",
          storageErr.message
        );
      }
    }

    // 2. Fallback to local uploads directory if Supabase storage failed or unavailable
    if (!imageUrl) {
      const uploadsDir = path.join(__dirname, "../uploads/products");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(localFilePath, file.buffer);
      imageUrl = `/uploads/products/${fileName}`;
    }

    res.json({ image_url: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};