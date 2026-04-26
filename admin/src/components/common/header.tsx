"use client";

import React from "react";
import { Search, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-100 bg-white px-8">
      {/* Left side: Back & Breadcrumbs */}
      <div className="flex items-center gap-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-800 transition-colors hover:text-orange-500"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          <span>Back</span>
        </button>

        <nav className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Finance</span>
          <span className="text-slate-300">/</span>
          <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-900 capitalize">
            {pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).join(" / ")}
          </span>
        </nav>
      </div>

      {/* Center: Search Bar matching exactly */}
      <div className="relative w-full max-w-[360px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
          type="text" 
          placeholder="Search User, Events and more.." 
          className="w-full rounded-full border border-slate-100 bg-slate-50/50 py-1.5 pl-11 pr-4 text-[12px] outline-none transition-all focus:bg-white"
        />
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-[12px] font-medium text-slate-500 cursor-pointer hover:text-slate-800">
          <span>English</span>
          <ChevronRight size={14} className="rotate-90 text-slate-400" />
        </div>

        <button className="text-slate-400 hover:text-slate-800 transition-colors">
          <Settings size={20} />
        </button>

        <button className="relative text-slate-400 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-[8px] font-bold text-white">
            1
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white cursor-pointer shadow-sm">
          AD
        </div>
      </div>
    </header>
  );
}
