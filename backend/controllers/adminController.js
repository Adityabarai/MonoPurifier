const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const supabase = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "Aditya@123";

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const { data, error } = await supabase
      .from("admin_master")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      console.error("DB error:", error);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = data;

    // ✅ bcrypt compare (password is hashed in DB)
    const isMatch = await bcrypt.compare(password, admin.password);
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