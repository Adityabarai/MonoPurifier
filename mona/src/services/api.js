import axios from "axios";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "https://monopurifier.onrender.com/api"
    : "http://localhost:5000/api");

// The server base origin (without /api) for serving media like /uploads/
export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor helper: attach Bearer token to requests
const attachAuthToken = (config) => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuthToken);
axios.interceptors.request.use(attachAuthToken);

// Products API
export const getProducts = async (includeDeleted = false) => {
  const res = await api.get("/products", {
    params: { includeDeleted: includeDeleted.toString() },
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const saveProduct = async (productData) => {
  const res = await api.post("/products/save", productData);
  return res.data;
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const bulkDeleteProducts = async (ids) => {
  const res = await api.post("/products/bulk-delete", { ids });
  return res.data;
};

// Admin Auth API
export const loginAdmin = async (username, password) => {
  const res = await api.post("/admin/login", { username, password });
  return res.data;
};

// Customer Leads API
export const submitLead = async (leadData) => {
  const res = await api.post("/leads", leadData);
  return res.data;
};

export const getLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};

export const updateLeadStatus = async (id, status, notes) => {
  const res = await api.patch(`/leads/${id}/status`, { status, notes });
  return res.data;
};

export const deleteLead = async (id) => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};

export default api;

