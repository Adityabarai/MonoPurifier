# System Design & Architecture Document

## 1. System Overview

**MonoPurifier ("MONA")** is a full-stack e-commerce and customer engagement platform for water purification systems (RO, UV, UF, Copper & Alkaline technology). The system serves two primary personas:
1. **Prospective Customers**: Browsing purification technologies, exploring products, viewing AMC (maintenance) plans, and booking doorstep demonstrations/inquiries.
2. **Business Administrators**: Managing catalog data (products, pricing, images, specifications, soft deletes) and reviewing lead inquiries.

---

## 2. High-Level Architecture

```
+-------------------------------------------------------------------------+
|                                CLIENT LAYER                             |
|                                                                         |
|   +--------------------------+        +-----------------------------+   |
|   |   Customer Storefront    |        |        Admin Portal         |   |
|   |          (/)             |        |         (/admin/*)          |   |
|   |  - Dynamic Product Grid  |        |  - Auth (JWT)               |   |
|   |  - "Book Demo" Lead Form |        |  - Product Management CRUD  |   |
|   |  - Maintenance Plans     |        |  - Image Uploads            |   |
|   +------------+-------------+        +--------------+--------------+   |
|                |                                     |                  |
|                +------------------+------------------+                  |
|                                   | (HTTP/JSON + FormData)              |
+-----------------------------------|-------------------------------------+
                                    v
+-------------------------------------------------------------------------+
|                               API LAYER                                 |
|                       Node.js + Express 5 Server                        |
|                                                                         |
|    +----------------------+  +---------------------+  +-------------+   |
|    |     Admin Router     |  |   Products Router   |  | Lead Router |   |
|    |   /api/admin/login   |  |    /api/products    |  |  /api/leads |   |
|    +----------+-----------+  +----------+----------+  +------+------+   |
|               |                         |                    |          |
|               +-------------------------+--------------------+          |
|                                         |                               |
|                        +----------------v-----------------+             |
|                        |    JWT Auth & File Upload Multer  |             |
|                        +----------------+-----------------+             |
+-----------------------------------------|-------------------------------+
                                          v
+-------------------------------------------------------------------------+
|                               DATA LAYER                                |
|                                                                         |
|   [Mode A: Local Engine - Zero Setup]   [Mode B: Supabase Cloud]        |
|    - SQLite Database (monopurifier.db)   - PostgreSQL Database          |
|    - Local Static Uploads (/uploads)    - Cloud Storage Buckets        |
+-------------------------------------------------------------------------+
```

---

## 3. Component Breakdown

### 3.1 Frontend Application (`mona`)
- **Framework**: React 19 (`react`, `react-dom`) with React Router v7 (`react-router-dom`).
- **Styling**: Tailwind CSS v3 with custom responsive typography, fluid grids, and animations.
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
- **API Client**: Centralized Axios service with base URL fallback and request/response interceptors for JWT token injection.
- **Key Routes**:
  - `/`: Public Homepage with Hero Slider, Features, Dynamic Catalog, Technology comparison, AMC plans, and Lead Form.
  - `/admin/login`: Secure administrator sign-in.
  - `/admin/dashboard`: Admin telemetry, counts, and overview.
  - `/admin/manageproducts`: Paginated catalog table with filters (Active/Deleted/Categories), search, and bulk operations.
  - `/admin/addormodifyproducts/:id?`: Dual-purpose form for product creation and updating with real-time image preview and upload.

### 3.2 Backend API (`backend`)
- **Runtime**: Node.js (v18+) with Express 5.
- **Security Middleware**:
  - `cors`: Cross-Origin Resource Sharing with whitelisted origins (localhost:3000, production URLs).
  - `verifyToken`: Middleware inspecting `Authorization: Bearer <token>`, validating signatures using `jsonwebtoken`.
- **Media Ingestion**: `multer` memory/disk storage for handling multi-part product image uploads with MIME-type validation.
- **Database Abstraction**: Universal data adapter supporting both local SQLite and remote Supabase PostgreSQL.

---

## 4. API Endpoints Specification

### 4.1 Authentication (`/api/admin`)
| Method | Endpoint | Auth | Description | Payload / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | None | Authenticate admin | `{ username, password }` $\rightarrow$ `{ token, admin: { id, username, firstname, email } }` |

### 4.2 Products (`/api/products`)
| Method | Endpoint | Auth | Description | Payload / Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | None | Fetch all active products | Query: `?includeDeleted=false` $\rightarrow$ `Product[]` |
| `GET` | `/api/products/:id` | None | Get single product by ID | URL Param: `:id` $\rightarrow$ `Product` |
| `POST` | `/api/products/save` | Bearer | Create or update product | Body: `{ product_id?, name, category, price, ... }` $\rightarrow$ Saved Product |
| `POST` | `/api/products/upload-image` | Bearer | Upload product image | Multipart Form: `image` file $\rightarrow$ `{ image_url }` |
| `DELETE` | `/api/products/:id` | Bearer | Soft delete product | URL Param: `:id` $\rightarrow$ `{ message, is_deleted: 1 }` |
| `POST` | `/api/products/bulk-delete` | Bearer | Bulk soft delete | Body: `{ ids: number[] }` $\rightarrow$ `{ message, count }` |

### 4.3 Customer Leads (`/api/leads`)
| Method | Endpoint | Auth | Description | Payload / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | None | Submit "Book Demo" lead | Body: `{ name, phone, address, model }` $\rightarrow$ `{ success: true, lead_id }` |
| `GET` | `/api/leads` | Bearer | View all leads (Admin) | Response: `Lead[]` |

---

## 5. Security & Data Flow Considerations

1. **Password Hashing**: Stored passwords use `bcrypt` (or `bcryptjs`) with a salt factor of 10. Cleartext passwords are never stored or logged.
2. **Stateless JWT**: Admin authorization tokens are signed with a server secret (`JWT_SECRET`) and default to a 24-hour expiration window.
3. **Soft-Delete Architecture**: Products are marked `is_deleted = 1` rather than dropped from the database, ensuring historical order references remain intact.
4. **Environment Configuration**: Sensitive secrets (JWT secrets, DB credentials, API endpoints) are loaded strictly via `.env` files and never committed to version control.
