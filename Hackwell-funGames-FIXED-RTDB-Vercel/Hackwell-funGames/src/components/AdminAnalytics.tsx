import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Gamepad2, Zap, Trophy, RefreshCw } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<{
    totalParticipants: number;
    totalGamesPlayed: number;
    totalXpAwarded: number;
    mostPlayedGame: string;
    currentLeader: string;
    totalWins: number;
    averageXp: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('hero_rank_token');
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.analytics) {
        setData(json.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-black">
            EVENT ANALYTICS & INSIGHTS
          </h2>
          <p className="text-xs font-bold uppercase text-black/90 mt-1">
            Real-time event summary metrics for college gaming tournament performance.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 bg-[#D90429] text-white border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {loading || !data ? (
        <div className="bg-white border-4 border-black p-12 text-center font-mono font-bold text-xs">
          Loading analytics metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">TOTAL PARTICIPANTS</span>
              <Users className="w-6 h-6 text-[#219EBC]" />
            </div>
            <p className="text-4xl font-black text-black font-mono">{data.totalParticipants}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Verified College Student Gamers</p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">TOTAL GAMES LOGGED</span>
              <Gamepad2 className="w-6 h-6 text-[#D90429]" />
            </div>
            <p className="text-4xl font-black text-black font-mono">{data.totalGamesPlayed}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Matches Completed Across 8 Games</p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">TOTAL XP AWARDED</span>
              <Zap className="w-6 h-6 text-[#FFB703] fill-[#FFB703]" />
            </div>
            <p className="text-4xl font-black text-[#D90429] font-mono">{data.totalXpAwarded.toLocaleString()} XP</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Distributed Event Points</p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">MOST PLAYED GAME</span>
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-black uppercase italic">{data.mostPlayedGame}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Highest Match Participation</p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">CURRENT #1 LEADER</span>
              <Trophy className="w-6 h-6 text-[#FFB703]" />
            </div>
            <p className="text-xl font-black text-[#D90429] uppercase italic truncate">{data.currentLeader}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Top Event Player</p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-2">
            <div className="flex items-center justify-between text-black">
              <span className="text-xs font-black uppercase tracking-wider">AVERAGE XP / PLAYER</span>
              <BarChart3 className="w-6 h-6 text-[#219EBC]" />
            </div>
            <p className="text-3xl font-black text-black font-mono">{data.averageXp} XP</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Mean XP Accumulation</p>
          </div>
        </div>
      )}
    </div>
  );
};
