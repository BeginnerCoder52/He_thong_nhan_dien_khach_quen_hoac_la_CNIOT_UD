import { useState, useEffect } from 'react';
import { Clock, User, Calendar, Filter } from 'lucide-react';
import { api } from '../services/api';

export default function VisitorHistory() {
  const [visitors, setVisitors] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadVisitors();
    const interval = setInterval(loadVisitors, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadVisitors = async () => {
    try {
      const data = await api.getVisitors();
      setVisitors(data.sort((a, b) => 
        new Date(b.last_seen) - new Date(a.last_seen)
      ));
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
  };

  const filteredVisitors = visitors.filter(v => {
    if (filter === 'known') return v.visit_count > 1;
    if (filter === 'new') return v.visit_count === 1;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl h-full flex flex-col border border-[#8ABEB9]/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8ABEB9] to-[#305669] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Visitor History
        </h2>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-[#8ABEB9]/20 bg-gradient-to-r from-[#B7E5CD]/20 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-[#305669]" />
          <span className="text-xs font-bold text-[#305669] uppercase tracking-wide">Filter by</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#8ABEB9] to-[#305669] text-white shadow-lg'
                : 'bg-[#B7E5CD]/30 text-[#305669] hover:bg-[#B7E5CD]/50'
            }`}
          >
            All ({visitors.length})
          </button>

          <button
            onClick={() => setFilter('known')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === 'known'
                ? 'bg-gradient-to-r from-[#B7E5CD] to-[#8ABEB9] text-[#305669] shadow-lg'
                : 'bg-[#B7E5CD]/30 text-[#305669] hover:bg-[#B7E5CD]/50'
            }`}
          >
            Known ({visitors.filter(v => v.visit_count > 1).length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === 'new'
                ? 'bg-gradient-to-r from-[#C1785A] to-[#305669] text-white shadow-lg'
                : 'bg-[#C1785A]/30 text-[#305669] hover:bg-[#C1785A]/50'
            }`}
          >
            New ({visitors.filter(v => v.visit_count === 1).length})
          </button>
        </div>
      </div>

      {/* Visitor List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredVisitors.length === 0 ? (
          <div className="text-center py-12 text-[#305669]/50">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No visitors found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#B7E5CD]/20 to-transparent rounded-lg hover:from-[#B7E5CD]/40 transition-all duration-200 cursor-pointer border border-[#8ABEB9]/20 hover:shadow-md"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8ABEB9] to-[#305669] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {visitor.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#305669] truncate">
                      {visitor.name}
                    </h4>
                    {visitor.visit_count > 1 && (
                      <span className="bg-gradient-to-r from-[#B7E5CD] to-[#8ABEB9] text-[#305669] text-xs px-2 py-0.5 rounded-full font-bold">
                        Regular
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#305669]/70 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {visitor.visit_count} visits
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(visitor.last_seen)}
                    </span>
                  </div>
                </div>

                {/* Visit count badge */}
                <div className="text-center bg-gradient-to-br from-[#8ABEB9] to-[#305669] rounded-lg px-4 py-2 shadow-md">
                  <div className="text-2xl font-bold text-white">
                    {visitor.visit_count}
                  </div>
                  <div className="text-xs text-[#B7E5CD] font-semibold">visits</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// export default VisitorHistory;