require("dotenv").config();
const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/AdminRoute");
const productRoutes = require("./routes/ProductRoute");

const app = express(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV}`);
}); 