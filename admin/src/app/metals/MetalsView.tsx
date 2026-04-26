"use client";

import React, { useState } from "react";
import { useMetals, useMetalHistory } from "@/features/metals/hooks/use-metals";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, TrendingUp, TrendingDown, Coins, History, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";

export default function MetalsView() {
  const { latestGold, latestSilver, isLoading, syncMetals, isSyncing } = useMetals();
  const { goldHistory, silverHistory, isLoading: isLoadingHistory } = useMetalHistory(30);
  const [activeTab, setActiveTab] = useState<"XAU" | "XAG">("XAU");

  if (isLoading || isLoadingHistory) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-[32px] border border-slate-100 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          <p className="text-sm font-medium text-slate-500">Đang cập nhật giá thị trường...</p>
        </div>
      </div>
    );
  }

  const activeHistory = activeTab === "XAU" ? goldHistory : silverHistory;
  const activeLatest = activeTab === "XAU" ? latestGold : latestSilver;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Sync */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-orange-500">Thị trường Kim loại quý</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi biến động giá vàng và bạc thế giới thời gian thực (USD)</p>
        </div>
        <button 
          onClick={() => syncMetals()}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-100 transition-all active:scale-95"
        >
          <RefreshCw size={18} className={cn(isSyncing && "animate-spin")} />
          {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
        </button>
      </div>


      {/* Main Chart Section */}
      <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Lịch sử biến động 30 ngày</h2>
              <p className="text-xs text-slate-400">Dữ liệu đóng cửa hàng ngày của {activeTab}</p>
            </div>
          </div>

          <div className="flex p-1 bg-slate-50 rounded-xl">
            {["XAU", "XAG"].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "px-6 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTab === t ? "bg-white text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeHistory}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="created_at" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                tickFormatter={(val) => dayjs(val).format("DD/MM")}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                labelFormatter={(val) => dayjs(val).format("DD/MM/YYYY")}
                formatter={(value: any) => ["$" + Number(value).toLocaleString(), "Giá đóng cửa"]}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
