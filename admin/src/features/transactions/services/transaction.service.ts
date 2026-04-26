import apiClient from "../../../services/api.service";

export interface Transaction {
  id?: number;
  amount: number;
  type: "income" | "outcome" | string;
  category: string;
  note?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export const transactionService = {
  getTransactions: async (params?: { start_date?: string; end_date?: string }): Promise<Transaction[]> => {
    return apiClient.get("transactions", { params });
  },

  createTransaction: async (data: Transaction): Promise<Transaction> => {
    return apiClient.post("transactions", data);
  },

  updateTransaction: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.put(`transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await apiClient.delete(`transactions/${id}`);
  }
};
