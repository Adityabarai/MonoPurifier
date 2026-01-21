const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Aditya@123";

function verifyToken(req, res, next) {
	let token = req.headers["authorization"];

	if (!token) {
		return res.status(403).json({
			message: "Please add token to the header",
		});
	}

	// Remove 'Bearer ' prefix if present
	if (token.startsWith("Bearer ")) {
		token = token.split(" ")[1];
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded; // Attach decoded user info to req.user
		next();
	} catch (err) {
		console.error("Token verification error:", err.message);
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	}
}

module.exports = { verifyToken };
