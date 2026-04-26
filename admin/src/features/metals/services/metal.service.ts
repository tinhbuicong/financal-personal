import api from "../../../services/api.service";

export interface MetalPrice {
  id: number;
  price: number; // This is Close
  open: number;
  high: number;
  low: number;
  price_gram: number;
  timestamp: number;
  created_at: string;
}

export interface SJCPrice {
  id: number;
  buy: number;
  sell: number;
  timestamp: number;
  created_at: string;
}

export const metalService = {
  getLatestGold: async (): Promise<MetalPrice> => {
    return api.get("gold/latest");
  },

  getGoldHistory: async (days: number = 30): Promise<MetalPrice[]> => {
    return api.get(`gold/history?days=${days}`);
  },

  getLatestSilver: async (): Promise<MetalPrice> => {
    return api.get("silver/latest");
  },

  getSilverHistory: async (days: number = 30): Promise<MetalPrice[]> => {
    return api.get(`silver/history?days=${days}`);
  },

  getLatestSJC: async (): Promise<SJCPrice> => {
    return api.get("sjc/latest");
  },

  getSJCHistory: async (days: number = 30): Promise<SJCPrice[]> => {
    return api.get(`sjc/history?days=${days}`);
  },

  syncMetals: async (): Promise<any> => {
    return api.post("metals/sync");
  },
};
