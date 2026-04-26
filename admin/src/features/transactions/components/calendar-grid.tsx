"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Transaction } from "../services/transaction.service";

interface CalendarGridProps {
  transactions: Transaction[];
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({ transactions, onSelectDate }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const startDate = startOfMonth.startOf("week");
    
    const days = [];
    let day = startDate;

    for (let i = 0; i < 42; i++) {
      const dayTransactions = transactions.filter(t => 
        dayjs(t.date).isSame(day, "day")
      );

      let income = 0;
      let outcome = 0;
      dayTransactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else outcome += t.amount;
      });

      days.push({
        date: day,
        isCurrentMonth: day.month() === currentDate.month(),
        isToday: day.isSame(dayjs(), "day"),
        transactions: dayTransactions,
        income,
        outcome,
        total: income - outcome,
      });
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate, transactions]);

  const totalMonthlyOutcome = useMemo(() => {
    return calendarDays.reduce((acc, d) => acc + (d.isCurrentMonth ? d.outcome : 0), 0);
  }, [calendarDays]);

  const totalMonthlyIncome = useMemo(() => {
    return calendarDays.reduce((acc, d) => acc + (d.isCurrentMonth ? d.income : 0), 0);
  }, [calendarDays]);

  const formatVND = (amount: number) => {
    const absoluteAmount = Math.abs(amount);
    return (absoluteAmount * 1000).toLocaleString("vi-VN") + " VND";
  };

  const formatSmallAmount = (amount: number) => {
    return (amount * 1000).toLocaleString("vi-VN") + "đ";
  };

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="flex flex-col gap-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="rounded-xl bg-white px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/60">
            <span className="text-xs font-bold text-slate-700">
              Chi tiêu <span className="text-red-500 ml-1.5 font-black">-{formatVND(totalMonthlyOutcome)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100/60">
          <button onClick={prevMonth} className="text-slate-400 hover:text-slate-900 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-slate-700 min-w-[80px] text-center">
            Tháng {currentDate.format("M YYYY")}
          </span>
          <button onClick={nextMonth} className="text-slate-400 hover:text-slate-900 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        {/* Week Days */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/20">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="py-4 text-center text-[13px] font-bold text-slate-500 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDate(day.date.toDate())}
              className={cn(
                "min-h-[110px] p-2 border-r border-b border-slate-100 transition-all hover:bg-slate-50/40 cursor-pointer flex flex-col group relative",
                !day.isCurrentMonth && "bg-slate-50/30 opacity-40",
                day.isToday && "bg-blue-50/40 ring-1 ring-inset ring-blue-400"
              )}
            >
              <span className={cn(
                "text-[11px] font-semibold self-end mb-2 pr-1",
                day.isToday ? "text-blue-600" : "text-slate-400"
              )}>
                {day.date.date()}
              </span>

              {/* Transactions List with custom scrollbar */}
              <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto max-h-[90px] pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {day.transactions.map((t, tIdx) => (
                  <div key={tIdx} className="flex items-center justify-between px-1.5 py-1 rounded bg-slate-50/50">
                    <span className="text-[10px] text-slate-500 truncate font-medium max-w-[60%]">{t.category}</span>
                    <span className={cn(
                      "text-[10px] font-bold",
                      t.type === "income" ? "text-emerald-500" : "text-red-500"
                    )}>
                      {t.type === "income" ? "+" : "-"}{formatSmallAmount(t.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Total Box matching screenshot */}
              {day.transactions.length > 0 && (
                <div className={cn(
                  "mt-auto px-2 py-0.5 rounded-lg text-center border",
                  day.total >= 0 
                    ? "bg-emerald-50/80 border-emerald-100/50" 
                    : "bg-red-50/80 border-red-100/50"
                )}>
                  <span className={cn(
                    "text-[10px] font-black tracking-tight",
                    day.total >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    {day.total >= 0 ? "+" : "-"}{formatVND(Math.abs(day.total))}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
