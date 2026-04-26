"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService, CategoryMapping } from "../services/category.service";
import { useTransactions } from "./use-transactions";
import { toast } from "sonner";

export function useCategoryGroups() {
  const queryClient = useQueryClient();
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  
  const { data: mappings = [], isLoading: isLoadingMappings } = useQuery({
    queryKey: ["category-mappings"],
    queryFn: categoryService.getMappings,
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-mappings"] });
      toast.success("Đã xóa hạng mục khỏi nhóm");
    },
  });

  const updateMutation = useMutation({
    mutationFn: categoryService.updateMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-mappings"] });
      toast.success("Đã cập nhật nhóm hạng mục");
    },
  });

  const groupedData = useMemo(() => {
    const groups: Record<string, { name: string; id: number }[]> = {};
    const unassigned: string[] = [];

    // Lấy danh sách các category duy nhất đang được dùng trong transactions
    const categoriesInUse = Array.from(new Set(transactions.map((t) => t.category))).sort();

    categoriesInUse.forEach((cat) => {
      const mapping = mappings.find((m) => m.category_name === cat);
      if (mapping && mapping.group_name) {
        if (!groups[mapping.group_name]) {
          groups[mapping.group_name] = [];
        }
        groups[mapping.group_name].push({ name: cat, id: mapping.id! });
      } else {
        unassigned.push(cat);
      }
    });

    return { groups, unassigned };
  }, [transactions, mappings]);

  const renameGroup = async (oldGroupName: string, newGroupName: string) => {
    const catsInGroup = groupedData.groups[oldGroupName];
    if (!catsInGroup || !newGroupName.trim() || oldGroupName === newGroupName) return;

    try {
      await Promise.all(
        catsInGroup.map((cat) =>
          categoryService.updateMapping({
            category_name: cat.name,
            group_name: newGroupName,
          })
        )
      );
      queryClient.invalidateQueries({ queryKey: ["category-mappings"] });
      toast.success(`Đã đổi tên nhóm thành "${newGroupName}"`);
    } catch (e) {
      toast.error("Lỗi khi đổi tên nhóm");
    }
  };

  return {
    ...groupedData,
    isLoading: isLoadingTransactions || isLoadingMappings,
    removeFromGroup: deleteMutation.mutate,
    addToGroup: updateMutation.mutate,
    renameGroup,
  };
}
