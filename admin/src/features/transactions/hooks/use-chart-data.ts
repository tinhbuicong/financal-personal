"use client";

import { useMemo } from "react";
import { useTransactions } from "./use-transactions";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export function useChartData() {
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  
  const { data: mappings = [], isLoading: isLoadingMappings } = useQuery({
    queryKey: ["category-mappings"],
    queryFn: categoryService.getMappings,
  });

  const chartData = useMemo(() => {
    if (!transactions.length) return { monthlyData: [], yearlyData: [] };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Process Monthly Data (Outcome only)
    const monthlyMap = new Map<string, number>();
    
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        t.type === "outcome"
      ) {
        const mapping = mappings.find((m) => m.category_name === t.category);
        const displayName = mapping?.group_name || t.category;
        
        monthlyMap.set(displayName, (monthlyMap.get(displayName) || 0) + t.amount);
      }
    });

    const monthlyData = Array.from(monthlyMap, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 2. Process Yearly Data
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const yearlyMap = new Map<number, { [key: string]: any }>();
    
    // Initialize months
    for (let i = 0; i < 12; i++) {
      yearlyMap.set(i, { month: months[i] });
    }

    const categories = new Set<string>();

    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear && t.type === "outcome") {
        const m = d.getMonth();
        const mapping = mappings.find((m) => m.category_name === t.category);
        const displayName = mapping?.group_name || t.category;
        
        categories.add(displayName);
        const monthData = yearlyMap.get(m)!;
        monthData[displayName] = (monthData[displayName] || 0) + t.amount;
      }
    });

    const yearlyData = Array.from(yearlyMap.values());
    const categoryList = Array.from(categories);

    return { monthlyData, yearlyData, categoryList };
  }, [transactions, mappings]);

  return {
    ...chartData,
    isLoading: isLoadingTransactions || isLoadingMappings,
  };
}
