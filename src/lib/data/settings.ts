import { StudioSettings } from "@/types";

export const MOCK_STUDIO_SETTINGS: StudioSettings = {
  studioName: "Fixelora Studio",
  tagline: "Creative Ads. Powerful Stories.",
  contactEmail: "production@fixelorastudio.com",
  phone: "+1 (310) 902-8800",
  address: "International Commercial Video Production • Global Studio",
  instagram: "https://instagram.com/fixelorastudio",
  vimeo: "https://vimeo.com/fixelorastudio",
  youtube: "https://youtube.com/@fixelorastudio",
  linkedin: "https://linkedin.com/company/fixelorastudio",
  maxUploadSizeGb: 25 // Configurable infrastructure limit
};

export const settingsRepository = {
  async getSettings(): Promise<StudioSettings> {
    return { ...MOCK_STUDIO_SETTINGS };
  }
};
