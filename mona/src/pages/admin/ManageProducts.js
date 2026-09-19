import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
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
  FaInfoCircle,
  FaBoxes,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL, SERVER_URL } from "../../services/api";

const ManageProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = API_BASE_URL;

  const resolveProductImg = (url, name = "") => {
    const n = (name || "").toLowerCase();
    if (n.includes("copper")) return "/products/aquapure_copper_plus.png";
    if (n.includes("uv pro") || n.includes("uv"))
      return "/products/aquapure_uv_pro.png";
    if (n.includes("compact")) return "/products/aquapure_compact.png";
    if (n.includes("alkaline")) return "/products/aquapure_alkaline_max.png";
    if (n.includes("basic")) return "/products/aquapure_basic.png";
    if (n.includes("elite") || n.includes("ro"))
      return "/products/aquapure_ro_elite.png";

    if (!url) return "/products/aquapure_ro_elite.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) return `${SERVER_URL}${url}`;
    return url;
  };

  const staticCategories = [
    "RO Purifier",
    "UV Purifier",
    "Alkaline RO",
    "Wall Mount RO",
    "Commercial RO",
    "Filter & Spare",
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
    }, 4000);
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
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(q) ||
          product.category?.toLowerCase().includes(q) ||
          product.description?.toLowerCase().includes(q) ||
          product.technology?.toLowerCase().includes(q)
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

  // Quick stats
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === 1 && p.is_deleted === 0).length;
    const inactive = products.filter((p) => p.status === 0 && p.is_deleted === 0).length;
    const deleted = products.filter((p) => p.is_deleted === 1).length;
    return { total, active, inactive, deleted };
  }, [products]);

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
        `Product ${action === "activate" ? "activated" : "deactivated"} successfully!`,
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
      showAlertMessage("Please select at least one product", "warning");
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
      showAlertMessage(`${selectedProducts.length} product(s) activated!`, "success");
    } catch (error) {
      console.error("Error bulk activating:", error);
      showAlertMessage("Failed to activate products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) {
      showAlertMessage("Please select at least one product", "warning");
      return;
    }
    try {
      setLoading(true);
      const promises = selectedProducts.map((id) =>
        axios.patch(`${API_URL}/products/${id}/status`, { action: "deactivate" })
      );
      await Promise.all(promises);
      await fetchProducts();
      setSelectedProducts([]);
      setSelectAll(false);
      showAlertMessage(`${selectedProducts.length} product(s) deactivated!`, "success");
    } catch (error) {
      console.error("Error bulk deactivating:", error);
      showAlertMessage("Failed to deactivate products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      if (permanentDelete) {
        await axios.delete(
          `${API_URL}/products/${selectedProduct.product_id}/permanent`
        );
        showAlertMessage("Product permanently deleted!", "success");
      } else {
        await axios.delete(`${API_URL}/products/${selectedProduct.product_id}`);
        showAlertMessage("Product moved to archive!", "success");
      }
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setPermanentDelete(false);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      showAlertMessage("Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      showAlertMessage("Please select at least one product", "warning");
      return;
    }
    if (!window.confirm(`Move ${selectedProducts.length} products to archive?`)) return;
    try {
      setLoading(true);
      const promises = selectedProducts.map((id) =>
        axios.delete(`${API_URL}/products/${id}`)
      );
      await Promise.all(promises);
      await fetchProducts();
      setSelectedProducts([]);
      setSelectAll(false);
      showAlertMessage(`${selectedProducts.length} product(s) moved to archive!`, "success");
    } catch (error) {
      console.error("Error bulk deleting:", error);
      showAlertMessage("Failed to delete selected products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreProduct = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      await axios.patch(`${API_URL}/products/${selectedProduct.product_id}/restore`);
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
      showAlertMessage("Please select products to restore", "warning");
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
      showAlertMessage(`${selectedProducts.length} product(s) restored!`, "success");
    } catch (error) {
      console.error("Error bulk restoring:", error);
      showAlertMessage("Failed to restore products", "error");
    } finally {
      setLoading(false);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaChevronDown className="text-[9px] text-slate-300 opacity-0 group-hover:opacity-100" />;
    return sortConfig.direction === "asc" ? (
      <FaChevronUp className="text-[9px] text-sky-600" />
    ) : (
      <FaChevronDown className="text-[9px] text-sky-600" />
    );
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {showAlert && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up ${
            alertType === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : alertType === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : alertType === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-sky-50 border-sky-200 text-sky-800"
          }`}
        >
          {alertType === "success" ? (
            <FaCheckCircle className="text-emerald-600 text-sm" />
          ) : alertType === "error" ? (
            <FaTimesCircle className="text-rose-600 text-sm" />
          ) : (
            <FaInfoCircle className="text-sky-600 text-sm" />
          )}
          <span>{alertMessage}</span>
          <button onClick={hideAlert} className="ml-2 text-slate-400 hover:text-slate-600">
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Header Bar with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Product Catalog
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              {products.length} Models
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage purifier inventory, live pricing, specifications, and availability
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchProducts}
            disabled={loading}
            title="Refresh Products"
            className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition"
          >
            <FaSync className={`text-sm ${loading ? "animate-spin text-sky-600" : ""}`} />
          </button>

          <button
            onClick={() => navigate("/admin/addormodifyproducts")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-sky-500/20 transition"
          >
            <FaPlus className="text-xs" />
            <span>Add Purifier</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          onClick={() => {
            setStatusFilter("all");
            setDeletedFilter("active");
          }}
          className={`px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition ${
            statusFilter === "all" && deletedFilter === "active"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Active ({stats.active})
        </button>

        <button
          onClick={() => {
            setStatusFilter("inactive");
            setDeletedFilter("active");
          }}
          className={`px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition ${
            statusFilter === "inactive"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Draft / Inactive ({stats.inactive})
        </button>

        <button
          onClick={() => {
            setDeletedFilter(deletedFilter === "deleted" ? "active" : "deleted");
          }}
          className={`px-3.5 py-1.5 rounded-xl border text-sm font-semibold transition ${
            deletedFilter === "deleted"
              ? "bg-rose-600 text-white border-rose-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Archived / Deleted ({stats.deleted})
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by product name, category, technology, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-sky-500 focus:outline-none transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {staticCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || categoryFilter !== "all" || statusFilter !== "all" || deletedFilter !== "active") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setDeletedFilter("active");
              }}
              className="text-sm font-bold text-sky-600 hover:text-sky-700 px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-slide-up text-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
              {selectedProducts.length}
            </span>
            <span className="font-semibold">Selected product(s)</span>
          </div>

          <div className="flex items-center gap-2">
            {deletedFilter === "deleted" ? (
              <button
                onClick={handleBulkRestore}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition text-xs"
              >
                <FaUndo className="text-xs" /> Restore
              </button>
            ) : (
              <>
                <button
                  onClick={handleBulkActivate}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition text-xs"
                >
                  <FaCheck className="text-xs" /> Activate
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold flex items-center gap-1.5 transition text-xs"
                >
                  <FaTimes className="text-xs" /> Deactivate
                </button>
              </>
            )}

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition text-xs"
            >
              <FaTrash className="text-xs" /> Delete
            </button>

            <button
              onClick={() => setSelectedProducts([])}
              className="text-slate-400 hover:text-white px-2 py-1 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <FaSync className="animate-spin text-2xl mx-auto mb-2 text-sky-500" />
            <p className="text-sm font-medium">Loading catalog models...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FaBoxes className="text-3xl mx-auto mb-2 text-slate-300" />
            <p className="text-base font-bold text-slate-700">No products match your criteria</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search query or reset category/status filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                  </th>
                  <th
                    className="py-3.5 px-3.5 cursor-pointer hover:text-slate-900 group"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Product Model {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3.5 cursor-pointer hover:text-slate-900 group"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      Category {getSortIcon("category")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3.5 cursor-pointer hover:text-slate-900 group"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price & Offer {getSortIcon("price")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3.5 cursor-pointer hover:text-slate-900 group"
                    onClick={() => handleSort("rating")}
                  >
                    <div className="flex items-center gap-1">
                      Rating {getSortIcon("rating")}
                    </div>
                  </th>
                  <th className="py-3.5 px-3.5">Badge</th>
                  <th className="py-3.5 px-3.5 text-center">Status</th>
                  <th className="py-3.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {currentItems.map((product) => {
                  const isSelected = selectedProducts.includes(product.product_id);
                  const isDeleted = product.is_deleted === 1;

                  return (
                    <tr
                      key={product.product_id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-sky-50/50" : isDeleted ? "bg-rose-50/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectProduct(product.product_id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail + Name + Tech */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 p-1">
                            <img
                              src={resolveProductImg(product.image_url, product.name)}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/products/aquapure_ro_elite.png";
                              }}
                            />
                          </div>

                          <div className="min-w-0 max-w-xs">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5">
                              {product.technology || product.capacity || "Water Purifier"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {product.category || "Purifier"}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 text-sm md:text-base font-heading">
                            ₹{Number(product.price || 0).toLocaleString()}
                          </span>
                          {product.original_price > product.price && (
                            <span className="text-xs sm:text-sm text-slate-400 line-through">
                              ₹{Number(product.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {product.discount_amount > 0 && (
                          <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                            Save ₹{Number(product.discount_amount).toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <FaStar className="text-amber-400 text-xs sm:text-sm" />
                          <span className="font-bold text-slate-800">
                            {product.rating ? product.rating.toFixed(1) : "—"}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-400">
                            ({product.reviews_count || 0})
                          </span>
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3.5 px-3.5">
                        {product.badge ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 text-center">
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Archived
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(product.product_id, product.status)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                              product.status === 1
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                product.status === 1 ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            ></span>
                            <span>{product.status === 1 ? "Active" : "Inactive"}</span>
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isDeleted ? (
                            <>
                              <button
                                onClick={() =>
                                  navigate(`/admin/addormodifyproducts/${product.product_id}`)
                                }
                                className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition"
                                title="Edit Product"
                              >
                                <FaEdit className="text-sm" />
                              </button>

                              <button
                                onClick={() =>
                                  handleToggleStatus(product.product_id, product.status)
                                }
                                className={`p-2 rounded-xl transition ${
                                  product.status === 1
                                    ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                                title={product.status === 1 ? "Deactivate" : "Activate"}
                              >
                                {product.status === 1 ? (
                                  <FaPowerOff className="text-sm" />
                                ) : (
                                  <FaPlay className="text-sm" />
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                title="Delete/Archive Product"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowRestoreModal(true);
                                }}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                                title="Restore Product"
                              >
                                <FaUndo className="text-sm" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setPermanentDelete(true);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                title="Permanently Delete"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination & Summary Footer */}
        {filteredProducts.length > 0 && (
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-3">
            <div>
              Showing{" "}
              <span className="font-bold text-slate-800">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-800">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">{filteredProducts.length}</span>{" "}
              models
            </div>

            <div className="flex items-center gap-3.5">
              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-sky-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              {/* Page buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="First Page"
                >
                  <FaAngleDoubleLeft className="text-xs" />
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Previous"
                >
                  <FaAngleLeft className="text-xs" />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    disabled={page === "..."}
                    className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-xl text-sm font-bold transition ${
                      page === currentPage
                        ? "bg-sky-600 text-white shadow-sm"
                        : page === "..."
                        ? "text-slate-400 cursor-default"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Next"
                >
                  <FaAngleRight className="text-xs" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Last Page"
                >
                  <FaAngleDoubleRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-lg">
              <FaTrash />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                {permanentDelete ? "Permanently Delete Model?" : "Archive Product Model?"}
              </h2>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-800">"{selectedProduct.name}"</span>?
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="permanentDelete"
                  checked={permanentDelete}
                  onChange={(e) => setPermanentDelete(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="font-bold text-slate-700">Permanent Delete</span>
              </label>
              <p className="text-[11px] text-slate-400">
                {permanentDelete
                  ? "⚠️ Warning: This will erase the record completely from the database."
                  : "Soft delete: Model will be hidden from the customer storefront and can be restored later."}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                  setPermanentDelete(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
                disabled={loading}
              >
                {loading ? "Deleting..." : permanentDelete ? "Delete Forever" : "Move to Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg">
              <FaUndo />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                Restore Purifier Model?
              </h2>
              <p className="text-xs text-slate-500">
                Restore <span className="font-bold text-slate-800">"{selectedProduct.name}"</span> back to active product catalog?
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreProduct}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                disabled={loading}
              >
                {loading ? "Restoring..." : "Restore Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;