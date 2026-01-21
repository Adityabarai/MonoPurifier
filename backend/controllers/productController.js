const pool = require("../config/db");

// Get all products (excluding soft-deleted by default)
exports.getAllProducts = async (req, res) => {
	try {
		const { includeDeleted } = req.query;

		let query = "SELECT * FROM products";
		const conditions = [];
		if (includeDeleted !== "true") {
			conditions.push("is_deleted = 0");
		}
		if (conditions.length > 0) {
			query += " WHERE " + conditions.join(" AND ");
		}
		query += " ORDER BY product_id DESC";
		const result = await pool.query(query);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Error fetching products" });
	}
};

// Get single product by ID
exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM products WHERE product_id = $1",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ message: "Error fetching product" });
	}
};

exports.createProduct = async (req, res) => {
	try {
		const {
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
			status,
		} = req.body;

		// Validate required fields
		if (!name || !category || !price) {
			return res.status(400).json({
				message: "Name, category, and price are required fields",
			});
		}

		// Parse numeric values to ensure correct data types
		const parsedRating = rating ? parseFloat(rating) : null;
		const parsedReviewsCount = reviews_count ? parseInt(reviews_count) : 0;
		const parsedPrice = parseInt(price) || 0;
		const parsedOriginalPrice = original_price
			? parseInt(original_price)
			: null;
		const parsedDiscountAmount = discount_amount
			? parseInt(discount_amount)
			: null;
		const parsedStatus = status !== undefined ? parseInt(status) : 1;

		// Generate a new UUID for product_guid
		const { v4: uuidv4 } = require("uuid");
		const product_guid = uuidv4();

		// Insert product with status and is_deleted
		const result = await pool.query(
			`INSERT INTO products (
				product_guid, name, category, badge, rating, reviews_count, price, 
				original_price, discount_amount, capacity, image_url, 
				technology, description, status, is_deleted, created_at, updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 0, NOW(), NOW()) 
			RETURNING *`,
			[
				product_guid,
				name,
				category,
				badge || null,
				parsedRating,
				parsedReviewsCount,
				parsedPrice,
				parsedOriginalPrice,
				parsedDiscountAmount,
				capacity || null,
				image_url || null,
				technology || null,
				description || null,
				parsedStatus,
			]
		);

		res.status(201).json({
			message: "Product created successfully",
			product: result.rows[0],
		});
	} catch (error) {
		console.error("Error creating product:", error);
		console.error("Error details:", error.message);
		console.error("Error code:", error.code);

		// More specific error messages
		if (error.code === "23505") {
			res
				.status(400)
				.json({ message: "Product with this name already exists" });
		} else if (error.code === "23502") {
			res.status(400).json({
				message: "Required field is missing",
				detail: error.detail || error.message,
			});
		} else if (error.code === "22P02") {
			res.status(400).json({
				message:
					"Invalid data type for one or more fields. Check numeric fields.",
			});
		} else {
			res.status(500).json({
				message: "Error creating product",
				error: error.message,
			});
		}
	}
};

// Update product
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const {
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
			status,
		} = req.body;

		// Check if product exists and is not deleted
		const checkResult = await pool.query(
			"SELECT * FROM products WHERE product_id = $1",
			[id]
		);

		if (checkResult.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (checkResult.rows[0].is_deleted === 1) {
			return res.status(400).json({
				message: "Cannot update a deleted product. Please restore it first.",
			});
		}

		const result = await pool.query(
			`UPDATE products SET 
				name = COALESCE($1, name),
				category = COALESCE($2, category),
				badge = COALESCE($3, badge),
				rating = COALESCE($4, rating),
				reviews_count = COALESCE($5, reviews_count),
				price = COALESCE($6, price),
				original_price = COALESCE($7, original_price),
				discount_amount = COALESCE($8, discount_amount),
				capacity = COALESCE($9, capacity),
				image_url = COALESCE($10, image_url),
				technology = COALESCE($11, technology),
				description = COALESCE($12, description),
				status = COALESCE($13, status),
				updated_at = NOW()
			WHERE product_id = $14 
			RETURNING *`,
			[
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
				status,
				id,
			]
		);

		res.json({
			message: "Product updated successfully",
			product: result.rows[0],
		});
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ message: "Error updating product" });
	}
};

// Soft delete product
exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { permanent } = req.query;

		// Check if product exists
		const checkResult = await pool.query(
			"SELECT * FROM products WHERE product_id = $1",
			[id]
		);

		if (checkResult.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		let result;
		if (permanent === "true") {
			// Permanent delete
			result = await pool.query(
				"DELETE FROM products WHERE product_id = $1 RETURNING *",
				[id]
			);
			res.json({
				message: "Product permanently deleted successfully",
				permanent: true,
			});
		} else {
			// Soft delete
			result = await pool.query(
				"UPDATE products SET is_deleted = 1, updated_at = NOW() WHERE product_id = $1 RETURNING *",
				[id]
			);
			res.json({
				message: "Product soft deleted successfully",
				permanent: false,
			});
		}
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Error deleting product" });
	}
};

// Toggle product status (Active/Inactive)
exports.ProductStatus = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			`UPDATE products 
			SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END,
			    updated_at = NOW()
			WHERE product_id = $1 
			RETURNING *`,
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json({
			message: `Product ${
				result.rows[0].status === 1 ? "activated" : "deactivated"
			} successfully`,
			product: result.rows[0],
		});
	} catch (error) {
		console.error("Error toggling product status:", error);
		res.status(500).json({ message: "Error toggling product status" });
	}
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
	try {
		const { ids, permanent } = req.body;

		if (!ids || !Array.isArray(ids) || ids.length === 0) {
			return res.status(400).json({ message: "No product IDs provided" });
		}

		let result;
		if (permanent === true) {
			// Permanent delete
			result = await pool.query(
				"DELETE FROM products WHERE product_id = ANY($1) RETURNING *",
				[ids]
			);
		} else {
			// Soft delete
			result = await pool.query(
				"UPDATE products SET is_deleted = 1, updated_at = NOW() WHERE product_id = ANY($1) RETURNING *",
				[ids]
			);
		}

		res.json({
			message: `${result.rows.length} product(s) ${
				permanent ? "permanently deleted" : "soft deleted"
			} successfully`,
			permanent: permanent || false,
		});
	} catch (error) {
		console.error("Error bulk deleting products:", error);
		res.status(500).json({ message: "Error deleting products" });
	}
};
