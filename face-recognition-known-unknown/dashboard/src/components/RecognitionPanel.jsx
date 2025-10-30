import { useState, useEffect } from 'react';
import { User, UserCheck, AlertCircle, Clock, Target } from 'lucide-react';

export default function RecognitionPanel({ latestResult }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (latestResult) {
      setHistory(prev => [latestResult, ...prev].slice(0, 10));
    }
  }, [latestResult]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl h-full flex flex-col border border-[#8ABEB9]/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#305669] to-[#8ABEB9] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Target className="w-6 h-6" />
          <span>Recognition Results</span>
        </h2>
      </div>

      {/* Latest Detection */}
      {latestResult ? (
        <div className="p-6 border-b border-[#8ABEB9]/20 bg-gradient-to-br from-[#B7E5CD]/30 to-white">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={`http://localhost:8080${latestResult.image_url}`}
                alt={latestResult.name}
                className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/112?text=No+Image';
                }}
              />
              {latestResult.is_known && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#B7E5CD] to-[#8ABEB9] rounded-full p-2 shadow-lg">
                  <UserCheck className="w-5 h-5 text-[#305669]" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-[#305669] truncate">
                  {latestResult.name}
                </h3>
                {latestResult.is_known ? (
                  <span className="flex-shrink-0 bg-gradient-to-r from-[#B7E5CD] to-[#8ABEB9] text-[#305669] text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
                    Known Visitor
                  </span>
                ) : (
                  <span className="flex-shrink-0 bg-gradient-to-r from-[#C1785A] to-[#305669] text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
                    New Visitor
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-[#305669]/80">
                  <Clock className="w-4 h-4 text-[#8ABEB9] flex-shrink-0" />
                  <span className="font-medium">{formatTime(latestResult.timestamp)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#305669]/80">
                  <AlertCircle className="w-4 h-4 text-[#8ABEB9] flex-shrink-0" />
                  <span className="font-medium">
                    Confidence: {(latestResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#305669]/80">
                  <User className="w-4 h-4 text-[#8ABEB9] flex-shrink-0" />
                  <span className="font-medium">
                    Visit Count: {latestResult.visit_count} times
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-[#305669]/70 mb-2">
                  <span className="font-semibold">Match Confidence</span>
                  <span className="font-bold">{(latestResult.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-[#B7E5CD]/30 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      latestResult.confidence > 0.8
                        ? 'bg-gradient-to-r from-[#B7E5CD] to-[#8ABEB9]'
                        : latestResult.confidence > 0.6
                        ? 'bg-gradient-to-r from-[#8ABEB9] to-[#C1785A]'
                        : 'bg-gradient-to-r from-[#C1785A] to-[#305669]'
                    } shadow-lg`}
                    style={{ width: `${latestResult.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 border-b border-[#8ABEB9]/20 bg-gradient-to-br from-[#B7E5CD]/30 to-white">
          <div className="text-center py-8 text-[#305669]/50">
            <Target className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold">No Detection Yet</p>
            <p className="text-sm mt-1">Waiting for recognition results...</p>
          </div>
        </div>
      )}

      {/* Detection History */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#8ABEB9] rounded-full" />
          <h3 className="text-sm font-bold text-[#305669] uppercase tracking-wide">
            Recent Detections
          </h3>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-[#305669]/50">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No detections yet</p>
            <p className="text-xs mt-1">Waiting for camera feed...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((result, index) => (
              <div
                key={`${result.person_id}-${index}`}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#B7E5CD]/20 to-transparent rounded-lg hover:from-[#B7E5CD]/30 transition-all duration-200 border border-[#8ABEB9]/20"
              >
                <img
                  src={`http://localhost:8080${result.image_url}`}
                  alt={result.name}
                  className="w-12 h-12 rounded-lg object-cover shadow-md flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48?text=?';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#305669] truncate">
                      {result.name}
                    </p>
                    {result.is_known && (
                      <UserCheck className="w-3 h-3 text-[#8ABEB9] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#305669]/60 font-medium">
                    {formatTime(result.timestamp)} • {result.visit_count} visits
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      result.confidence > 0.8
                        ? 'bg-[#B7E5CD] text-[#305669]'
                        : result.confidence > 0.6
                        ? 'bg-[#8ABEB9] text-white'
                        : 'bg-[#C1785A] text-white'
                    }`}
                  >
                    {(result.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}