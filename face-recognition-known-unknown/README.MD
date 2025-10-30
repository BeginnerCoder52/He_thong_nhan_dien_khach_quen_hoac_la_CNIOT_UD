# 🎭 Face Recognition System - IOT Dashboard

Hệ thống nhận diện khuôn mặt real-time sử dụng Go Backend, React Dashboard, và MQTT Protocol.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Go](https://img.shields.io/badge/Go-1.19+-00ADD8?style=for-the-badge&logo=go)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![MQTT](https://img.shields.io/badge/MQTT-Protocol-660066?style=for-the-badge)

## 📋 Mục Lục
- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt sau khi clone](#-cài-đặt-sau-khi-clone)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Testing](#-testing)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tổng quan

Hệ thống giám sát và nhận diện khách quen/khách mới theo thời gian thực với các công nghệ:

- **Backend**: Go 1.19+ với MQTT client và HTTP/WebSocket server
- **Frontend**: React 18+ với Vite, Tailwind CSS
- **Communication**: MQTT (metadata) + HTTP (images) + WebSocket (real-time)
- **Recognition**: Cosine Similarity trên vector embedding 512D

## ✨ Tính năng

✅ Nhận diện khách quen/mới real-time  
✅ Streaming video từ camera  
✅ Thống kê lượt truy cập theo thời gian  
✅ Lưu trữ và so sánh embedding vectors (512D)  
✅ Dashboard trực quan với charts (Recharts)  
✅ MQTT status monitoring  
✅ WebSocket real-time updates  
✅ Responsive design với Tailwind CSS  

---

## 🏗️ Kiến trúc hệ thống
```
┌─────────────────┐         MQTT         ┌──────────────────┐
│  ESP32-CAM /    │ ──────────────────▶  │   Go Backend     │
│  Edge Device    │   (metadata +        │  ├─ MQTT Client  │
│                 │    embedding)         │  ├─ HTTP Server  │
└─────────────────┘                       │  └─ Recognition  │
         │                                 └────────┬─────────┘
         │ HTTP POST                                │
         │ (image)                           WebSocket
         ▼                                          │
┌─────────────────┐                                ▼
│  Backend        │                       ┌──────────────────┐
│  /api/upload    │                       │  React Dashboard │
└─────────────────┘                       │  ├─ VideoStream  │
                                           │  ├─ Recognition │
                                           │  └─ Statistics  │
                                           └──────────────────┘
```

### Luồng hoạt động

1. **Camera/Board** capture ảnh → extract embedding 512D
2. **MQTT Publish** metadata tới topic `face/metadata`
3. **HTTP POST** ảnh gốc tới `/api/upload`
4. **Backend** nhận MQTT message → so sánh database → xác định khách quen/mới
5. **WebSocket** broadcast kết quả real-time
6. **Dashboard** hiển thị kết quả

---

## 💻 Yêu cầu hệ thống

### Bắt buộc

| Công cụ | Version | Download |
|---------|---------|----------|
| **Go** | >= 1.19 | [golang.org/dl](https://golang.org/dl/) |
| **Node.js** | >= 18.x | [nodejs.org](https://nodejs.org/) |
| **npm** | >= 9.x | (đi kèm Node.js) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

### Optional (cho testing)

| Công cụ | Version | Mục đích |
|---------|---------|----------|
| **Python** | >= 3.8 | MQTT test script |
| **pip** | Latest | Python packages |

### MQTT Broker

Dự án mặc định sử dụng public broker: **`test.mosquitto.org:1883`**

Không cần cài đặt local broker trừ khi muốn tự host.

---

## 🚀 Cài đặt sau khi clone

### Bước 1: Clone Repository
```bash
git clone https://github.com/your-username/face-recognition-system.git
cd face-recognition-system
```

### Bước 2: Cài đặt Backend (Go)
```bash
cd backend

# Tải dependencies
go mod download

# Hoặc
go mod tidy

# Verify dependencies
go mod verify
```

**Dependencies sẽ được cài:**
- `github.com/eclipse/paho.mqtt.golang` - MQTT client
- `github.com/gorilla/mux` - HTTP router
- `github.com/gorilla/websocket` - WebSocket
- `github.com/rs/cors` - CORS middleware

### Bước 3: Cài đặt Dashboard (React)
```bash
cd ../dashboard

# Cài tất cả dependencies
npm install

# Hoặc dùng yarn
yarn install
```

**Dependencies chính:**
- React 18+
- Vite (build tool)
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)

### Bước 4: Cài đặt Python (Optional - cho testing)
```bash
# Quay về thư mục gốc
cd ..

# Tạo virtual environment (recommended)
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài paho-mqtt
pip install paho-mqtt
```

---

## 🎮 Chạy ứng dụng

### Chạy đầy đủ hệ thống (3 terminals)

#### Terminal 1: Backend
```bash
cd backend
go run cmd/server/main.go
```

**Output thành công:**
```
Connected to MQTT broker
Server starting on :8080
```

Backend sẽ chạy tại: **http://localhost:8080**

#### Terminal 2: Dashboard
```bash
cd dashboard
npm run dev
```

**Output thành công:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Dashboard sẽ chạy tại: **http://localhost:5173**

#### Terminal 3: MQTT Test (Optional)
```bash
python test_mqtt_sender.py
```

Chọn option:
- `1` - Gửi 1 detection test
- `2` - Gửi liên tục mỗi 5 giây ⭐ **Recommended cho testing**
- `3` - Gửi liên tục mỗi 10 giây
- `4` - Gửi burst 10 detections

### Truy cập Dashboard

Mở trình duyệt: **http://localhost:5173**

Bạn sẽ thấy:
- ✅ WebSocket Connected (góc phải trên)
- ⏳ MQTT Idle (chờ message)

Khi chạy test script (Terminal 3):
- ✅ MQTT Active với số message đếm
- 🔔 Toast notification xuất hiện
- 📊 Recognition panel cập nhật real-time

---

## 🧪 Testing

### 1. Test MQTT Connection
```bash
python test_mqtt_sender.py
```

Chọn option `2` để gửi liên tục.

**Kết quả mong đợi:**
- Backend logs: `📩 MQTT Message Received`
- Dashboard: MQTT status chuyển sang "Active"
- Toast notification xuất hiện
- Recognition panel cập nhật

### 2. Test API Endpoints

#### Get Stats
```bash
curl http://localhost:8080/api/stats
```

Response:
```json
{
  "total_people": 5,
  "total_visits": 42,
  "known_visitors": 3,
  "new_visitors": 2
}
```

#### Get Visitors
```bash
curl http://localhost:8080/api/visitors
```

#### Upload Image
```bash
curl -X POST -F "image=@test.jpg" http://localhost:8080/api/upload
```

### 3. Test WebSocket

Mở DevTools Console trong browser:
```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
```

Chạy test script để xem message real-time.

---

## 📁 Cấu trúc dự án
```
face-recognition-system/
│
├── backend/                      # Go Backend
│   ├── cmd/
│   │   └── server/
│   │       └── main.go          # Entry point
│   ├── internal/
│   │   ├── config/
│   │   ├── models/              # Data structures
│   │   ├── mqtt/                # MQTT client & handlers
│   │   ├── http/                # HTTP server & API
│   │   └── recognition/         # Cosine similarity & database
│   ├── uploads/                 # Uploaded images (gitignored)
│   ├── data/                    # Database files (gitignored)
│   ├── go.mod
│   └── go.sum
│
├── dashboard/                    # React Dashboard
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── VideoStream.jsx
│   │   │   ├── RecognitionPanel.jsx
│   │   │   ├── VisitorStats.jsx
│   │   │   └── VisitorHistory.jsx
│   │   ├── services/
│   │   │   ├── api.js          # HTTP API
│   │   │   └── websocket.js    # WebSocket
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── test_mqtt_sender.py          # MQTT test script
├── .gitignore
└── README.md
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
  image: <file>

Response:
{
  "message": "Upload successful",
  "path": "image_name.jpg"
}
```

#### 2. Get Statistics
```http
GET /api/stats

Response:
{
  "total_people": 10,
  "total_visits": 150,
  "known_visitors": 7,
  "new_visitors": 3
}
```

#### 3. Get Visitors List
```http
GET /api/visitors

Response:
[
  {
    "id": "person_123",
    "name": "John Doe",
    "visit_count": 5,
    "last_seen": "2025-10-31T10:30:00Z",
    "embeddings": [[...512 floats...]]
  }
]
```

#### 4. WebSocket
```
ws://localhost:8080/ws
```

**Message format:**
```json
{
  "person_id": "person_123",
  "name": "John Doe",
  "is_known": true,
  "confidence": 0.85,
  "timestamp": "2025-10-31T10:30:00Z",
  "image_url": "/uploads/image.jpg",
  "visit_count": 5
}
```

### MQTT Topics

#### Subscribe (Backend)
```
Topic: face/metadata

Payload:
{
  "person_id": "person_123",
  "timestamp": "2025-10-31T10:30:00Z",
  "embedding": [512 floats],
  "image_path": "image.jpg",
  "camera_id": "CAM-001"
}
```

---

## 🔧 Troubleshooting

### Backend không start được

**Lỗi: "port 8080 already in use"**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Lỗi: "cannot connect to MQTT broker"**
- Kiểm tra internet connection
- Thử broker khác: `tcp://broker.hivemq.com:1883`
- Trong `cmd/server/main.go`, đổi broker URL

### Dashboard không kết nối WebSocket

**Lỗi: "WebSocket connection failed"**
1. Kiểm tra backend đang chạy
2. Kiểm tra URL trong `services/websocket.js`
3. Disable browser extensions (AdBlock, etc.)

### MQTT test script lỗi

**Lỗi: "ModuleNotFoundError: No module named 'paho'"**
```bash
pip install paho-mqtt
```

**Lỗi: "Connection refused"**
- Kiểm tra broker URL
- Thử broker public khác
- Kiểm tra firewall

### Dashboard không hiển thị đúng

**Lỗi: Tailwind classes không work**
```bash
cd dashboard
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### Upload ảnh lỗi

**Lỗi: "413 Payload Too Large"**
- Giảm kích thước ảnh
- Trong backend, tăng limit: `r.ParseMultipartForm(50 << 20)` // 50MB

---

## 🛠️ Configuration

### Backend Environment Variables

Tạo file `backend/.env` (optional):
```env
PORT=8080
MQTT_BROKER=tcp://test.mosquitto.org:1883
MQTT_TOPIC=face/metadata
DATABASE_PATH=./data/faces.json
UPLOAD_DIR=./uploads
```

### Dashboard Environment Variables

Tạo file `dashboard/.env` (optional):
```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

---

## 📝 Development

### Build cho production

#### Backend
```bash
cd backend
go build -o face-recognition-server cmd/server/main.go

# Windows
go build -o face-recognition-server.exe cmd/server/main.go
```

#### Dashboard
```bash
cd dashboard
npm run build
# Output trong folder 'dist/'
```

### Deploy

1. **Backend**: Upload binary + `uploads/` + `data/`
2. **Dashboard**: Upload `dist/` folder
3. Cấu hình reverse proxy (Nginx/Caddy)
4. Setup MQTT broker riêng (optional)

---

## 👥 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

Project Link: [https://github.com/your-username/face-recognition-system](https://github.com/your-username/face-recognition-system)

---

## 🙏 Acknowledgments

- [Paho MQTT](https://www.eclipse.org/paho/)
- [Gorilla WebSocket](https://github.com/gorilla/websocket)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ for IOT Course - UIT**