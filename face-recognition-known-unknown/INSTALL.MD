# 🚀 Quick Installation Guide

## Prerequisites
- Go >= 1.19
- Node.js >= 18
- npm >= 9

## Installation Steps

### 1. Clone & Navigate
```bash
git clone https://github.com/your-username/face-recognition-system.git
cd face-recognition-system
```

### 2. Backend Setup
```bash
cd backend
go mod download
```

### 3. Dashboard Setup
```bash
cd ../dashboard
npm install
```

### 4. Python (Optional)
```bash
cd ..
pip install paho-mqtt
```

## Run Application

### Terminal 1 - Backend
```bash
cd backend
go run cmd/server/main.go
```

### Terminal 2 - Dashboard
```bash
cd dashboard
npm run dev
```

### Terminal 3 - Test (Optional)
```bash
python test_mqtt_sender.py
# Choose option 2
```

## Access
- Dashboard: http://localhost:5173
- Backend API: http://localhost:8080

## Done! 🎉