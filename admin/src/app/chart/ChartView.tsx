"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useChartData } from "@/features/transactions/hooks/use-chart-data";
import { formatVND } from "@/utils/format";

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1", 
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4"
];

export default function ChartView() {
  const { monthlyData, yearlyData, categoryList, isLoading } = useChartData();

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-[32px] border border-slate-100 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
          <p className="text-sm font-medium text-slate-500">Đang phân tích dữ liệu tài chính...</p>
        </div>
      </div>
    );
  }

  const maxMonthlyValue = Math.max(...monthlyData.map(d => d.value), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Yearly Trend Chart */}
      <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">Xu hướng chi tiêu cả năm ({new Date().getFullYear()})</h2>
          <p className="text-xs text-slate-400 mt-1">Theo dõi biến động chi tiêu của từng hạng mục qua các tháng.</p>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={(value) => value >= 1000 ? `${value/1000}M` : value}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [formatVND(Number(value || 0)), ""]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
              />
              {categoryList.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Monthly Category Distribution */}
      <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            Thống kê chi tiêu tháng {new Date().getMonth() + 1}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Phân bổ chi phí theo từng hạng mục cụ thể.</p>
        </div>

        <div className="space-y-6">
          {monthlyData.length > 0 ? (
            monthlyData.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{item.name}</span>
                  <span className="text-slate-900">{formatVND(item.value)}</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-50">
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.value / maxMonthlyValue) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">
              Chưa có dữ liệu chi tiêu cho tháng này.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
