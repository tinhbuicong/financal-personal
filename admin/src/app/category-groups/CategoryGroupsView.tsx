"use client";

import React, { useState } from "react";
import { useCategoryGroups } from "@/features/transactions/hooks/use-category-groups";
import { Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryGroupsView() {
  const { groups, unassigned, isLoading, removeFromGroup, addToGroup, renameGroup } = useCategoryGroups();
  const [activeAddGroup, setActiveAddGroup] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-[32px] border border-slate-100 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          <p className="text-sm font-medium text-slate-500">Đang tải cấu hình nhóm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header matching screenshot */}
      <div className="flex items-end justify-between pb-4 border-b-2 border-blue-500/20">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý Nhóm Hạng mục</h1>
        <p className="text-[11px] font-medium text-slate-400">
          Phân loại các hạng mục chi tiêu theo nhóm để xem biểu đồ thống kê tập trung hơn.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/20">
              <th className="px-8 py-5 text-left text-[13px] font-black text-slate-800 w-1/4">Nhóm hiển thị</th>
              <th className="px-8 py-5 text-left text-[13px] font-black text-slate-800">Các hạng mục thuộc nhóm</th>
            </tr>
          </thead>
          <tbody>
            {/* Unassigned row if any */}
            {unassigned.length > 0 && (
              <tr className="border-b border-slate-50 bg-amber-50/10">
                <td className="px-8 py-6">
                  <div className="text-[13px] font-bold text-amber-600">Chưa phân nhóm</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {unassigned.map((cat) => (
                      <div key={cat} className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[12px] font-bold border border-slate-200">
                        {cat}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}

            {/* Grouped rows */}
            {Object.entries(groups).map(([groupName, cats]) => (
              <tr key={groupName} className="border-b border-slate-50 group">
                <td className="px-8 py-6 align-top">
                  <div className="relative">
                    <input 
                      type="text"
                      defaultValue={groupName}
                      onBlur={(e) => renameGroup(groupName, e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[13px] font-black text-orange-500 shadow-sm focus:border-orange-200 outline-none transition-all"
                    />
                  </div>
                </td>
                <td className="px-8 py-6 align-top">
                  <div className="flex flex-wrap gap-2 items-center">
                    {cats.map((cat) => (
                      <div 
                        key={cat.id}
                        className="group/tag relative flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-[12px] font-bold border border-blue-100/50"
                      >
                        <span>{cat.name}</span>
                        <button 
                          onClick={() => removeFromGroup(cat.id)}
                          className="ml-1 text-blue-300 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <div className="relative">
                      <button 
                        onClick={() => setActiveAddGroup(activeAddGroup === groupName ? null : groupName)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold border-2 border-dashed transition-all",
                          activeAddGroup === groupName 
                            ? "bg-orange-500 border-orange-500 text-white" 
                            : "bg-white border-slate-200 text-slate-400 hover:border-orange-200 hover:text-orange-500"
                        )}
                      >
                        <Plus size={14} />
                        <span>Thêm</span>
                      </button>

                      <AnimatePresence>
                        {activeAddGroup === groupName && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 p-2"
                          >
                            <div className="max-h-48 overflow-y-auto">
                              {unassigned.length > 0 ? unassigned.map(unCat => (
                                <button 
                                  key={unCat}
                                  onClick={() => {
                                    addToGroup({ category_name: unCat, group_name: groupName });
                                    setActiveAddGroup(null);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-[12px] font-bold text-slate-600 hover:text-orange-600 transition-colors"
                                >
                                  {unCat}
                                </button>
                              )) : (
                                <div className="px-3 py-4 text-center text-xs text-slate-400 italic">Đã hết hạng mục trống</div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
