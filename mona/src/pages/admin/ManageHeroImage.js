import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaImage,
  FaSave,
  FaUndo,
  FaCheckCircle,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaTint,
  FaShieldAlt,
  FaEye,
  FaLink,
  FaCloudUploadAlt,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import {
  getHeroImage,
  uploadHeroImageFile,
  updateHeroImageUrl,
  resetHeroImage,
  SERVER_URL,
} from "../../services/api";

const DEFAULT_IMAGE = "/products/aquapure_copper_plus.png";

const ManageHeroImage = () => {
  const [currentImage, setCurrentImage] = useState(DEFAULT_IMAGE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" | "url"
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fileInputRef = useRef(null);

  // Helper to resolve image URL for display
  const resolveImageUrl = (url) => {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads/")) return `${SERVER_URL}${url}`;
    return url;
  };

  // Fetch current hero image from API
  const fetchCurrentImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHeroImage();
      if (res && res.image_url) {
        setCurrentImage(res.image_url);
        if (res.updated_at) {
          setLastUpdated(new Date(res.updated_at).toLocaleString());
        }
      }
    } catch (err) {
      console.error("Failed to load hero image setting:", err);
      setError("Could not load current settings. Using default fallback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentImage();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (PNG, JPG, WEBP, etc.).");
        return;
      }
      setSelectedFile(file);
      setError(null);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please drop a valid image file (PNG, JPG, WEBP).");
        return;
      }
      setSelectedFile(file);
      setError(null);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  };

  // Handle URL change
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setInputUrl(val);
    if (val.trim()) {
      setPreviewUrl(val.trim());
      setSelectedFile(null);
    } else {
      setPreviewUrl(null);
    }
  };

  // Clear preview
  const handleClearPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setInputUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save / Update Hero Image
  const handleSave = async (e) => {
    e.preventDefault();
    if (uploadMode === "file" && !selectedFile && !previewUrl) {
      setError("Please select or drop an image file first.");
      return;
    }
    if (uploadMode === "url" && !inputUrl.trim()) {
      setError("Please enter a valid image URL.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      let res;
      if (uploadMode === "file" && selectedFile) {
        res = await uploadHeroImageFile(selectedFile);
      } else if (inputUrl.trim()) {
        res = await updateHeroImageUrl(inputUrl.trim());
      } else {
        throw new Error("No image data to save");
      }

      if (res && res.success) {
        setCurrentImage(res.image_url);
        setLastUpdated(new Date().toLocaleString());
        setMessage(res.message || "Main section image updated successfully!");
        handleClearPreview();
        setTimeout(() => setMessage(null), 6000);
      } else {
        throw new Error(res?.message || "Failed to update main section image");
      }
    } catch (err) {
      console.error("Save hero image error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save image. Please verify admin login session."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Reset to default image
  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset the Home Page Main Section image to default?"
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await resetHeroImage();
      if (res && res.success) {
        setCurrentImage(DEFAULT_IMAGE);
        setLastUpdated(new Date().toLocaleString());
        handleClearPreview();
        setMessage("Main section image restored to default flagship model!");
        setTimeout(() => setMessage(null), 6000);
      }
    } catch (err) {
      console.error("Reset hero image error:", err);
      setError("Failed to reset image to default.");
    } finally {
      setSubmitting(false);
    }
  };

  // Active display image in preview card
  const displayImage = previewUrl || resolveImageUrl(currentImage);

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <FaImage className="text-xl" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
                Home Page Main Section Image
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Update or replace the main hero showcase purifier image on the Home Page
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            <FaExternalLinkAlt className="text-xs" />
            <span>View Live Home Page</span>
          </Link>

          <button
            onClick={fetchCurrentImage}
            disabled={loading}
            title="Refresh current image"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
          >
            <FaSyncAlt className={`text-sm ${loading ? "animate-spin text-sky-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-sm font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <FaCheckCircle className="text-lg text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-sm font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <FaExclamationCircle className="text-lg text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-700 hover:text-rose-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Upload & Controls Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Update Main Image
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose how you want to provide the new hero section image
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("file");
                    setError(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    uploadMode === "file"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FaCloudUploadAlt className="text-sm" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("url");
                    setError(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    uploadMode === "url"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FaLink className="text-xs" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* Mode 1: File Drag & Drop / Browser */}
            {uploadMode === "file" && (
              <div className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-sky-200 hover:border-sky-500 bg-sky-50/30 hover:bg-sky-50/60 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition duration-200 shadow-sm">
                    <FaCloudUploadAlt className="text-3xl" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to browse or drag & drop image here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PNG, JPG, WEBP (Recommended transparent PNG, min 600x600px)
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg">
                      <span>Selected: {selectedFile.name}</span>
                      <span className="text-[10px] text-sky-600">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Direct URL Input */}
            {uploadMode === "url" && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  Direct Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLink className="text-sm" />
                  </div>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/images/purifier.png"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Paste any public HTTPS image link or local path (e.g. <code>/products/...</code>)
                </p>
              </div>
            )}

            {/* Preview info if custom preview selected */}
            {previewUrl && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-medium text-amber-800">
                <span className="flex items-center gap-1.5">
                  <FaEye className="text-amber-600" />
                  <span>Showing unsaved preview. Click Save to apply to storefront.</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearPreview}
                  className="text-xs text-amber-700 hover:text-amber-900 underline font-bold"
                >
                  Discard
                </button>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={submitting || (!selectedFile && !inputUrl.trim() && !previewUrl)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaSave />
                <span>
                  {submitting ? "Saving to Storefront..." : "Save Main Image"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-sm disabled:opacity-50 transition"
              >
                <FaUndo className="text-xs text-slate-500" />
                <span>Reset to Default Image</span>
              </button>
            </div>
          </div>

          {/* Current Status Info Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Storefront Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Active on Home Section
              </span>
            </div>

            <div className="text-xs space-y-1.5 font-mono text-slate-300">
              <p className="truncate">
                <strong className="text-slate-400">Active Path:</strong>{" "}
                <span className="text-sky-300">{currentImage}</span>
              </p>
              {lastUpdated && (
                <p>
                  <strong className="text-slate-400">Last Changed:</strong>{" "}
                  <span>{lastUpdated}</span>
                </p>
              )}
            </div>

            <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">
              Note: Updating this image will <strong>only</strong> affect the Home Page Main (Hero) Section spotlight card. All product catalog cards will remain untouched.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Home Hero Mockup Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaEye className="text-sky-600 text-sm" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Storefront Preview
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                {previewUrl ? "Previewing Change" : "Current Published"}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              This is exactly how visitors will see the main section on your Home Page:
            </p>

            {/* Exact Replica of Home.js Hero Card */}
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-3xl p-5 shadow-xl border border-slate-200/80 relative overflow-hidden bg-gradient-to-b from-white via-white to-sky-50/30">
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-sm">
                    ★ Flagship 2026 Model
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Main Hero Section
                  </span>
                </div>

                {/* Purifier Hero Graphic Container */}
                <div className="h-64 rounded-2xl bg-white flex items-center justify-center relative p-3 mb-4 group overflow-hidden border border-slate-100 shadow-inner">
                  <img
                    src={displayImage}
                    alt="Home Page Hero Purifier Spotlight"
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />

                  {/* Floating Spec Tags */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-sky-700 shadow-sm border border-sky-100 flex items-center gap-1">
                    <FaTint className="text-sky-500 text-[10px]" />
                    <span>pH 8.5+ Alkaline</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1">
                    <FaShieldAlt className="text-emerald-500 text-[10px]" />
                    <span>99.9% Pure Copper</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="font-heading font-black text-base text-slate-900 leading-tight">
                        AquaPure Copper+ Alkaline
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dual Mineralization & In-Tank UV-C
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 line-through mr-1">
                        ₹19,999
                      </span>
                      <span className="font-heading font-black text-lg text-sky-600">
                        ₹15,999
                      </span>
                    </div>
                  </div>

                  <div className="w-full py-2.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                    <span>Book Free Demo For This Model</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHeroImage;
