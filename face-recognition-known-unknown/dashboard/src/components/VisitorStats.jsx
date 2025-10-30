import { useState, useEffect } from 'react';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

export default function VisitorStats() {
  const [stats, setStats] = useState({
    total_people: 0,
    total_visits: 0,
    known_visitors: 0,
    new_visitors: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
      
      setChartData([
        { day: 'Mon', visits: 45 },
        { day: 'Tue', visits: 52 },
        { day: 'Wed', visits: 38 },
        { day: 'Thu', visits: 61 },
        { day: 'Fri', visits: 55 },
        { day: 'Sat', visits: 70 },
        { day: 'Sun', visits: 48 },
      ]);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgGradient, change }) => (
    <div className={`${bgGradient} rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/80 mb-2 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white drop-shadow-md">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-white/90" />
              <span className="text-sm text-white/90 font-semibold">
                +{change}%
              </span>
              <span className="text-xs text-white/70">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Visitors"
          value={stats.total_people || 0}
          color="bg-[#305669]"
          bgGradient="bg-gradient-to-br from-[#8ABEB9] to-[#305669]"
          change={12}
        />
        <StatCard
          icon={UserCheck}
          label="Known Visitors"
          value={stats.known_visitors || 0}
          color="bg-[#8ABEB9]"
          bgGradient="bg-gradient-to-br from-[#B7E5CD] to-[#8ABEB9]"
          change={8}
        />
        <StatCard
          icon={UserPlus}
          label="New Visitors"
          value={stats.new_visitors || 0}
          color="bg-[#C1785A]"
          bgGradient="bg-gradient-to-br from-[#C1785A] to-[#305669]"
          change={24}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Visits"
          value={stats.total_visits || 0}
          color="bg-[#305669]"
          bgGradient="bg-gradient-to-br from-[#305669] to-[#8ABEB9]"
          change={15}
        />
      </div>

      {/* Chart */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-[#8ABEB9]/30">
        <h3 className="text-lg font-bold text-[#305669] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8ABEB9]" />
          Weekly Visit Trends
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8ABEB9" opacity={0.3} />
            <XAxis dataKey="day" stroke="#305669" />
            <YAxis stroke="#305669" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#305669',
                border: 'none',
                borderRadius: '12px',
                color: '#B7E5CD',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="visits" 
              fill="url(#colorGradient)" 
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8ABEB9" />
                <stop offset="100%" stopColor="#305669" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}