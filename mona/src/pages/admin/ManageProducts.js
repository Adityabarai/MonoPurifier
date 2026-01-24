import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	FaSearch,
	FaEdit,
	FaTrash,
	FaPlus,
	FaStar,
	FaImage,
	FaChevronDown,
	FaChevronUp,
	FaAngleLeft,
	FaAngleDoubleRight,
	FaAngleDoubleLeft,
	FaAngleRight,
	FaSync,
	FaUndo,
	FaCheckCircle,
	FaTimesCircle,
	FaPowerOff,
	FaPlay,
	FaExclamationTriangle,
	FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";

const ManageProducts = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const API_URL = "http://localhost:5000/api";

	const staticCategories = [
		"Water Purifier",
		"Filter",
		"Accessories",
		"Spare Parts",
		"Installation Kit",
	];

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [currentItems, setCurrentItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deletedFilter, setDeletedFilter] = useState("active");
	const [sortConfig, setSortConfig] = useState({
		key: "product_id",
		direction: "asc",
	});
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [selectAll, setSelectAll] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("info");
	const [permanentDelete, setPermanentDelete] = useState(false);
	const [showRestoreModal, setShowRestoreModal] = useState(false);

	const showAlertMessage = useCallback((message, type = "info") => {
		setAlertMessage(message);
		setAlertType(type);
		setShowAlert(true);
		setTimeout(() => {
			setShowAlert(false);
		}, 5000);
	}, []);

	const hideAlert = () => {
		setShowAlert(false);
	};

	const fetchProducts = useCallback(async () => {
		setLoading(true);
		try {
			const includeDeleted =
				deletedFilter === "all" || deletedFilter === "deleted";
			const response = await axios.get(`${API_URL}/products`, {
				params: { includeDeleted: includeDeleted.toString() },
			});
			const parsedProducts = response.data.map((product) => ({
				...product,
				rating: product.rating ? parseFloat(product.rating) : 0,
				reviews_count: product.reviews_count
					? parseInt(product.reviews_count)
					: 0,
				price: product.price ? parseInt(product.price) : 0,
				original_price: product.original_price
					? parseInt(product.original_price)
					: 0,
				discount_amount: product.discount_amount
					? parseInt(product.discount_amount)
					: 0,
				status: product.status ?? 1,
				is_deleted: product.is_deleted ?? 0,
			}));
			setProducts(parsedProducts);
			setFilteredProducts(parsedProducts);
		} catch (error) {
			console.error("Error fetching products:", error);
			showAlertMessage("Failed to fetch products", "error");
		} finally {
			setLoading(false);
		}
	}, [API_URL, deletedFilter, showAlertMessage]);

	useEffect(() => {
		fetchProducts();
		if (location.state?.successMessage) {
			showAlertMessage(location.state.successMessage, "success");
			window.history.replaceState({}, document.title);
		}
	}, [fetchProducts, location.state, showAlertMessage]);

	const filterAndSortProducts = useCallback(() => {
		let filtered = [...products];
		if (searchTerm) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.description
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					product.technology?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		if (categoryFilter !== "all") {
			filtered = filtered.filter(
				(product) => product.category === categoryFilter
			);
		}
		if (statusFilter !== "all") {
			const statusValue = statusFilter === "active" ? 1 : 0;
			filtered = filtered.filter((product) => product.status === statusValue);
		}
		if (deletedFilter === "active") {
			filtered = filtered.filter((product) => product.is_deleted === 0);
		} else if (deletedFilter === "deleted") {
			filtered = filtered.filter((product) => product.is_deleted === 1);
		}
		if (sortConfig.key) {
			filtered.sort((a, b) => {
				let aValue = a[sortConfig.key];
				let bValue = b[sortConfig.key];
				if (typeof aValue === "string") {
					aValue = aValue.toLowerCase();
					bValue = bValue.toLowerCase();
				}
				if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		setFilteredProducts(filtered);
	}, [products, searchTerm, categoryFilter, statusFilter, deletedFilter, sortConfig]);

	useEffect(() => {
		filterAndSortProducts();
	}, [filterAndSortProducts]);

	useEffect(() => {
		const total = Math.ceil(filteredProducts.length / itemsPerPage);
		setTotalPages(total);
		if (currentPage > total && total > 0) {
			setCurrentPage(1);
		}
		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;
		setCurrentItems(filteredProducts.slice(indexOfFirstItem, indexOfLastItem));
		setSelectAll(false);
		setSelectedProducts([]);
	}, [filteredProducts, currentPage, itemsPerPage]);

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const handleSelectProduct = (productId) => {
		const newSelected = [...selectedProducts];
		const index = newSelected.indexOf(productId);
		if (index > -1) {
			newSelected.splice(index, 1);
		} else {
			newSelected.push(productId);
		}
		setSelectedProducts(newSelected);
		setSelectAll(newSelected.length === currentItems.length);
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedProducts([]);
		} else {
			const allIds = currentItems.map((product) => product.product_id);
			setSelectedProducts(allIds);
		}
		setSelectAll(!selectAll);
	};

	const handleToggleStatus = async (productId, currentStatus) => {
		try {
			setLoading(true);
			const action = currentStatus === 1 ? "deactivate" : "activate";

			await axios.patch(`${API_URL}/products/${productId}/status`, {
				action,
			});

			await fetchProducts();
			showAlertMessage(
				`Product ${
					action === "activate" ? "activated" : "deactivated"
				} successfully!`,
				"success"
			);
		} catch (error) {
			console.error("Error toggling status:", error);
			showAlertMessage("Failed to toggle product status", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleBulkActivate = async () => {
		if (selectedProducts.length === 0) {
			showAlertMessage(
				"Please select at least one product to activate",
				"warning"
			);
			return;
		}
		try {
			setLoading(true);
			const promises = selectedProducts.map((id) =>
				axios.patch(`${API_URL}/products/${id}/status`, { action: "activate" })
			);

			await Promise.all(promises);

			await fetchProducts();
			setSelectedProducts([]);
			setSelectAll(false);
			showAlertMessage(
				`${selectedProducts.length} product(s) activated successfully!`,
				"success"
			);
		} catch (error) {
			console.error("Error bulk activating:", error);
			showAlertMessage("Failed to activate products", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleBulkDeactivate = async () => {
		if (selectedProducts.length === 0) {
			showAlertMessage(
				"Please select at least one product to deactivate",
				"warning"
			);
			return;
		}
		try {
			setLoading(true);
			const promises = selectedProducts.map((id) =>
				axios.patch(`${API_URL}/products/${id}/status`, {
					action: "deactivate",
				})
			);

			await Promise.all(promises);

			await fetchProducts();
			setSelectedProducts([]);
			setSelectAll(false);
			showAlertMessage(
				`${selectedProducts.length} product(s) deactivated successfully!`,
				"success"
			);
		} catch (error) {
			console.error("Error bulk deactivating:", error);
			showAlertMessage("Failed to deactivate products", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleBulkDelete = async () => {
		if (selectedProducts.length === 0) {
			showAlertMessage(
				"Please select at least one product to delete",
				"warning"
			);
			return;
		}
		try {
			setLoading(true);
			await axios.delete(`${API_URL}/products`, {
				data: { ids: selectedProducts, permanent: false },
			});

			await fetchProducts();
			setSelectedProducts([]);
			setSelectAll(false);
			showAlertMessage(
				`${selectedProducts.length} product(s) deleted successfully!`,
				"success"
			);
		} catch (error) {
			console.error("Error bulk deleting:", error);
			showAlertMessage("Failed to delete products", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProduct = async () => {
		if (!selectedProduct) return;
		try {
			setLoading(true);
			const response = await axios.delete(
				`${API_URL}/products/${selectedProduct.product_id}`,
				{ params: { permanent: permanentDelete ? "true" : "false" } }
			);

			if (response.status === 200) {
				showAlertMessage(response.data.message, "success");
				setShowDeleteModal(false);
				setSelectedProduct(null);
				setPermanentDelete(false);
				await fetchProducts();
				setSelectedProducts(
					selectedProducts.filter((id) => id !== selectedProduct.product_id)
				);
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			showAlertMessage("Failed to delete product", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleRestoreProduct = async () => {
		if (!selectedProduct) return;
		try {
			setLoading(true);
			await axios.patch(
				`${API_URL}/products/${selectedProduct.product_id}/restore`
			);

			showAlertMessage("Product restored successfully!", "success");
			setShowRestoreModal(false);
			setSelectedProduct(null);
			await fetchProducts();
		} catch (error) {
			console.error("Error restoring product:", error);
			showAlertMessage("Failed to restore product", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleBulkRestore = async () => {
		if (selectedProducts.length === 0) {
			showAlertMessage(
				"Please select at least one product to restore",
				"warning"
			);
			return;
		}
		try {
			setLoading(true);
			const promises = selectedProducts.map((id) =>
				axios.patch(`${API_URL}/products/${id}/restore`)
			);

			await Promise.all(promises);

			await fetchProducts();
			setSelectedProducts([]);
			setSelectAll(false);
			showAlertMessage(
				`${selectedProducts.length} product(s) restored successfully!`,
				"success"
			);
		} catch (error) {
			console.error("Error bulk restoring:", error);
			showAlertMessage("Failed to restore products", "error");
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount) => {
		if (!amount) return "₹0";
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const calculateDiscountPercentage = (original, discounted) => {
		if (!original || original <= discounted) return 0;
		return Math.round(((original - discounted) / original) * 100);
	};

	const getSortIcon = (key) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === "asc" ? <FaChevronUp /> : <FaChevronDown />;
	};

	const goToPage = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	const goToFirstPage = () => goToPage(1);
	const goToLastPage = () => goToPage(totalPages);
	const goToNextPage = () => goToPage(currentPage + 1);
	const goToPrevPage = () => goToPage(currentPage - 1);

	const handleItemsPerPageChange = (e) => {
		const value = parseInt(e.target.value);
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;
		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					1,
					"...",
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					1,
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages
				);
			}
		}

		return pages;
	};

	const Alert = ({ message, type, onClose }) => {
		const alertStyles = {
			info: "bg-blue-50 border-blue-200 text-blue-800",
			success: "bg-green-50 border-green-200 text-green-800",
			warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
			error: "bg-red-50 border-red-200 text-red-800",
		};
		const iconStyles = {
			info: "text-blue-600",
			success: "text-green-600",
			warning: "text-yellow-600",
			error: "text-red-600",
		};
		const icons = {
			info: <FaInfoCircle className={`text-lg ${iconStyles[type]}`} />,
			success: <FaCheckCircle className={`text-lg ${iconStyles[type]}`} />,
			warning: (
				<FaExclamationTriangle className={`text-lg ${iconStyles[type]}`} />
			),
			error: <FaTimesCircle className={`text-lg ${iconStyles[type]}`} />,
		};
		return (
			<div
				className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md ${alertStyles[type]} animate-slide-in`}
			>
				<div className="flex items-start gap-3">
					{icons[type]}
					<div className="flex-1">
						<p className="font-medium">{message}</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 ml-2"
					>
						<FaTimesCircle />
					</button>
				</div>
			</div>
		);
	};
	
	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-6">
			{showAlert && (
				<Alert message={alertMessage} type={alertType} onClose={hideAlert} />
			)}

			<div className="mb-8 flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-primary mb-2">
						Manage Products
					</h1>
					<p className="text-primary">
						View, edit, and manage products in your store
					</p>
				</div>
				<button
					onClick={fetchProducts}
					className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
					disabled={loading}
				>
					<FaSync className={loading ? "animate-spin" : ""} />
					{loading ? "Refreshing..." : "Refresh"}
				</button>
			</div>

			{loading && (
				<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="text-blue-600 font-medium flex items-center gap-2">
						<FaSync className="animate-spin" /> Loading products...
					</p>
				</div>
			)}

			<div className="bg-white rounded-xl shadow-sm p-4 mb-6">
				<div className="flex flex-col gap-4">
					<div className="relative flex-1">
						<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search products by name, category, technology..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={loading}
						/>
					</div>

					<div className="flex flex-wrap gap-3">
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={loading}
						>
							<option value="all">All Categories</option>
							{staticCategories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>

						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={loading}
						>
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>

						<select
							value={deletedFilter}
							onChange={(e) => setDeletedFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={loading}
						>
							<option value="active">Active Products</option>
							<option value="deleted">Deleted Products</option>
							<option value="all">All Products</option>
						</select>

						<button
							onClick={() => navigate("/admin/add-product")}
							className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors ml-auto"
							disabled={loading}
						>
							<FaPlus /> Add Product
						</button>
					</div>
				</div>
			</div>

			<div className="mb-4 flex items-center justify-between">
				<div className="text-sm text-gray-600">
					Showing{" "}
					<span className="font-semibold">
						{filteredProducts.length > 0
							? (currentPage - 1) * itemsPerPage + 1
							: 0}
					</span>{" "}
					to{" "}
					<span className="font-semibold">
						{Math.min(currentPage * itemsPerPage, filteredProducts.length)}
					</span>{" "}
					of <span className="font-semibold">{filteredProducts.length}</span>{" "}
					products
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">Items per page:</span>
					<select
						value={itemsPerPage}
						onChange={handleItemsPerPageChange}
						className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						disabled={loading}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
					</select>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
				{loading ? (
					<div className="p-8 text-center">
						<div className="text-gray-400 mb-2">Loading products...</div>
					</div>
				) : filteredProducts.length === 0 ? (
					<div className="p-8 text-center">
						<div className="text-gray-400 mb-2">No products found</div>
						<p className="text-gray-500">
							Try adjusting your search or filters
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-max">
							<thead className="bg-gray-50">
								<tr>
									<th className="py-3 px-4 text-left">
										<input
											type="checkbox"
											checked={selectAll}
											onChange={handleSelectAll}
											className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
											disabled={loading}
										/>
									</th>
									<th
										className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
										onClick={() => handleSort("product_id")}
									>
										<div className="flex items-center gap-1">
											ID {getSortIcon("product_id")}
										</div>
									</th>
									<th
										className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
										onClick={() => handleSort("name")}
									>
										<div className="flex items-center gap-1">
											Name {getSortIcon("name")}
										</div>
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Status
									</th>
									<th
										className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
										onClick={() => handleSort("category")}
									>
										<div className="flex items-center gap-1">
											Category {getSortIcon("category")}
										</div>
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Badge
									</th>
									<th
										className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
										onClick={() => handleSort("rating")}
									>
										<div className="flex items-center gap-1">
											Rating {getSortIcon("rating")}
										</div>
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Reviews
									</th>
									<th
										className="py-3 px-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
										onClick={() => handleSort("price")}
									>
										<div className="flex items-center gap-1">
											Price {getSortIcon("price")}
										</div>
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Original
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Discount
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Capacity
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Image
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Technology
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Description
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Created At
									</th>
									<th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{currentItems.map((product) => (
									<tr
										key={product.product_id}
										className={`hover:bg-gray-50 ${
											selectedProducts.includes(product.product_id)
												? "bg-blue-50"
												: ""
										} ${product.is_deleted === 1 ? "bg-red-50" : ""}`}
									>
										<td className="py-4 px-4">
											<span className="text-gray-600 text-sm">
												{product.reviews_count || 0}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="font-semibold text-gray-900">
												{formatCurrency(product.price)}
											</div>
										</td>
										<td className="py-4 px-4">
											{product.original_price > product.price ? (
												<div className="text-gray-500 text-sm line-through">
													{formatCurrency(product.original_price)}
												</div>
											) : (
												<span className="text-gray-400 text-xs">—</span>
											)}
										</td>
										<td className="py-4 px-4">
											{product.discount_amount > 0 ? (
												<div className="flex flex-col gap-1">
													<span className="text-red-600 text-sm font-medium">
														-{formatCurrency(product.discount_amount)}
													</span>
													<span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
														-
														{calculateDiscountPercentage(
															product.original_price,
															product.price,
														)}
														%
													</span>
												</div>
											) : (
												<span className="text-gray-400 text-xs">—</span>
											)}
										</td>
										<td className="py-4 px-4">
											<span className="text-gray-600 text-sm">
												{product.capacity}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
												{product.image_url ? (
													<img
														src={product.image_url}
														alt={product.name}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.target.style.display = "none";
															e.target.parentElement.innerHTML =
																'<div class="text-gray-400"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
														}}
													/>
												) : (
													<FaImage className="text-gray-400" />
												)}
											</div>
										</td>
										<td className="py-4 px-4">
											<span className="text-gray-600 text-sm">
												{product.technology || "—"}
											</span>
										</td>
										<td className="py-4 px-4 max-w-xs">
											<span className="text-gray-600 text-sm line-clamp-2">
												{product.description || "—"}
											</span>
										</td>
										<td className="py-4 px-4">
											<span className="text-gray-500 text-xs">
												{product.created_at
													? new Date(product.created_at).toLocaleDateString(
															"en-IN",
															{
																day: "2-digit",
																month: "short",
																year: "numeric",
															},
														)
													: "N/A"}
											</span>
										</td>
										<td className="py-4 px-4">
											<div className="flex items-center gap-2">
												{product.is_deleted === 0 ? (
													<>
														<button
															onClick={() =>
																handleToggleStatus(
																	product.product_id,
																	product.status,
																)
															}
															className={`p-2 rounded-lg transition-colors ${
																product.status === 1
																	? "text-gray-600 hover:bg-gray-100"
																	: "text-green-600 hover:bg-green-50"
															}`}
															title={
																product.status === 1 ? "Deactivate" : "Activate"
															}
															disabled={loading}
														>
															{product.status === 1 ? (
																<FaPowerOff />
															) : (
																<FaPlay />
															)}
														</button>

														<button
															onClick={() =>
																navigate(
																	`/admin/addormodifyproducts/${product.product_id}`,
																)
															}
															className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
															title="Edit"
															disabled={loading}
														>
															<FaEdit />
														</button>
													</>
												) : (
													<button
														onClick={() => {
															setSelectedProduct(product);
															setShowRestoreModal(true);
														}}
														className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
														title="Restore"
														disabled={loading}
													>
														<FaUndo />
													</button>
												)}

												<button
													onClick={() => {
														setSelectedProduct(product);
														setShowDeleteModal(true);
													}}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
													title="Delete"
													disabled={loading}
												>
													<FaTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{filteredProducts.length > 0 && (
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="text-sm text-gray-600">
						Showing{" "}
						<span className="font-semibold">
							{filteredProducts.length > 0
								? (currentPage - 1) * itemsPerPage + 1
								: 0}
						</span>{" "}
						to{" "}
						<span className="font-semibold">
							{Math.min(currentPage * itemsPerPage, filteredProducts.length)}
						</span>{" "}
						of <span className="font-semibold">{filteredProducts.length}</span>{" "}
						products
					</div>
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div className="flex flex-wrap gap-2">
							{deletedFilter === "deleted" ? (
								<button
									onClick={handleBulkRestore}
									className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-green-600 text-white hover:bg-green-700"
									disabled={loading || selectedProducts.length === 0}
								>
									<FaUndo /> Restore
								</button>
							) : (
								<>
									<button
										onClick={handleBulkActivate}
										className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-green-600 text-white hover:bg-green-700"
										disabled={loading || selectedProducts.length === 0}
									>
										<FaCheckCircle /> Activate
									</button>
									<button
										onClick={handleBulkDeactivate}
										className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-gray-600 text-white hover:bg-gray-700"
										disabled={loading || selectedProducts.length === 0}
									>
										<FaTimesCircle /> Deactivate
									</button>
								</>
							)}
							<button
								onClick={handleBulkDelete}
								className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-red-600 text-white hover:bg-red-700"
								disabled={loading || selectedProducts.length === 0}
							>
								<FaTrash /> Delete
							</button>
							{selectedProducts.length > 0 && (
								<button
									onClick={() => setSelectedProducts([])}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Clear
								</button>
							)}
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Items per page:</span>
							<select
								value={itemsPerPage}
								onChange={handleItemsPerPageChange}
								className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								disabled={loading}
							>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
							</select>
						</div> 

						<div className="flex items-center gap-2">
							<button
								onClick={goToFirstPage}
								disabled={currentPage === 1 || loading}
								className={`p-2 rounded-lg ${
									currentPage === 1 || loading
										? "text-gray-400 cursor-not-allowed"
										: "text-gray-700 hover:bg-gray-100"
								}`}
								title="First Page"
							>
								<FaAngleDoubleLeft />
							</button>

							<button
								onClick={goToPrevPage}
								disabled={currentPage === 1 || loading}
								className={`p-2 rounded-lg ${
									currentPage === 1 || loading
										? "text-gray-400 cursor-not-allowed"
										: "text-gray-700 hover:bg-gray-100"
								}`}
								title="Previous Page"
							>
								<FaAngleLeft />
							</button>

							<div className="flex items-center gap-1">
								{getPageNumbers().map((page, index) => (
									<button
										key={index}
										onClick={() =>
											typeof page === "number" ? goToPage(page) : null
										}
										className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg ${
											page === currentPage
												? "bg-blue-800 text-white"
												: page === "..."
													? "text-gray-500 cursor-default"
													: "text-gray-700 hover:bg-gray-100"
										}`}
										disabled={page === "..." || loading}
									>
										{page}
									</button>
								))}
							</div>

							<button
								onClick={goToNextPage}
								disabled={currentPage === totalPages || loading}
								className={`p-2 rounded-lg ${
									currentPage === totalPages || loading
										? "text-gray-400 cursor-not-allowed"
										: "text-gray-700 hover:bg-gray-100"
								}`}
								title="Next Page"
							>
								<FaAngleRight />
							</button>

							<button
								onClick={goToLastPage}
								disabled={currentPage === totalPages || loading}
								className={`p-2 rounded-lg ${
									currentPage === totalPages || loading
										? "text-gray-400 cursor-not-allowed"
										: "text-gray-700 hover:bg-gray-100"
								}`}
								title="Last Page"
							>
								<FaAngleDoubleRight />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Modal */}
			{showDeleteModal && selectedProduct && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
						<div className="p-6">
							<div className="text-red-600 mb-4">
								<FaTrash className="text-3xl mx-auto" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-2">
								Delete Product
							</h2>
							<p className="text-gray-600 mb-4">
								Are you sure you want to delete "{selectedProduct.name}"?
							</p>

							<div className="mb-4">
								<label className="flex items-center gap-2 mb-2">
									<input
										type="checkbox"
										id="permanentDelete"
										checked={permanentDelete}
										onChange={(e) => setPermanentDelete(e.target.checked)}
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
									/>
									<span className="text-sm text-gray-700">
										Permanent delete
									</span>
								</label>
								<p
									className={`text-xs ${
										permanentDelete ? "text-red-600" : "text-gray-500"
									}`}
								>
									{permanentDelete
										? "⚠️ Warning: This will permanently remove the product from the database and cannot be undone!"
										: "This will soft delete the product (is_deleted = 1). You can restore it later from the 'Deleted Products' view."}
								</p>
							</div>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => {
										setShowDeleteModal(false);
										setSelectedProduct(null);
										setPermanentDelete(false);
									}}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
									disabled={loading}
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteProduct}
									className={`px-4 py-2 rounded-lg ${
										permanentDelete
											? "bg-red-700 hover:bg-red-800"
											: "bg-red-600 hover:bg-red-700"
									} text-white`}
									disabled={loading}
								>
									{loading
										? "Deleting..."
										: permanentDelete
											? "Delete Permanently"
											: "Soft Delete"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Restore Modal */}
			{showRestoreModal && selectedProduct && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
						<div className="p-6">
							<div className="text-green-600 mb-4">
								<FaUndo className="text-3xl mx-auto" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-2">
								Restore Product
							</h2>
							<p className="text-gray-600 mb-4">
								Are you sure you want to restore "{selectedProduct.name}"?
							</p>
							<p className="text-sm text-gray-500 mb-4">
								This will restore the product to active status and make it
								available again.
							</p>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => {
										setShowRestoreModal(false);
										setSelectedProduct(null);
									}}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
									disabled={loading}
								>
									Cancel
								</button>
								<button
									onClick={handleRestoreProduct}
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
									disabled={loading}
								>
									{loading ? "Restoring..." : "Restore Product"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ManageProducts;