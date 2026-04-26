# Thiết kế Hệ thống Tích hợp Gold API

Tài liệu này mô tả chi tiết kế hoạch triển khai tính năng theo dõi giá vàng trong ứng dụng Tài chính Cá nhân.

## 1. Mục đích Thiết kế

Tích hợp dữ liệu từ GoldAPI.io để:

- Cung cấp thông tin giá Vàng (XAU) và Bạc (XAG) thời gian thực (quy đổi ra VND hoặc USD).
- Lưu trữ lịch sử biến động giá kim loại quý để phân tích xu hướng đầu tư.
- Tự động cập nhật giá trị tài sản ròng (Net Worth) cho cả Vàng và Bạc.

---

## 2. Thiết kế Database (PostgreSQL)

Chúng ta sử dụng một bảng chung để lưu trữ lịch sử giá của nhiều loại kim loại (Vàng, Bạc, ...) nhằm tối ưu hóa cấu trúc database và tiết kiệm quota API.

### Bảng `metal_prices`

| Cột          | Kiểu dữ liệu  | Mô tả                           |
| :----------- | :------------ | :------------------------------ |
| `id`         | UUID / Serial | Khóa chính                      |
| `symbol`     | VARCHAR(10)   | Ký hiệu (XAU - Vàng, XAG - Bạc) |
| `currency`   | VARCHAR(10)   | Đơn vị tiền tệ (VND, USD)       |
| `price`      | DECIMAL       | Giá trên 1 Troy Ounce           |
| `price_gram` | DECIMAL       | Giá trên 1 gram (nguyên chất)   |
| `timestamp`  | BIGINT        | Thời gian từ GoldAPI            |
| `created_at` | TIMESTAMP     | Thời gian lưu vào hệ thống      |

```sql
CREATE TABLE metal_prices (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL, -- 'XAU' hoặc 'XAG'
    currency VARCHAR(10) NOT NULL,
    price DECIMAL(20, 2),
    price_gram DECIMAL(20, 2),
    timestamp BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Thiết kế API (Go Backend)

### Cấu trúc Backend

1.  **Service/Worker**: Định kỳ fetch dữ liệu cho cả `XAU` và `XAG`.
2.  **Endpoints**:
    - `GET /api/metals/latest?symbol=XAU`: Lấy giá mới nhất của kim loại cụ thể.
    - `GET /api/metals/history?symbol=XAU&days=7`: Lấy lịch sử giá để vẽ biểu đồ.

### Logic Xử lý (Flow)

1.  Frontend yêu cầu dữ liệu.
2.  Backend kiểm tra trong DB:
    - Nếu dữ liệu `created_at` gần nhất < 1 giờ: Trả về từ DB.
    - Nếu dữ liệu quá cũ hoặc không có: Gọi GoldAPI.io -> Lưu DB -> Trả về kết quả.

---

## 4. Thiết kế Giao diện (Svelte 5 Frontend)

### Thành phần hiển thị (Components)

1.  **Metal Price Widget (Dashboard)**:
    - Thẻ hiển thị giá Vàng và Bạc riêng biệt.
    - Hiển thị phần trăm thay đổi (+/- %) so với phiên trước.

2.  **Price Chart (Analytics)**:
    - Sử dụng **Chart.js** để vẽ biểu đồ đường (Line Chart).
    - Trục X: Thời gian.
    - Trục Y: Giá vàng.
    - Cho phép lọc theo khoảng thời gian (1W, 1M, 1Y).

3.  **Asset Integration**:
    - Trong phần quản lý tài sản, nếu loại tài sản là "Vàng", hệ thống tự động nhân số lượng với giá `price_gram_24k` mới nhất để tính giá trị hiện tại.

---

## 5. Kế hoạch triển khai (Roadmap)

1.  **Giai đoạn 1**: Tạo Migration cho bảng `gold_prices`.
2.  **Giai đoạn 2**: Viết hàm Fetch dữ liệu từ GoldAPI.io trong Backend (Golang).
3.  **Giai đoạn 3**: Xây dựng API nội bộ cung cấp dữ liệu cho Frontend.
4.  **Giai đoạn 4**: Tạo Component hiển thị trên Dashboard Svelte.
5.  **Giai đoạn 5**: Tích hợp tính toán tự động vào tổng tài sản.
