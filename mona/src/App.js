import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/website/Home";
import Navbar from "./pages/website/Navbar";
import Footer from "./pages/website/Footer"; // ✅ import Footer
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNavbar from "./pages/admin/AdminNavbar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import AddOrModifyProduct from "./pages/admin/AddOrModifyProduct";
import ProtectedRoute from "./pages/Common/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Homepage */}
				<Route
					path="/"
					element={
						<>
							<Navbar />
							<Home />
							<Footer /> {/* ✅ Footer added here */}
						</>
					}
				/>

				{/* Admin Login */}
				<Route path="/admin/login" element={<AdminLogin />} />

				{/* Redirect /admin to dashboard */}
				<Route
					path="/admin"
					element={<Navigate to="/admin/dashboard" replace />}
				/>

				{/* Protected Admin Routes */}
				<Route element={<ProtectedRoute />}>
					<Route element={<AdminNavbar />}>
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route path="/admin/manageproducts" element={<ManageProducts />} />
						<Route path="/admin/addormodifyproducts/:id?" element={<AddOrModifyProduct />}/>
						<Route path="/admin/settings" element={<div>Settings Page</div>} />
					</Route>
				</Route>

				{/* 404 Page */}
				<Route path="*" element={<div>404 - Page Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
