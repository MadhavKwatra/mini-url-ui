import api from "../utils/axios";
import { ShortUrl, CreateUrlRequest } from "../types/url.types";

export const urlService = {
  /**
   * Get all URLs for the current user
   */
  getUserUrls: async (): Promise<ShortUrl[]> => {
    const response = await api.get("/api/urls");
    return response.data.data;
  },

  /**
   * Create a new short URL
   */
  createShortUrl: async (urlData: CreateUrlRequest): Promise<ShortUrl> => {
    const response = await api.post("/api/shorten", urlData);
    return response.data;
  },

  /**
   * Get URL details by ID
   */
  getUrlById: async (id: string): Promise<ShortUrl> => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  /**
   * Delete a URL by ID
   */
  deleteUrl: async (id: string): Promise<void> => {
    await api.delete(`/urls/${id}`);
  },
};

export default urlService;
