import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddOrModifyProduct = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState({
		name: "",
		category: "",
		badge: "",
		rating: "",
		reviews_count: "",
		price: "",
		original_price: "",
		discount_amount: "",
		capacity: "",
		image_url: "",
		technology: "",
		description: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchProduct = useCallback(async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`http://localhost:5000/api/products/${id}`,
			);
			setFormData(response.data);
		} catch (err) {
			setError("Failed to load product data");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (isEditMode) {
			fetchProduct();
		}
	}, [isEditMode, fetchProduct]); // Fixed: Added missing dependencies

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Validate required fields
		if (!formData.name || !formData.category || !formData.price) {
			setError("Name, category, and price are required fields");
			setLoading(false);
			return;
		}

		try {
			const token =
				localStorage.getItem("adminToken") ||
				sessionStorage.getItem("adminToken");
			const headers = {
				"Content-Type": "application/json",
			};
			if (token) {
				headers["Authorization"] = `Bearer ${token}`;
			}

			const productData = {
				...formData,
				rating: formData.rating ? parseFloat(formData.rating) : null,
				reviews_count: formData.reviews_count
					? parseInt(formData.reviews_count)
					: 0,
				price: parseInt(formData.price) || 0,
				original_price: formData.original_price
					? parseInt(formData.original_price)
					: null,
				discount_amount: formData.discount_amount
					? parseInt(formData.discount_amount)
					: null,
			};

			let response;
			if (isEditMode) {
				response = await axios.put(
					`http://localhost:5000/api/products/${id}`,
					productData,
					{ headers },
				);
			} else {
				response = await axios.post(
					"http://localhost:5000/api/products",
					productData,
					{ headers },
				);
			}

			console.log("Product saved successfully:", response.data);
			setLoading(false);
			alert(
				isEditMode
					? "Product updated successfully!"
					: "Product created successfully!",
			);
			navigate("/admin/manageproducts");
		} catch (error) {
			console.error("Error saving product:", error);
			setLoading(false);

			if (error.response) {
				if (error.response.status === 403) {
					setError("Authentication required. Please login first.");
				} else if (error.response.status === 400) {
					setError(error.response.data.message || "Invalid data provided");
				} else {
					setError(error.response.data.message || "Failed to save product");
				}
			} else if (error.request) {
				setError("Server not responding. Please check if backend is running.");
			} else {
				setError("An error occurred. Please try again.");
			}
		}
	};

	const handleCancel = () => {
		navigate("/admin/manageproducts");
	};

	if (loading && isEditMode) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background-light">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-text-secondary">Loading product data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background-light py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 animate-fade-in">
					{/* Header */}
					<div className="mb-6">
						<h2 className="text-3xl font-bold text-text-primary">
							{isEditMode ? "Edit Product" : "Add New Product"}
						</h2>
						<p className="mt-2 text-text-secondary">
							{isEditMode
								? "Update product information below"
								: "Fill in the details to add a new product"}
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 bg-red-50 border-l-4 border-danger p-4 rounded animate-slide-up">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-danger"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-danger font-medium">{error}</p>
								</div>
							</div>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Product Name */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Product Name <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								placeholder="Enter product name"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
							/>
						</div>

						{/* Category */}
						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Category <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								required
								placeholder="e.g., Solar Inverter, Battery"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
							/>
						</div>

						{/* Price Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="price"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Price <span className="text-danger">*</span>
								</label>
								<input
									type="number"
									id="price"
									name="price"
									value={formData.price}
									onChange={handleChange}
									required
									placeholder="0"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>

							<div>
								<label
									htmlFor="original_price"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Original Price
								</label>
								<input
									type="number"
									id="original_price"
									name="original_price"
									value={formData.original_price}
									onChange={handleChange}
									placeholder="0"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>
						</div>

						{/* Discount & Badge Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="discount_amount"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Discount Amount
								</label>
								<input
									type="number"
									id="discount_amount"
									name="discount_amount"
									value={formData.discount_amount}
									onChange={handleChange}
									placeholder="0"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>

							<div>
								<label
									htmlFor="badge"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Badge
								</label>
								<input
									type="text"
									id="badge"
									name="badge"
									value={formData.badge}
									onChange={handleChange}
									placeholder="e.g., Best Seller, New"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>
						</div>

						{/* Rating & Reviews Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="rating"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Rating
								</label>
								<input
									type="number"
									id="rating"
									name="rating"
									value={formData.rating}
									onChange={handleChange}
									step="0.1"
									min="0"
									max="5"
									placeholder="0.0"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>

							<div>
								<label
									htmlFor="reviews_count"
									className="block text-sm font-medium text-text-primary mb-2"
								>
									Reviews Count
								</label>
								<input
									type="number"
									id="reviews_count"
									name="reviews_count"
									value={formData.reviews_count}
									onChange={handleChange}
									placeholder="0"
									className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
								/>
							</div>
						</div>

						{/* Capacity */}
						<div>
							<label
								htmlFor="capacity"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Capacity
							</label>
							<input
								type="text"
								id="capacity"
								name="capacity"
								value={formData.capacity}
								onChange={handleChange}
								placeholder="e.g., 5kW, 100Ah"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
							/>
						</div>

						{/* Technology */}
						<div>
							<label
								htmlFor="technology"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Technology
							</label>
							<input
								type="text"
								id="technology"
								name="technology"
								value={formData.technology}
								onChange={handleChange}
								placeholder="e.g., MPPT, Lithium-ion"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
							/>
						</div>

						{/* Image URL */}
						<div>
							<label
								htmlFor="image_url"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Image URL
							</label>
							<input
								type="url"
								id="image_url"
								name="image_url"
								value={formData.image_url}
								onChange={handleChange}
								placeholder="https://example.com/image.jpg"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200"
							/>
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-text-primary mb-2"
							>
								Description
							</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows="4"
								placeholder="Enter product description"
								className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 resize-none"
							/>
						</div>

						{/* Form Actions */}
						<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border-light">
							<button
								type="button"
								onClick={handleCancel}
								disabled={loading}
								className="flex-1 px-6 py-3 bg-gray-100 text-text-primary font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
							>
								{loading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Saving...
									</>
								) : isEditMode ? (
									"Update Product"
								) : (
									"Add Product"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddOrModifyProduct;