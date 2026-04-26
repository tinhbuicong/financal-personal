# Next.js Enterprise Setup Guide (Client-Only & Feature-Based)

Tài liệu này quy định tiêu chuẩn kỹ thuật và cấu trúc thư mục cho dự án **Financial Admin V2**, được tối ưu cho tốc độ phát triển và khả năng bảo trì lâu dài.

## 1. Stack Công nghệ Chính

- **Framework**: Next.js 15+ (App Router).
- **Build Output**: Static Export (`output: export`) - Không cần Node.js server khi chạy.
- **Styling**: **Tailwind CSS** (Duy nhất, không dùng Vanilla CSS hay thư viện UI khác để đảm bảo hiệu năng).
- **State Management**:
  - `TanStack Query v5`: Quản lý Server State (Caching, Sync dữ liệu API).
  - `Zustand`: Quản lý Client State (Sidebar, Auth state, UI preferences).
- **Form Handling**: `React Hook Form` + `Zod` (Schema validation).
- **Utilities**:
  - `Axios`: HTTP Client với Interceptors.
  - `Day.js`: Xử lý thời gian (Thay thế date-fns).
  - `Lucide React`: Hệ thống Icon.
  - `clsx` & `tailwind-merge`: Xử lý class Tailwind linh hoạt.

---

## 2. Cấu trúc Thư mục (Feature-Driven)

Dự án được tổ chức theo module tính năng để dễ dàng mở rộng.

```text
src/
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── calendar/         # Trang Lịch giao dịch
│   ├── chart/            # Trang Biểu đồ tài chính
│   ├── metals/           # Trang Giá vàng/Kim loại
│   └── category-groups/  # Trang Quản lý danh mục
├── components/           # Shared components (Dùng chung toàn app)
│   ├── ui/               # Nguyên tử (Button, Input, Badge, ...)
│   └── common/           # Thành phần chung (Sidebar, Header, Layout)
├── features/             # TRUNG TÂM LOGIC (Chia theo nghiệp vụ)
│   ├── transactions/     # Logic cho Calendar & Chart
│   │   ├── components/   # TransactionForm, MiniCalendar
│   │   ├── hooks/        # useTransactions, useStats
│   │   └── services/     # API calls riêng cho giao dịch
│   └── metals/           # Logic cho giá kim loại
│       ├── components/   # PriceCard, MetalChart
│       └── services/     # API calls lấy giá vàng/bạc
├── hooks/                # Global custom hooks (useDebounce, useLocalStorage)
├── lib/                  # Cấu hình thư viện (axios.ts, query-client.ts)
├── store/                # Zustand stores (useAppStore.ts, useAuthStore.ts)
├── utils/                # Helper functions (cn.ts, format.ts)
└── types/                # Global TypeScript definitions
```

---

## 3. Cấu hình Quan trọng

### Static Export (`next.config.ts`)

Bắt buộc để build ra bộ file tĩnh (SPA):

```typescript
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
```

### Tiện ích Merge Class (`src/utils/cn.ts`)

Dùng để viết Tailwind class sạch hơn:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 4. Quy tắc Phát triển (Golden Rules)

1.  **Client-First**: Vì là Static Export, mọi component cần tương tác với trình duyệt (window, document, hooks) phải có `'use client'`.
2.  **Feature Isolation**: Feature A không được import file từ Feature B. Nếu cần dùng chung, hãy đưa vào thư mục `src/components` hoặc `src/hooks`.
3.  **No Direct CSS**: Chỉ sử dụng Tailwind classes. Tránh tạo file `.css` lẻ trừ `globals.css`.
4.  **Type Safety**: Luôn định nghĩa Interface cho dữ liệu API và Props của component.
5.  **API Client**: Luôn gọi API thông qua `apiClient` (Axios) được cấu hình trong `src/lib/axios.ts` để hưởng lợi từ Interceptors (Auth, Error handling).
