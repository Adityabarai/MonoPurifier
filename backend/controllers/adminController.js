const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "Aditya@123";

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const { data, error } = await supabase
      .from("admin_master")
      .select("*")
      .eq("username", username.trim())
      .single();

    if (error || !data) {
      console.error("DB error or admin not found:", error);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = data;

    // Compare password:
    // 1. Direct plain text match (if stored in DB as plain text, like 'aditya')
    // 2. Bcrypt compare (if stored as $2a$ / $2b$ hash)
    // 3. Fallback for administrator standard passwords ('aditya', 'Aditya@123', 'admin123')
    let isMatch = false;

    if (admin.password && password === admin.password) {
      isMatch = true;
    } else if (admin.password) {
      try {
        isMatch = await bcrypt.compare(password, admin.password);
      } catch (e) {
        isMatch = false;
      }
    }

    // Friendly master admin fallback
    if (
      !isMatch &&
      (admin.username === "admin" ||
        admin.emailid === "adityabarai40@gmail.com")
    ) {
      const allowedPasswords = ["aditya", "Aditya@123", "admin123"];
      if (allowedPasswords.includes(password)) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.inid, username: admin.username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.inid,
        username: admin.username,
        firstname: admin.firstname,
        lastname: admin.lastname,
        emailid: admin.emailid,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};