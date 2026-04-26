"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

import { ClientOnly } from "./client-only";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-16">
        <Header />
        <main className="flex-1 w-full px-6 py-4">
          <div className="mx-auto max-w-[1600px]">
            <ClientOnly>{children}</ClientOnly>
          </div>
        </main>
      </div>
    </div>
  );
}
