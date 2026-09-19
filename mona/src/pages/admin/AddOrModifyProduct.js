import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUpload, FaImage, FaTimes, FaStar, FaCheckCircle } from "react-icons/fa";
import {
  getProductById,
  saveProduct,
  uploadProductImage,
  getHeroImage,
  updateHeroImageUrl,
  SERVER_URL,
} from "../../services/api";

const AddOrModifyProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

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
    technology: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHeroImage, setIsHeroImage] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState("");
  const [settingHero, setSettingHero] = useState(false);

  const staticCategories = [
    "Water Purifier",
    "Filter",
    "Accessories",
    "Spare Parts",
    "Installation Kit",
  ];

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const product = await getProductById(id);
      setFormData({
        name: product.name || "",
        category: product.category || "",
        badge: product.badge || "",
        rating: product.rating || "",
        reviews_count: product.reviews_count || "",
        price: product.price || "",
        original_price: product.original_price || "",
        discount_amount: product.discount_amount || "",
        capacity: product.capacity || "",
        technology: product.technology || "",
        description: product.description || "",
      });
      if (product.image_url) {
        setExistingImageUrl(product.image_url);
        let resolved = product.image_url;
        if (product.image_url.startsWith("http://") || product.image_url.startsWith("https://")) {
          resolved = product.image_url;
        } else if (product.image_url.startsWith("/uploads/")) {
          resolved = `${SERVER_URL}${product.image_url}`;
        } else if (product.image_url.startsWith("/products/")) {
          resolved = product.image_url;
        } else {
          // If legacy broken path like /images/elite.png, resolve gracefully
          const n = (product.name || "").toLowerCase();
          if (n.includes("uv")) resolved = "/products/aquapure_uv_pro.png";
          else if (n.includes("copper")) resolved = "/products/aquapure_copper_plus.png";
          else resolved = "/products/aquapure_ro_elite.png";
        }
        setImagePreview(resolved);

        // Check if this product is currently the hero image
        try {
          const heroRes = await getHeroImage();
          if (
            heroRes?.image_url &&
            (heroRes.image_url === product.image_url ||
              heroRes.image_url.endsWith(product.image_url.split("/").pop()))
          ) {
            setIsHeroImage(true);
          }
        } catch (_) {}
      }
    } catch (err) {
      setError("Failed to load product data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) fetchProduct();
  }, [isEditMode, fetchProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setError("");

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSetHeroNow = async () => {
    const activeUrl = imagePreview?.startsWith("blob:") ? null : (existingImageUrl || imagePreview);
    if (!activeUrl) {
      setError("Please save the product first so the image is permanently stored.");
      return;
    }
    setSettingHero(true);
    try {
      await updateHeroImageUrl(activeUrl);
      setIsHeroImage(true);
      setHeroSuccess("This image is now set as the Home Page Main Section Image!");
      setTimeout(() => setHeroSuccess(""), 5000);
    } catch (e) {
      setError("Failed to set as hero image: " + (e.message || ""));
    } finally {
      setSettingHero(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category || !formData.price) {
      setError("Name, category, and price are required fields");
      return;
    }

    setLoading(true);
    try {
      // Upload image if new file selected
      let image_url = existingImageUrl;
      if (imageFile) {
        const uploadRes = await uploadProductImage(imageFile);
        image_url = uploadRes.image_url;
      }

      const productData = {
        ...(isEditMode && { product_id: parseInt(id) }),
        ...formData,
        image_url,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : 0,
        price: parseInt(formData.price) || 0,
        original_price: formData.original_price ? parseInt(formData.original_price) : null,
        discount_amount: formData.discount_amount ? parseInt(formData.discount_amount) : null,
      };

      await saveProduct(productData);

      // If set as hero image, update hero image settings as well
      if (isHeroImage && image_url) {
        try {
          await updateHeroImageUrl(image_url);
        } catch (e) {
          console.warn("Hero image update notice:", e);
        }
      }

      navigate("/admin/manageproducts", {
        state: {
          successMessage: isEditMode
            ? "Product updated successfully!" + (isHeroImage ? " Set as Home Main Image." : "")
            : "Product created successfully!" + (isHeroImage ? " Set as Home Main Image." : ""),
        },
      });
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.response?.status === 403) {
        setError("Authentication required. Please login first.");
      } else {
        setError(err.response?.data?.message || "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-2 text-gray-500">
              {isEditMode ? "Update product information below" : "Fill in the details to add a new product"}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/products/aquapure_ro_elite.png";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <FaImage className="text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload image</p>
                    <p className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  <FaUpload /> {imagePreview ? "Change Image" : "Upload Image"}
                </button>
              </div>

              {/* Home Page Main Section (Hero) Image Option */}
              <div
                className={`mt-4 p-4 rounded-xl border transition ${
                  isHeroImage
                    ? "bg-amber-50/90 border-amber-300 shadow-sm"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`p-2 rounded-xl text-base ${
                        isHeroImage
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <FaStar />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Set as Home Page Main Section Image</span>
                        {isHeroImage && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                            Active Hero
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Feature this product's image as the flagship purifier spotlight on the Home Page hero banner.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isHeroImage}
                      onChange={(e) => setIsHeroImage(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {heroSuccess && (
                  <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                    <FaCheckCircle className="text-emerald-600 text-sm shrink-0" />
                    <span>{heroSuccess}</span>
                  </div>
                )}

                {isEditMode && existingImageUrl && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {isHeroImage
                        ? "★ Currently set as Home Page Main Image"
                        : "Not set on home page"}
                    </span>
                    <button
                      type="button"
                      onClick={handleSetHeroNow}
                      disabled={settingHero}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <FaStar className="text-[10px]" />
                      <span>
                        {settingHero ? "Setting..." : "Set as Home Main Image Now"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {staticCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Discount & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount
                </label>
                <input
                  type="number"
                  name="discount_amount"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="e.g., Best Seller, New"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1" min="0" max="5"
                  placeholder="0.0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviews Count
                </label>
                <input
                  type="number"
                  name="reviews_count"
                  value={formData.reviews_count}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 10L, 15L"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Technology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology
              </label>
              <input
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                placeholder="e.g., RO+UV, UV+UF"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product description"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/manageproducts")}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : isEditMode ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrModifyProduct;