import { useState, useEffect, useRef } from 'react';
import { Camera, Wifi, WifiOff } from 'lucide-react';

export default function VideoStream() {
  const [isConnected, setIsConnected] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    // Giả lập kết nối camera stream
    // Trong thực tế, bạn sẽ nhận stream URL từ ESP32-CAM hoặc camera IP
    const checkConnection = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    return () => clearInterval(checkConnection);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">Live Camera Feed</span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Video Stream */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {isConnected ? (
          <div className="w-full h-full flex items-center justify-center">
            {/* Placeholder cho video stream thực tế */}
            <img
              ref={videoRef}
              src="http://localhost:8080/stream" // URL stream từ camera
              alt="Camera Stream"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback khi không có stream */}
            <div className="hidden flex-col items-center justify-center text-gray-500">
              <Camera className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-sm">Waiting for camera stream...</p>
              <p className="text-xs mt-2 text-gray-600">
                Make sure your camera is connected and streaming
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <WifiOff className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm">Camera Offline</p>
            <p className="text-xs mt-2 text-gray-600">Reconnecting...</p>
          </div>
        )}

        {/* Overlay indicators */}
        {isConnected && (
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-red-500 rounded-full w-3 h-3 animate-pulse" />
            <span className="text-white text-xs font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
              REC
            </span>
          </div>
        )}

        {/* FPS Counter */}
        {isConnected && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-xs">
            30 FPS
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-t border-gray-700">
        <div className="flex justify-between">
          <span>Resolution: 640x480</span>
          <span>Camera ID: CAM-001</span>
        </div>
      </div>
    </div>
  );
}