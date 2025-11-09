# Hệ Thống Giám Sát Khách Hàng

## Tổng Quan
Hệ thống giám sát khách hàng là một ứng dụng web được phát triển bằng React và TypeScript, cho phép theo dõi và quản lý thông tin khách hàng trong thời gian thực. Hệ thống hỗ trợ nhận diện khuôn mặt, theo dõi lịch sử ghé thăm và quản lý cơ sở dữ liệu khuôn mặt khách hàng.

### Tính Năng Chính
- Giám sát khách hàng thời gian thực
- Quản lý cơ sở dữ liệu khuôn mặt
- Xem lịch sử ghé thăm của khách
- Giao diện người dùng thân thiện
- Hỗ trợ đa nền tảng

## Cấu Trúc Màn Hình
1. **Bảng Điều Khiển Thời Gian Thực (`RealtimeDashboard`)**
   - Hiển thị hình ảnh camera theo thời gian thực
   - Thông tin nhận diện khách hàng
   - Trạng thái hệ thống

2. **Quản Lý Khuôn Mặt (`AdminFaceBank`)**
   - Thêm/xóa khuôn mặt khách hàng
   - Cập nhật thông tin khách hàng
   - Quản lý cơ sở dữ liệu khuôn mặt

3. **Lịch Sử Ghé Thăm (`VisitHistory`)**
   - Xem lịch sử ghé thăm của khách
   - Bộ lọc theo thời gian
   - Xuất báo cáo

## Tổ Chức Mã Nguồn
```
customer-monitoring-dashboard/
├── components/           # Các component tái sử dụng
│   ├── Card.tsx         # Component thẻ hiển thị
│   ├── Header.tsx       # Thanh điều hướng
│   ├── Modal.tsx        # Cửa sổ popup
│   └── icons/           # Các biểu tượng
├── pages/               # Các trang chính
│   ├── AdminFaceBank.tsx
│   ├── RealtimeDashboard.tsx
│   └── VisitHistory.tsx
├── services/            # Xử lý API và logic nghiệp vụ
│   └── api.ts
└── types.ts            # Định nghĩa kiểu dữ liệu
```

## Yêu Cầu Hệ Thống
- Node.js phiên bản 14 trở lên
- Trình duyệt web hiện đại (Chrome, Firefox, Edge)
- Camera (cho tính năng nhận diện)

## Hướng Dẫn Cài Đặt

### 1. Chuẩn Bị Môi Trường
- Cài đặt Node.js
- Clone repository về máy

### 2. Cài Đặt Dự Án
```bash
# Cài đặt các gói phụ thuộc
npm install

# Thiết lập file môi trường
cp .env.example .env.local
```

### 3. Cấu Hình
1. Mở file `.env.local`
2. Thiết lập `CUSTOMER_SERVICE_KEY` với khóa API của bạn

### 4. Khởi Chạy
```bash
# Chạy môi trường phát triển
npm run dev

# Hoặc build cho môi trường production
npm run build
npm start
```

## Công Nghệ Sử Dụng
- React
- TypeScript
- Vite
- Tailwind CSS
- WebRTC (cho xử lý camera)

## Bảo Mật
- Mã hóa dữ liệu người dùng
- Xác thực qua API key
- Kiểm soát truy cập theo vai trò

## Đóng Góp
Mọi đóng góp đều được hoan nghênh. Vui lòng:
1. Fork dự án
2. Tạo nhánh tính năng mới
3. Gửi pull request


## Liên Hệ
Nếu có bất kỳ câu hỏi hoặc góp ý, vui lòng liên hệ:
- Email: datvinadarius79@gmail.com

