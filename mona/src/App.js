import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/website/Home";
import Navbar from "./pages/website/Navbar";
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
				<Route
					path="/"
					element={
						<>
							<Navbar />
							<Home />
						</>
					}
				/>
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route
					path="/admin"
					element={<Navigate to="/admin/dashboard" replace />}
				/>
				<Route element={<ProtectedRoute />}>
					<Route element={<AdminNavbar />}>
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route path="/admin/manageproducts" element={<ManageProducts />} />
						<Route
							path="/admin/addormodifyproducts/:id?"
							element={<AddOrModifyProduct />}
						/>

						<Route path="/admin/settings" element={<div>Settings Page</div>} />
					</Route>
				</Route>
				<Route path="*" element={<div>404 - Page Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
