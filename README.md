# MonoPurifier ("MONA") - Water Purification Web Application

A full-stack e-commerce and customer engagement platform for water purification systems, complete with customer-facing catalog, demo inquiry capture, and a comprehensive admin back-office.

## 🌟 Key Features

* **Customer Storefront (`/`)**:
  * Hero banner carousel with animated slides and value propositions.
  * Interactive purification stage breakdown (RO + UV + UF + TDS controller).
  * Dynamic product catalog fetching real-time models, badges, and pricing.
  * Doorstep demonstration booking form ("Book a Free Demo").
  * Annual Maintenance Contract (AMC) plans and pricing tiers.
  * Fully mobile responsive navigation with collapsible drawer.

* **Admin Portal (`/admin/*`)**:
  * Secure JWT-based administrator login (`admin` / `admin123`).
  * Product management dashboard with category, status, and soft-delete filters.
  * Add & Edit product modal with real-time image preview and upload.
  * Lead management for review of customer demo bookings.

---

## 📁 Repository Structure

```
MonoPurifier/
├── backend/                  # Node.js Express 5 REST API
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Request handlers (admin, products, leads)
│   ├── middleware/           # JWT verification and upload middlewares
│   ├── routes/               # API route definitions
│   └── index.js              # Server entrypoint
│
├── mona/                     # React 19 Frontend Application
│   ├── public/               # Static assets & index.html
│   ├── src/
│   │   ├── assets/           # Logos, branding, and images
│   │   ├── pages/
│   │   │   ├── Common/       # ProtectedRoute and shared utilities
│   │   │   ├── admin/        # Admin dashboard, product CRUD, and login
│   │   │   └── website/      # Homepage, navbar, footer
│   │   ├── services/         # Centralized API client (Axios)
│   │   ├── App.js            # Router configuration
│   │   └── index.js          # React DOM root
│   ├── package.json          # Frontend dependencies & scripts
│   └── tailwind.config.js    # Design tokens & animations
│
└── docs/                     # Full technical documentation
    ├── SYSTEM_DESIGN.md      # Architecture & API specifications
    ├── DATABASE_DESIGN.md    # Schema, ER diagrams, and SQL migrations
    └── HOW_TO_RUN.md         # Step-by-step execution instructions
```

---

## 🔐 Default Admin Access

* **URL**: `http://localhost:3000/admin/login`
* **Username**: `admin`
* **Password**: `admin123`
