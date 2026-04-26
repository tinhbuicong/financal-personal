"use client";

import React, { useState } from "react";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { CalendarGrid } from "@/features/transactions/components/calendar-grid";
import { TransactionDialog } from "@/features/transactions/components/transaction-dialog";
import { Transaction } from "@/features/transactions/services/transaction.service";
import { toast } from "sonner";

export default function CalendarView() {
  const { transactions, isLoading, createTransaction } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: Transaction) => {
    setIsSubmitting(true);
    try {
      await createTransaction(data);
      toast.success("Đã thêm giao dịch thành công!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm giao dịch.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[32px] bg-white p-12 shadow-sm border border-slate-100 min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CalendarGrid 
        transactions={transactions} 
        onSelectDate={handleSelectDate} 
      />

      <TransactionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialDate={selectedDate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
