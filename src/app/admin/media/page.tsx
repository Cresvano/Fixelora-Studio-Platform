"use client";

import * as React from "react";
import { MOCK_MEDIA_ASSETS } from "@/lib/data/media";
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
  Eye,
  RefreshCw
} from "lucide-react";

export default function AdminMediaPage() {
  const [assets, setAssets] = React.useState<MediaAsset[]>(MOCK_MEDIA_ASSETS);
  const [isSimulatingUpload, setIsSimulatingUpload] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadAssetType, setUploadAssetType] = React.useState<"original_video" | "playback_video" | "thumbnail">("original_video");

  const totalBytes = assets.reduce((acc, curr) => acc + curr.fileSize, 0);

  const handleSimulateUpload = () => {
    setIsSimulatingUpload(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          const newAsset: MediaAsset = {
            id: `media-${Date.now()}`,
            filename:
              uploadAssetType === "original_video"
                ? "NEW_COMMERCIAL_MASTER_PRORES4444_4K.mov"
                : uploadAssetType === "playback_video"
                ? "NEW_COMMERCIAL_WEB_STREAM_H265.mp4"
                : "NEW_COMMERCIAL_POSTER.jpg",
            assetType: uploadAssetType,
            fileSize:
              uploadAssetType === "original_video"
                ? 12400000000 // 12.4 GB
                : uploadAssetType === "playback_video"
                ? 38000000 // 38 MB
                : 1800000, // 1.8 MB
            formattedSize:
              uploadAssetType === "original_video"
                ? "12.40 GB"
                : uploadAssetType === "playback_video"
                ? "38.0 MB"
                : "1.8 MB",
            mimeType:
              uploadAssetType === "thumbnail" ? "image/jpeg" : "video/quicktime",
            dimensions: "3840x2160",
            duration: "1:00",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            uploadedAt: new Date().toISOString(),
          };
          setAssets([newAsset, ...assets]);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Video & Media Asset Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cloudflare R2 direct object storage with Triple-Asset Architecture and no arbitrary 50MB upload limits.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Storage Pool: {formatFileSize(totalBytes)} Active</span>
        </div>
      </div>

      {/* R2 Direct Upload Simulator Container */}
      <div className="p-8 rounded-3xl border border-gold-500/40 bg-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-gold-400" />
              <span>Direct Browser-to-Cloudflare R2 Uploader</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Files bypass Vercel serverless functions directly into S3-compatible R2 storage with presigned tokens.
            </p>
          </div>

          {/* Asset Type Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border/80">
            <button
              onClick={() => setUploadAssetType("original_video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                uploadAssetType === "original_video"
                  ? "bg-gold-500 text-black font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1. 4K Original Master
            </button>
            <button
              onClick={() => setUploadAssetType("playback_video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                uploadAssetType === "playback_video"
                  ? "bg-gold-500 text-black font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2. Web Playback Stream
            </button>
            <button
              onClick={() => setUploadAssetType("thumbnail")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                uploadAssetType === "thumbnail"
                  ? "bg-gold-500 text-black font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3. Poster Thumbnail
            </button>
          </div>
        </div>

        {/* Dropzone Area */}
        <div className="p-10 rounded-2xl border-2 border-dashed border-border/80 hover:border-gold-500/60 bg-background/50 flex flex-col items-center justify-center text-center transition-colors">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-4">
            <FileVideo className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-bold text-foreground mb-1">
            Drag & Drop High-Capacity Commercial Video Files
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            Supports Apple ProRes 422 / 4444 XQ, RED RAW, H.264, H.265 (MP4/MOV). Multi-gigabyte uploads enabled without timeout.
          </p>

          {isSimulatingUpload ? (
            <div className="w-full max-w-md flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gold-400">Uploading direct to Cloudflare R2...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleSimulateUpload}
              className="px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
            >
              Simulate Presigned Multipart Upload
            </button>
          )}
        </div>
      </div>

      {/* Asset Library Table */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card overflow-hidden">
        <h3 className="text-base font-bold text-foreground mb-4">
          Active Media Storage Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Role / Asset Type</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">Associated Project</th>
                <th className="py-3 px-4">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                    {asset.filename}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
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
                  <td className="py-3.5 px-4 font-mono font-bold text-gold-400">
                    {asset.formattedSize}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono">
                    {asset.dimensions || "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {asset.associatedProjectTitle || "Unassigned"}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                    {formatDate(asset.uploadedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
