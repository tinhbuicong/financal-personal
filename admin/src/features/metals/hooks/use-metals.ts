"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { metalService, MetalPrice, SJCPrice } from "../services/metal.service";
import { useEffect, useState } from "react";

export function useMetals() {
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goldQuery = useQuery({
    queryKey: ["metals", "gold", "latest"],
    queryFn: metalService.getLatestGold,
    enabled: isClient,
  });

  const silverQuery = useQuery({
    queryKey: ["metals", "silver", "latest"],
    queryFn: metalService.getLatestSilver,
    enabled: isClient,
  });

  const sjcQuery = useQuery({
    queryKey: ["metals", "sjc", "latest"],
    queryFn: metalService.getLatestSJC,
    enabled: isClient,
  });

  const syncMutation = useMutation({
    mutationFn: metalService.syncMetals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metals"] });
    },
  });

  return {
    latestGold: goldQuery.data,
    latestSilver: silverQuery.data,
    latestSJC: sjcQuery.data,
    isLoading: goldQuery.isLoading || silverQuery.isLoading || sjcQuery.isLoading || !isClient,
    syncMetals: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
  };
}

export function useMetalHistory(days: number = 30) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goldHistoryQuery = useQuery({
    queryKey: ["metals", "gold", "history", days],
    queryFn: () => metalService.getGoldHistory(days),
    enabled: isClient,
  });

  const silverHistoryQuery = useQuery({
    queryKey: ["metals", "silver", "history", days],
    queryFn: () => metalService.getSilverHistory(days),
    enabled: isClient,
  });

  const sjcHistoryQuery = useQuery({
    queryKey: ["metals", "sjc", "history", days],
    queryFn: () => metalService.getSJCHistory(days),
    enabled: isClient,
  });

  return {
    goldHistory: goldHistoryQuery.data || [],
    silverHistory: silverHistoryQuery.data || [],
    sjcHistory: sjcHistoryQuery.data || [],
    isLoading: goldHistoryQuery.isLoading || silverHistoryQuery.isLoading || sjcHistoryQuery.isLoading || !isClient,
  };
}
