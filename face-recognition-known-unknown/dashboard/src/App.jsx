import { useState, useEffect } from 'react';
import VideoStream from './components/VideoStream';
import RecognitionPanel from './components/RecognitionPanel';
import VisitorStats from './components/VisitorStats';
import VisitorHistory from './components/VisitorHistory';
import { wsService } from './services/websocket';
import { Activity, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mqttStatus, setMqttStatus] = useState({
    connected: false,
    lastMessage: null,
    messageCount: 0
  });

  useEffect(() => {
    wsService.connect();
    setIsConnected(true);

    wsService.onMessage((result) => {
      console.log('New recognition result:', result);
      setLatestResult(result);
      
      setMqttStatus(prev => ({
        connected: true,
        lastMessage: new Date(),
        messageCount: prev.messageCount + 1
      }));
    });

    const checkInterval = setInterval(() => {
      const now = new Date();
      if (mqttStatus.lastMessage) {
        const diff = now - mqttStatus.lastMessage;
        if (diff > 30000) {
          setMqttStatus(prev => ({ ...prev, connected: false }));
        }
      }
    }, 5000);

    return () => {
      wsService.disconnect();
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B7E5CD] via-[#8ABEB9] to-[#305669] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#305669] to-[#8ABEB9] shadow-lg border-b border-[#C1785A]/20">
        <div className="max-w-[1920px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B7E5CD] to-[#8ABEB9] rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-[#305669]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                  Face Recognition System
                </h1>
                <p className="text-sm text-[#B7E5CD] mt-0.5">
                  Real-time visitor monitoring and analytics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* WebSocket Status */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg">
                {isConnected ? (
                  <>
                    <Wifi className="w-5 h-5 text-[#B7E5CD] animate-pulse" />
                    <div className="text-left">
                      <div className="text-[#B7E5CD] text-xs font-semibold">WebSocket</div>
                      <div className="text-white text-sm font-medium">Connected</div>
                    </div>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-[#C1785A]" />
                    <div className="text-left">
                      <div className="text-[#C1785A] text-xs font-semibold">WebSocket</div>
                      <div className="text-white text-sm font-medium">Disconnected</div>
                    </div>
                  </>
                )}
              </div>

              {/* MQTT Status */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg">
                {mqttStatus.connected ? (
                  <>
                    <div className="w-3 h-3 bg-[#B7E5CD] rounded-full animate-pulse shadow-lg shadow-[#B7E5CD]/50" />
                    <div className="text-left">
                      <div className="text-[#B7E5CD] text-xs font-semibold">MQTT Active</div>
                      <div className="text-white text-sm font-medium">
                        {mqttStatus.messageCount} messages
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-[#C1785A] rounded-full" />
                    <div className="text-left">
                      <div className="text-[#C1785A] text-xs font-semibold">MQTT Idle</div>
                      <div className="text-white text-sm font-medium">Waiting...</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MQTT Notification Toast */}
      {mqttStatus.lastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-[#B7E5CD] to-[#8ABEB9] text-[#305669] px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-white/50">
            <div className="w-2 h-2 bg-[#305669] rounded-full animate-pulse" />
            <div>
              <p className="font-semibold text-sm">MQTT Message Received</p>
              <p className="text-xs opacity-80">
                {new Date(mqttStatus.lastMessage).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] mx-auto px-6 py-6 w-full">
        {/* Stats Overview */}
        <div className="mb-6">
          <VisitorStats />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="h-[500px]">
              <RecognitionPanel latestResult={latestResult} />
            </div>
            <div className="h-[400px]">
              <VisitorHistory />
            </div>
          </div>

          {/* Right Column */}
          <div className="h-[916px]">
            <VideoStream />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#305669] border-t border-[#8ABEB9]/30 mt-auto">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <p className="text-center text-sm text-[#B7E5CD]">
            Face Recognition Dashboard © 2025 | Powered by Go + React + MQTT
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;