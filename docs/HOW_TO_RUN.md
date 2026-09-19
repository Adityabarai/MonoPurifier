# How to Run MonoPurifier Locally

Follow this simple, step-by-step guide to run both the **Backend API** and **Frontend Web Application** on your computer.

---

## 1. Prerequisites

Make sure you have **Node.js** installed:
- Node.js version 18.0.0 or higher.
- Check by opening PowerShell or Terminal:
  ```bash
  node -v
  npm -v
  ```

---

## 2. Quick Start: Running the Project

The project is divided into two folders:
- `backend/`: The Express API server (runs on `http://localhost:5000`)
- `mona/`: The React client & admin UI (runs on `http://localhost:3000`)

### Step 1: Start the Backend Server

1. Open a terminal in the project directory:
   ```powershell
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the server:
   ```powershell
   npm start
   ```
   *You will see: `✅ Local Database initialized` and `Server running on port 5000`.*

---

### Step 2: Start the Frontend Application

1. Open a **second terminal** window:
   ```powershell
   cd mona
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the React development server:
   ```powershell
   npm start
   ```
   *Your browser will automatically open: `http://localhost:3000`.*

---

## 3. Application URLs & Default Credentials

### Public Website
* **URL**: [http://localhost:3000/](http://localhost:3000/)
* **Features**: View water purifier models, read technology details, browse AMC plans, and submit the "Book Demo" inquiry form.

### Admin Back-Office
* **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Default Admin Credentials**:
  * **Username**: `admin`
  * **Password**: `admin123`
* **Admin Pages**:
  * 📊 **Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) (Live KPI metrics, product inventory stats, and recent inquiries)
  * 💧 **Product Catalog**: [http://localhost:3000/admin/manageproducts](http://localhost:3000/admin/manageproducts) (Filter, search, toggle status, and delete products)
  * ➕ **Add / Edit Product**: [http://localhost:3000/admin/addormodifyproducts](http://localhost:3000/admin/addormodifyproducts) (Full product editor with image upload)
  * 📞 **Demo Leads & Bookings**: [http://localhost:3000/admin/leads](http://localhost:3000/admin/leads) (Customer demonstration requests with 1-click Call & WhatsApp)


---

## 4. Environment Variables (`.env`)

### Backend (`backend/.env`)
By default, the backend runs in **Local Mode** with zero configuration. If you wish to customize or connect to Supabase Cloud, create a `.env` file inside `backend/`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secure_monopurifier_jwt_secret

# Optional: To use Supabase Cloud instead of Local Database
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Frontend (`mona/.env`)
Create a `.env` file inside `mona/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 5. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Port 5000 already in use** | Change `PORT=5001` in `backend/.env` and update `REACT_APP_API_URL` in `mona/.env`. |
| **Port 3000 already in use** | React will ask if you want to run on another port (e.g., 3001). Type `Y`. |
| **Windows build script error (`CI=false`)** | Run `npx react-scripts build` or use `npm run build` with `cross-env`. |
| **Images not loading** | Local uploads are served from `http://localhost:5000/uploads/`. Ensure backend is running. |
