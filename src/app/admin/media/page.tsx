"use client";

import * as React from "react";
import { MediaAsset } from "@/types";
import { formatFileSize, formatDate } from "@/lib/utils";
import {
  UploadCloud,
  Film,
  Video,
  Image as ImageIcon,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Filter,
  Play,
  Eye,
  X,
  Database,
  Layers,
  Sparkles
} from "lucide-react";

const PROJECT_OPTIONS = [
  { id: "proj-1", title: "Aura X1: The Silence of Speed" },
  { id: "proj-2", title: "Verve Chrono: Engineering Eternity" },
  { id: "proj-3", title: "Cognitive AI: Architecting The Mind" },
  { id: "proj-4", title: "Botanica: The Alchemist's Gin" },
  { id: "proj-5", title: "Kinetica: Sound Made Visible" },
  { id: "proj-6", title: "Sovereign: Wealth In Perpetual Motion" },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = React.useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [dataSource, setDataSource] = React.useState<string>("connecting");

  // Upload State
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatusText, setUploadStatusText] = React.useState("");
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Form Configuration
  const [uploadAssetType, setUploadAssetType] = React.useState<
    "original_video" | "playback_video" | "thumbnail"
  >("original_video");
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<
    "all" | "original_video" | "playback_video" | "thumbnail"
  >("all");

  // Preview Modal
  const [previewAsset, setPreviewAsset] = React.useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Fetch active media registry
  const fetchAssets = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setAssets(data.assets);
        setDataSource(data.source || "neon_postgresql");
      }
    } catch (err) {
      console.error("Failed to load media assets:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Handle Copy URL
  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Handle Real File Upload to Vercel Blob & Neon
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadStatusText("Validating asset and preparing Vercel Blob pipeline...");

    try {
      const selectedProject = PROJECT_OPTIONS.find((p) => p.id === selectedProjectId);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", uploadAssetType);
      if (selectedProject) {
        formData.append("associatedProjectId", selectedProject.id);
        formData.append("associatedProjectTitle", selectedProject.title);
      }

      // Track upload progress using XMLHttpRequest
      const xhr = new XMLHttpRequest();

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 90);
            setUploadProgress(percentComplete);
            setUploadStatusText(
              `Uploading to Vercel Blob: ${formatFileSize(event.loaded)} / ${formatFileSize(
                event.total
              )} (${percentComplete}%)`
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            setUploadStatusText("Writing metadata to Neon PostgreSQL registry...");
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success && response.asset) {
                setAssets((prev) => [response.asset, ...prev]);
                setUploadSuccess(
                  `Successfully uploaded "${file.name}" to Vercel Blob and recorded in Neon!`
                );
                resolve();
              } else {
                reject(new Error(response.error || "Upload succeeded but failed to parse response."));
              }
            } catch (parseErr) {
              reject(new Error("Invalid server response format."));
            }
          } else {
            try {
              const errResp = JSON.parse(xhr.responseText);
              reject(new Error(errResp.error || `Upload failed with HTTP status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with HTTP status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network transmission error occurred during upload."));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload operation was cancelled."));
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      // Clear input and reload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError((err as Error).message || "Upload failed. Please check network connection.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Handle Asset Deletion
  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (!confirm(`Are you sure you want to delete "${asset.filename}"? This will permanently purge the file from Vercel Blob and delete the database record.`)) {
      return;
    }

    setDeletingId(asset.id);
    try {
      const res = await fetch(`/api/media?id=${asset.id}&url=${encodeURIComponent(asset.url)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      } else {
        alert(data.error || "Failed to delete media asset.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error during asset deletion.");
    } finally {
      setDeletingId(null);
    }
  };

  // Calculations
  const totalStorageBytes = assets.reduce((sum, item) => sum + Number(item.fileSize || 0), 0);
  const masterCount = assets.filter((a) => a.assetType === "original_video").length;
  const playbackCount = assets.filter((a) => a.assetType === "playback_video").length;
  const thumbnailCount = assets.filter((a) => a.assetType === "thumbnail").length;

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = selectedFilter === "all" || asset.assetType === selectedFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.associatedProjectTitle &&
        asset.associatedProjectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.mimeType && asset.mimeType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Video & Media Asset Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Vercel Blob Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            High-capacity commercial video storage with Triple-Asset Architecture and real-time Neon PostgreSQL registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAssets}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh assets from Neon"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-400" : ""}`} />
            <span>Sync</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-mono">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage: {formatFileSize(totalStorageBytes)}</span>
          </div>
        </div>
      </div>

      {/* Vercel Blob Uploader Container */}
      <div className="p-6 sm:p-8 rounded-3xl border border-gold-500/40 bg-card flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-gold-400" />
              <span>Direct Vercel Blob Media Uploader</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct edge ingest for Apple ProRes 422/4444, RED RAW, 4K Master MOV, H.264/H.265 MP4, and high-res posters.
            </p>
          </div>

          {/* Asset Role Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-background border border-border/80">
            <button
              type="button"
              onClick={() => setUploadAssetType("original_video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                uploadAssetType === "original_video"
                  ? "bg-purple-600 text-white font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1. 4K Original Master
            </button>
            <button
              type="button"
              onClick={() => setUploadAssetType("playback_video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                uploadAssetType === "playback_video"
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2. Web Playback Stream
            </button>
            <button
              type="button"
              onClick={() => setUploadAssetType("thumbnail")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                uploadAssetType === "thumbnail"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3. Poster Thumbnail
            </button>
          </div>
        </div>

        {/* Project Association Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-background/60 border border-border/60 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="w-4 h-4 text-gold-400" />
            <span className="font-medium text-foreground">Associate with Commercial Project (Optional):</span>
          </div>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
          >
            <option value="">-- Standalone / Unassigned Asset --</option>
            {PROJECT_OPTIONS.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.title}
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging
              ? "border-gold-500 bg-gold-500/10 scale-[1.01]"
              : "border-border/80 hover:border-gold-500/60 bg-background/50 hover:bg-background/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept={
              uploadAssetType === "thumbnail"
                ? "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                : "video/mp4,video/quicktime,video/webm,video/x-matroska,.mov,.mp4"
            }
            className="hidden"
          />

          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
              uploadAssetType === "original_video"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                : uploadAssetType === "playback_video"
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {uploadAssetType === "thumbnail" ? (
              <ImageIcon className="w-7 h-7" />
            ) : uploadAssetType === "playback_video" ? (
              <Film className="w-7 h-7" />
            ) : (
              <FileVideo className="w-7 h-7" />
            )}
          </div>

          <h4 className="text-sm font-bold text-foreground mb-1">
            {isDragging
              ? "Release file to initiate Vercel Blob ingest"
              : `Select or Drag & Drop ${
                  uploadAssetType === "thumbnail"
                    ? "Poster Thumbnail Image"
                    : uploadAssetType === "playback_video"
                    ? "Web Playback Stream Video"
                    : "4K ProRes / Master Video"
                }`}
          </h4>

          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            {uploadAssetType === "thumbnail"
              ? "Accepts JPG, PNG, WebP up to 50MB. Automatically linked as poster thumbnail for project reels."
              : uploadAssetType === "playback_video"
              ? "Accepts H.264/H.265 MP4 or WebM. Optimized for instant zero-buffering browser playback."
              : "Accepts Apple ProRes 422/4444, QuickTime MOV, RED RAW, and 4K masters up to 500MB via Vercel Blob store."}
          </p>

          {isUploading ? (
            <div className="w-full max-w-md flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gold-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                  {uploadStatusText}
                </span>
                <span className="font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Browse Local Files</span>
            </button>
          )}
        </div>

        {/* Feedback Alerts */}
        {uploadError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Asset Library Table & Controls */}
      <div className="p-6 rounded-3xl border border-border/80 bg-card overflow-hidden flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Active Media Storage Registry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live records persisted in Neon PostgreSQL ({assets.length} total files)
            </p>
          </div>

          {/* Search & Role Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filename or project..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono w-full sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedFilter === "all"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({assets.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("original_video")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedFilter === "original_video"
                    ? "bg-purple-500/20 text-purple-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Masters ({masterCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("playback_video")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedFilter === "playback_video"
                    ? "bg-blue-500/20 text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Web ({playbackCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("thumbnail")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedFilter === "thumbnail"
                    ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Posters ({thumbnailCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">Associated Project</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                      <span>Loading media assets from Neon PostgreSQL...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No media assets match your query. Drop a file above to upload to Vercel Blob.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-muted/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 overflow-hidden">
                          {asset.assetType === "thumbnail" ? (
                            <img
                              src={asset.url}
                              alt={asset.filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Film className="w-4 h-4 text-gold-400" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[200px] sm:max-w-[280px]" title={asset.filename}>
                            {asset.filename}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate">
                            {asset.mimeType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold whitespace-nowrap ${
                          asset.assetType === "original_video"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : asset.assetType === "playback_video"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {asset.assetType.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-gold-400 whitespace-nowrap">
                      {asset.formattedSize}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-mono whitespace-nowrap">
                      {asset.dimensions || "3840x2160"}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      <span className="truncate max-w-[180px] block" title={asset.associatedProjectTitle || "Unassigned"}>
                        {asset.associatedProjectTitle || "Unassigned"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                      {formatDate(asset.uploadedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewAsset(asset)}
                          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted hover:border-gold-500/40 transition-colors"
                          title="Preview Media"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyUrl(asset.url, asset.id)}
                          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted hover:border-gold-500/40 transition-colors"
                          title="Copy Blob URL"
                        >
                          {copiedId === asset.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted hover:border-gold-500/40 transition-colors"
                          title="Open CDN link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          disabled={deletingId === asset.id}
                          onClick={() => handleDeleteAsset(asset)}
                          className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-border/80">
              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground text-sm font-mono truncate max-w-md">
                  {previewAsset.filename}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  {previewAsset.assetType.replace("_", " ")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex items-center justify-center bg-black/40 overflow-auto">
              {previewAsset.assetType === "thumbnail" ||
              previewAsset.mimeType.startsWith("image/") ? (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.filename}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-md"
                />
              ) : (
                <video
                  src={previewAsset.url}
                  controls
                  autoPlay
                  className="max-h-[60vh] max-w-full rounded-xl shadow-md"
                >
                  Your browser does not support HTML5 video preview.
                </video>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Size: <strong className="text-foreground">{previewAsset.formattedSize}</strong></span>
                <span>Type: <strong className="text-foreground">{previewAsset.mimeType}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-foreground flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full CDN URL</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
