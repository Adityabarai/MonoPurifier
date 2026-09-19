# Database Design & Schema Specification

## 1. Overview

MonoPurifier uses a relational database schema designed for speed, referential clarity, and soft-delete auditability. The system supports **dual operational modes**:
1. **Local Mode (Default)**: Embedded SQLite (`monopurifier.db`), zero configuration, perfect for local development and offline testing.
2. **Cloud Mode (Supabase / PostgreSQL)**: Full remote PostgreSQL with stored procedures (RPC) and cloud object storage for production deployment.

---

## 2. Entity-Relationship (ER) Diagram

```
+-----------------------------------+
|           admin_master            |
+-----------------------------------+
| PK  inid          INTEGER / SERIAL|
|     username      VARCHAR(100)    |
|     password      VARCHAR(255)    |
|     firstname     VARCHAR(100)    |
|     lastname      VARCHAR(100)    |
|     emailid       VARCHAR(150)    |
|     created_at    TIMESTAMP       |
+-----------------------------------+

+-----------------------------------+
|             products              |
+-----------------------------------+
| PK  product_id    INTEGER / SERIAL|
|     guid          VARCHAR(64)     |
|     name          VARCHAR(255)    |
|     category      VARCHAR(100)    |
|     badge         VARCHAR(50)     |
|     rating        DECIMAL(3, 1)   |
|     reviews_count INTEGER         |
|     price         INTEGER         |
|     original_priceINTEGER         |
|     discount_amt  INTEGER         |
|     capacity      VARCHAR(50)     |
|     image_url     TEXT            |
|     technology    VARCHAR(100)    |
|     description   TEXT            |
|     status        INTEGER (0/1)   |
|     is_deleted    INTEGER (0/1)   |
|     created_at    TIMESTAMP       |
|     updated_at    TIMESTAMP       |
+-----------------------------------+

+-----------------------------------+
|              leads                |
+-----------------------------------+
| PK  lead_id       INTEGER / SERIAL|
|     name          VARCHAR(150)    |
|     phone         VARCHAR(20)     |
|     address       TEXT            |
|     model         VARCHAR(100)    |
|     status        VARCHAR(50)     |
|     created_at    TIMESTAMP       |
+-----------------------------------+
```

---

## 3. Table Definitions

### 3.1 `admin_master`
Stores administrative accounts with access to the management back-office.
* `inid`: Primary Key (Autoincrement).
* `username`: Unique administrator login username.
* `password`: Bcrypt-hashed password.
* `firstname`, `lastname`: Administrator display names.
* `emailid`: Administrative email address.
* `created_at`: Creation timestamp.

### 3.2 `products`
The core catalog table containing purifier units and components.
* `product_id`: Primary Key (Autoincrement).
* `guid`: Unique identifier for external tracking.
* `name`: Display name (e.g., "AquaPure RO Elite").
* `category`: Categorization ("RO Purifier", "UV Purifier", "Spare Parts").
* `badge`: Marketing badge ("Best Seller", "Popular", "Premium", "New").
* `rating`: Customer rating average (0.0 to 5.0).
* `reviews_count`: Count of verified customer reviews.
* `price`: Effective selling price in INR (₹).
* `original_price`: Strikethrough MSRP / MRP in INR (₹).
* `discount_amount`: Computed or stored discount (MRP - Price).
* `capacity`: Tank capacity (e.g., "10L Storage", "8L Capacity").
* `image_url`: Full path or URL to product image.
* `technology`: Core technology summary (e.g., "RO + UV + UF + TDS").
* `description`: Detailed specifications and product overview.
* `status`: 1 = Active, 0 = Inactive.
* `is_deleted`: Soft-delete flag (0 = visible, 1 = deleted).

### 3.3 `leads`
Captures "Book a Free Demo" inquiries from prospective buyers.
* `lead_id`: Primary Key (Autoincrement).
* `name`: Customer name.
* `phone`: Contact phone number.
* `address`: Doorstep address for installation or demonstration.
* `model`: Selected or preferred purifier model.
* `status`: Lead workflow status ("New", "Contacted", "Demo Scheduled", "Completed").
* `created_at`: Submission timestamp.

---

## 4. SQL Migration Scripts (PostgreSQL / Supabase)

If migrating to Supabase Cloud, run the following script in the **Supabase SQL Editor**:

```sql
-- 1. Create admin_master table
CREATE TABLE IF NOT EXISTS admin_master (
    inid SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    emailid VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    guid VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    badge VARCHAR(50),
    rating DECIMAL(3, 1) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    original_price INTEGER,
    discount_amount INTEGER,
    capacity VARCHAR(50),
    image_url TEXT,
    technology VARCHAR(100),
    description TEXT,
    status INTEGER DEFAULT 1,
    is_deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create leads table
CREATE TABLE IF NOT EXISTS leads (
    lead_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    model VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stored Procedure: add_or_modify_product
CREATE OR REPLACE FUNCTION add_or_modify_product(
    p_product_id INT DEFAULT NULL,
    p_guid VARCHAR DEFAULT NULL,
    p_name VARCHAR DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_badge VARCHAR DEFAULT NULL,
    p_rating DECIMAL DEFAULT NULL,
    p_reviews_count INT DEFAULT NULL,
    p_price INT DEFAULT NULL,
    p_original_price INT DEFAULT NULL,
    p_discount_amount INT DEFAULT NULL,
    p_capacity VARCHAR DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_technology VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS SETOF products AS $$
BEGIN
    IF p_product_id IS NOT NULL THEN
        UPDATE products SET
            name = COALESCE(p_name, name),
            category = COALESCE(p_category, category),
            badge = COALESCE(p_badge, badge),
            rating = COALESCE(p_rating, rating),
            reviews_count = COALESCE(p_reviews_count, reviews_count),
            price = COALESCE(p_price, price),
            original_price = COALESCE(p_original_price, original_price),
            discount_amount = COALESCE(p_discount_amount, discount_amount),
            capacity = COALESCE(p_capacity, capacity),
            image_url = COALESCE(p_image_url, image_url),
            technology = COALESCE(p_technology, technology),
            description = COALESCE(p_description, description),
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = p_product_id
        RETURNING *;
    ELSE
        RETURN QUERY
        INSERT INTO products (
            guid, name, category, badge, rating, reviews_count,
            price, original_price, discount_amount, capacity,
            image_url, technology, description, status, is_deleted
        ) VALUES (
            p_guid, p_name, p_category, p_badge, p_rating, p_reviews_count,
            p_price, p_original_price, p_discount_amount, p_capacity,
            p_image_url, p_technology, p_description, 1, 0
        )
        RETURNING *;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. Stored Procedure: get_all_products
CREATE OR REPLACE FUNCTION get_all_products(include_deleted BOOLEAN DEFAULT FALSE)
RETURNS SETOF products AS $$
BEGIN
    IF include_deleted THEN
        RETURN QUERY SELECT * FROM products ORDER BY product_id DESC;
    ELSE
        RETURN QUERY SELECT * FROM products WHERE is_deleted = 0 ORDER BY product_id DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. Stored Procedure: get_product_by_id
CREATE OR REPLACE FUNCTION get_product_by_id(p_id INT)
RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY SELECT * FROM products WHERE product_id = p_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Stored Procedure: delete_product (soft delete)
CREATE OR REPLACE FUNCTION delete_product(p_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE products SET is_deleted = 1 WHERE product_id = p_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Stored Procedure: bulk_delete_products
CREATE OR REPLACE FUNCTION bulk_delete_products(p_ids INT[])
RETURNS VOID AS $$
BEGIN
    UPDATE products SET is_deleted = 1 WHERE product_id = ANY(p_ids);
END;
$$ LANGUAGE plpgsql;
```
