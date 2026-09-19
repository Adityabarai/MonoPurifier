const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// Admin login POST endpoint
router.post("/login", adminController.adminLogin);

// Helpful landing for browser GET requests
router.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MonoPurifier API - Admin Authentication</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: #f8fafc; }
          .card { max-width: 520px; margin: 0 auto; background: #1e293b; padding: 36px 28px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4); }
          h2 { color: #38bdf8; margin-top: 0; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
          .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.2s; }
          .btn:hover { background: #0369a1; }
          .credentials { margin-top: 24px; padding: 14px; background: #0f172a; border-radius: 8px; font-size: 13px; text-align: left; color: #cbd5e1; }
          .credentials code { color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>💧 MonoPurifier Admin API</h2>
          <p>You have reached the backend authentication endpoint (<strong>POST</strong>). To log in using the Admin Dashboard user interface, click below:</p>
          <a class="btn" href="https://mono-purifier.vercel.app/admin/login">Open Admin Login Portal &rarr;</a>
          <div class="credentials">
            <strong>Default Credentials:</strong><br>
            Username: <code>admin</code><br>
            Password: <code>aditya</code> / <code>Aditya@123</code> / <code>admin123</code>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Protected routes (require authentication)
// Add verifyToken middleware to routes that need authentication
// Example: router.post("/products", verifyToken, productController.manageProducts);

module.exports = router;
