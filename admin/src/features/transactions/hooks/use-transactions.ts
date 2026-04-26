"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, Transaction } from "../services/transaction.service";
import { useEffect, useState } from "react";

export function useTransactions(params?: { start_date?: string; end_date?: string }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chúng ta chỉ gọi useQueryClient khi đã ở client
  // Tuy nhiên, hooks quy tắc không cho phép gọi có điều kiện
  // Vì vậy ta vẫn gọi nhưng sẽ xử lý kết quả bên dưới
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionService.getTransactions(params),
    enabled: isClient, // Chỉ kích hoạt query khi đã ở client
  });

  const createTransactionMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Transaction> }) =>
      transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading || !isClient,
    isError: transactionsQuery.isError,
    createTransaction: createTransactionMutation.mutateAsync,
    updateTransaction: updateTransactionMutation.mutateAsync,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
  };
}
