const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "Aditya@123";

exports.adminLogin = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: "Username and password are required",
			});
		}

		// Query admin from database - FIXED TABLE NAME
		const result = await pool.query(
			"SELECT * FROM admin_master WHERE username = $1",
			[username]
		);

		if (result.rows.length === 0) {
			return res.status(401).json({
				message: "Invalid credentials",
			});
		}

		const admin = result.rows[0];

		// Decode the binary password to compare
		// Assuming password is stored as BYTEA and contains plain text "admin"
		let storedPassword;
		if (admin.password instanceof Buffer) {
			storedPassword = admin.password.toString();
		} else if (typeof admin.password === "string") {
			// If it's already a string
			storedPassword = admin.password;
		} else {
			// If it's in some other format, try to decode
			storedPassword = Buffer.from(admin.password).toString();
		}

		// Clean up any null characters or extra spaces
		storedPassword = storedPassword.replace(/\0/g, "").trim();

		if (storedPassword !== password) {
			console.log("Password mismatch:", storedPassword, password);
			return res.status(401).json({
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign(
			{
				id: admin.inid, // Changed from admin.id to admin.inid
				username: admin.username,
				role: "admin",
			},
			JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.json({
			message: "Login successful",
			token,
			admin: {
				id: admin.inid, // Changed from admin.id to admin.inid
				username: admin.username,
				firstname: admin.firstname,
				lastname: admin.lastname,
				emailid: admin.emailid,
			},
		});
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({
			message: "Error during login",
			error: error.message,
		});
	}
};
 