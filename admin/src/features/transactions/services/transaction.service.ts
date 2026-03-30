import api from "../../../services/api.service";


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
    return api.get("/transactions", { params });
  },

  createTransaction: async (data: Transaction): Promise<Transaction> => {
    return api.post("/transactions", data);
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    return api.put(`/transactions/${id}`, data);
  },

  deleteTransaction: async (id: string): Promise<void> => {
    return api.delete(`/transactions/${id}`);
  }
};
