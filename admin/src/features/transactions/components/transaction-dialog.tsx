"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Transaction } from "../services/transaction.service";

import { useCategoryGroups } from "../hooks/use-category-groups";

const transactionSchema = z.object({
  amount: z.number().min(1, "Số tiền phải lớn hơn 0"),
  type: z.enum(["income", "outcome"]),
  category: z.string().min(1, "Vui lòng nhập hạng mục"),
  note: z.string().optional(),
  date: z.string().min(1, "Vui lòng chọn ngày"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => void;
  initialDate?: Date;
  isSubmitting?: boolean;
}

export function TransactionDialog({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  isSubmitting = false,
}: TransactionDialogProps) {
  const { groups, unassigned } = useCategoryGroups();
  
  const allCategories = useMemo(() => {
    const fromGroups = Object.values(groups).flatMap(g => g.map(c => c.name));
    return Array.from(new Set([...fromGroups, ...unassigned])).sort();
  }, [groups, unassigned]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: "outcome",
      category: "",
      note: "",
      date: dayjs().format("YYYY-MM-DD"),
    },
  });

  const currentType = watch("type");

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: 0,
        type: "outcome",
        category: "",
        note: "",
        date: initialDate ? dayjs(initialDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [isOpen, initialDate, reset]);

  const onFormSubmit = (values: TransactionFormValues) => {
    onSubmit({
      ...values,
      date: new Date(values.date).toISOString(),
    } as Transaction);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl pointer-events-auto border border-slate-100"
            >
              {/* Header */}
              <div className="relative border-b border-slate-50 px-6 py-5 bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Thêm Giao dịch Mới</h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Nhập thông tin chi tiết về giao dịch của bạn</p>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setValue("type", "outcome")}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                      currentType === "outcome"
                        ? "bg-white text-red-500 shadow-sm"
                        : "text-slate-500 hover:bg-white/50"
                    }`}
                  >
                    CHI PHÍ
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("type", "income")}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                      currentType === "income"
                        ? "bg-white text-emerald-500 shadow-sm"
                        : "text-slate-500 hover:bg-white/50"
                    }`}
                  >
                    THU NHẬP
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Số tiền (k)</label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("amount", { valueAsNumber: true })}
                        placeholder="0"
                        className={`w-full rounded-2xl border-2 px-4 py-3 text-lg font-black outline-none transition-all ${
                          errors.amount ? "border-red-100 bg-red-50 text-red-600" : "border-slate-100 bg-slate-50/50 focus:border-orange-200 focus:bg-white"
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">.000đ</span>
                    </div>
                    {errors.amount && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.amount.message}</p>}
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Hạng mục</label>
                    <input
                      type="text"
                      {...register("category")}
                      placeholder="Ăn uống, Di chuyển, ..."
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-bold outline-none transition-all ${
                        errors.category ? "border-red-100 bg-red-50" : "border-slate-100 bg-slate-50/50 focus:border-orange-200 focus:bg-white"
                      }`}
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                      {allCategories.slice(0, 8).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setValue("category", cat)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-all"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {errors.category && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.category.message}</p>}
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Ngày giao dịch</label>
                    <input
                      type="date"
                      {...register("date")}
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-bold outline-none transition-all ${
                        errors.date ? "border-red-100 bg-red-50" : "border-slate-100 bg-slate-50/50 focus:border-orange-200 focus:bg-white"
                      }`}
                    />
                    {errors.date && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.date.message}</p>}
                  </div>

                  {/* Note */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Ghi chú (Tùy chọn)</label>
                    <textarea
                      {...register("note")}
                      placeholder="Mua gì, ở đâu..."
                      rows={2}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-orange-200 focus:bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl bg-slate-100 px-6 py-3.5 text-sm font-black text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    HỦY
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {isSubmitting ? "ĐANG LƯU..." : "TẠO GIAO DỊCH"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
