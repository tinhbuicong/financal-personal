"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Wallet, 
  Folder, 
  Calendar, 
  LayoutGrid
} from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
  { id: "home", icon: Home, href: "/" },
  { id: "wallet", icon: Wallet, href: "/metals" },
  { id: "category", icon: Folder, href: "/category-groups" },
  { id: "calendar", icon: Calendar, href: "/calendar" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center border-r border-slate-100 bg-white py-6">
      {/* Logo */}
      <Link href="/" className="mb-10 text-orange-500 hover:scale-110 transition-transform">
        <LayoutGrid size={28} />
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-1 flex-col gap-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/calendar");
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                isActive 
                  ? "bg-orange-50 text-orange-500 shadow-sm" 
                  : "text-slate-300 hover:text-orange-400"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {item.badge && !isActive && (
                <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white ring-2 ring-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white shadow-lg shadow-orange-100">
          NA
        </div>
        <span className="text-[10px] font-bold text-slate-400">Natalie</span>
      </div>
    </aside>
  );
}
