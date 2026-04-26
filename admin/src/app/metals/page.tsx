"use client";

import dynamic from "next/dynamic";

const MetalsView = dynamic(() => import("./MetalsView"), { 
  ssr: false,
  loading: () => (
    <div className="rounded-[32px] bg-white p-12 shadow-sm border border-slate-100 min-h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
        <p className="text-sm font-medium text-slate-500">Đang khởi tạo thị trường...</p>
      </div>
    </div>
  )
});

export default function MetalsPage() {
  return <MetalsView />;
}
