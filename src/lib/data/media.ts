import { MediaAsset } from "@/types";

export const MOCK_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media-1",
    filename: "AURA_X1_MASTER_PRORES4444_4K.mov",
    assetType: "original_video",
    fileSize: 18450000000, // ~18.45 GB
    formattedSize: "18.45 GB",
    mimeType: "video/quicktime",
    dimensions: "3840x1606",
    duration: "1:15",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    associatedProjectId: "proj-1",
    associatedProjectTitle: "Aura X1: The Silence of Speed",
    uploadedAt: "2026-09-12T10:15:00Z"
  },
  {
    id: "media-2",
    filename: "AURA_X1_WEB_STREAM_H265.mp4",
    assetType: "playback_video",
    fileSize: 42000000, // ~42 MB
    formattedSize: "42.0 MB",
    mimeType: "video/mp4",
    dimensions: "1920x803",
    duration: "1:15",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    associatedProjectId: "proj-1",
    associatedProjectTitle: "Aura X1: The Silence of Speed",
    uploadedAt: "2026-09-12T10:22:00Z"
  },
  {
    id: "media-3",
    filename: "AURA_X1_HERO_POSTER.jpg",
    assetType: "thumbnail",
    fileSize: 2400000, // ~2.4 MB
    formattedSize: "2.4 MB",
    mimeType: "image/jpeg",
    dimensions: "3840x1606",
    url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
    associatedProjectId: "proj-1",
    associatedProjectTitle: "Aura X1: The Silence of Speed",
    uploadedAt: "2026-09-12T10:25:00Z"
  },
  {
    id: "media-4",
    filename: "VERVE_TOURBILLON_MASTER_4K.mov",
    assetType: "original_video",
    fileSize: 9800000000, // ~9.8 GB
    formattedSize: "9.80 GB",
    mimeType: "video/quicktime",
    dimensions: "3840x2160",
    duration: "0:45",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    associatedProjectId: "proj-2",
    associatedProjectTitle: "Verve Chrono: Engineering Eternity",
    uploadedAt: "2026-08-20T14:40:00Z"
  }
];

export const mediaRepository = {
  async getMediaAssets(): Promise<MediaAsset[]> {
    return [...MOCK_MEDIA_ASSETS];
  },

  async getTotalStorageBytes(): Promise<number> {
    return MOCK_MEDIA_ASSETS.reduce((sum, item) => sum + item.fileSize, 0);
  }
};
