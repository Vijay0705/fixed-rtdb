import React, { useState, useEffect } from 'react';
import { LeaderboardUser } from '../types';
import { calculateRankTier } from '../data/games';
import { Trophy, RefreshCw, Search, Zap, Crown, Award, Medal, CheckCircle2 } from 'lucide-react';

interface LeaderboardViewProps {
  onSelectUser: (user: LeaderboardUser) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onSelectUser }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshCountdown, setRefreshCountdown] = useState<number>(60);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and 60-second auto refresh interval
  useEffect(() => {
    fetchLeaderboard();
    setRefreshCountdown(60);

    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchLeaderboard();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchQuery]);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Top Header Banner with Live Refresh Badge */}
      <div className="bg-[#FFB703] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_0_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE LEADERBOARD
            </span>
            <span className="text-[10px] font-mono font-bold text-black uppercase">
              Last Updated: {lastUpdated || 'Just now'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-black">
            COLLEGE ARENA XP LEADERBOARD
          </h1>
          <p className="text-xs font-bold uppercase text-black/80 mt-1">
            Official cumulative rankings for all 8 event games. Refreshes automatically every 60 seconds.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-3 py-2 bg-white border-2 border-black font-mono text-xs font-black uppercase text-black flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
            <RefreshCw className="w-4 h-4 text-[#D90429] animate-spin stroke-[2.5]" />
            <span>Auto-Refresh in {refreshCountdown}s</span>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchLeaderboard();
              setRefreshCountdown(60);
            }}
            className="p-2 bg-[#D90429] hover:bg-[#b00320] text-white border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            title="Refresh Now"
          >
            <RefreshCw className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* TOP 3 WINNERS HEADER BANNER */}
      {!loading && leaderboard.length >= 1 && (
        <div className="space-y-3">
          <h3 className="font-black text-sm uppercase italic text-black tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 stroke-[3]" />
            CURRENT EVENT CHAMPIONS & PODIUM LEADERBOARD
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* #1 CHAMPION */}
            {top1 && (
              <div
                onClick={() => onSelectUser(top1)}
                className="bg-[#FFB703] border-4 border-black p-5 shadow-[6px_6px_0_0_#000000] cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-black text-[#FFB703] px-2.5 py-0.5 font-black text-[10px] uppercase border-2 border-black">
                  👑 RANK #1 FINAL BOSS
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={top1.avatar}
                    alt={top1.gamerTag}
                    className="w-14 h-14 object-cover border-4 border-black shadow-[2px_2px_0_0_#000]"
                  />
                  <div>
                    <h4 className="font-black text-xl uppercase italic text-black">{top1.fullName}</h4>
                    <p className="text-xs font-black uppercase text-black/90">@{top1.gamerTag}</p>
                    <p className="text-[10px] font-mono font-bold text-black/70 uppercase">{top1.department}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between font-mono font-black">
                  <span className="text-xs uppercase">TOTAL XP</span>
                  <span className="text-xl text-[#D90429] flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-[#D90429]" />
                    {top1.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            )}

            {/* #2 RUNNER UP */}
            {top2 && (
              <div
                onClick={() => onSelectUser(top2)}
                className="bg-[#E0E0E0] border-4 border-black p-5 shadow-[6px_6px_0_0_#000000] cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-black text-white px-2.5 py-0.5 font-black text-[10px] uppercase border-2 border-black">
                  🥈 RANK #2 BOSS SLAYER
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={top2.avatar}
                    alt={top2.gamerTag}
                    className="w-14 h-14 object-cover border-4 border-black shadow-[2px_2px_0_0_#000]"
                  />
                  <div>
                    <h4 className="font-black text-xl uppercase italic text-black">{top2.fullName}</h4>
                    <p className="text-xs font-black uppercase text-black/90">@{top2.gamerTag}</p>
                    <p className="text-[10px] font-mono font-bold text-black/70 uppercase">{top2.department}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between font-mono font-black">
                  <span className="text-xs uppercase">TOTAL XP</span>
                  <span className="text-xl text-black flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-black" />
                    {top2.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            )}

            {/* #3 THIRD PLACE */}
            {top3 && (
              <div
                onClick={() => onSelectUser(top3)}
                className="bg-[#D4A373] border-4 border-black p-5 shadow-[6px_6px_0_0_#000000] cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-black text-[#FFB703] px-2.5 py-0.5 font-black text-[10px] uppercase border-2 border-black">
                  🥉 RANK #3 RISING LEGEND
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={top3.avatar}
                    alt={top3.gamerTag}
                    className="w-14 h-14 object-cover border-4 border-black shadow-[2px_2px_0_0_#000]"
                  />
                  <div>
                    <h4 className="font-black text-xl uppercase italic text-black">{top3.fullName}</h4>
                    <p className="text-xs font-black uppercase text-black/90">@{top3.gamerTag}</p>
                    <p className="text-[10px] font-mono font-bold text-black/70 uppercase">{top3.department}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between font-mono font-black">
                  <span className="text-xs uppercase">TOTAL XP</span>
                  <span className="text-xl text-black flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-black" />
                    {top3.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000000] flex items-center gap-3">
        <Search className="w-5 h-5 text-black stroke-[3]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student players by name, gamerTag, department, or student ID..."
          className="w-full bg-transparent outline-none font-bold text-xs uppercase text-black placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-black uppercase px-2 py-0.5 bg-slate-200 border border-black cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-mono font-bold text-xs">Loading campus leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center font-bold text-sm text-slate-600 uppercase">
            No registered student participants found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-4 border-black text-xs font-black uppercase">
                  <th className="p-4 border-r-2 border-black text-center w-16">Rank</th>
                  <th className="p-4 border-r-2 border-black">Student Player</th>
                  <th className="p-4 border-r-2 border-black">Department</th>
                  <th className="p-4 border-r-2 border-black font-mono">Rank Tier</th>
                  <th className="p-4 border-r-2 border-black font-mono">Total XP</th>
                  <th className="p-4 border-r-2 border-black text-center">Played</th>
                  <th className="p-4 text-center">W / L Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {leaderboard.map((user) => {
                  const isTop1 = user.rank === 1;
                  const isTop2 = user.rank === 2;
                  const isTop3 = user.rank === 3;

                  return (
                    <tr
                      key={user.id}
                      onClick={() => onSelectUser(user)}
                      className="hover:bg-[#FFF9E6] cursor-pointer transition-colors"
                    >
                      <td className="p-4 border-r-2 border-black text-center font-black text-sm">
                        {isTop1 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-[#FFB703] border-2 border-black font-black text-black shadow-[2px_2px_0_0_#000]">
                            #1
                          </span>
                        ) : isTop2 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-[#E0E0E0] border-2 border-black font-black text-black shadow-[2px_2px_0_0_#000]">
                            #2
                          </span>
                        ) : isTop3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-[#D4A373] border-2 border-black font-black text-black shadow-[2px_2px_0_0_#000]">
                            #3
                          </span>
                        ) : (
                          `#${user.rank}`
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-black">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.gamerTag}
                            className="w-9 h-9 object-cover border-2 border-black"
                          />
                          <div>
                            <p className="font-black text-sm uppercase text-black leading-tight">
                              {user.fullName}
                            </p>
                            <p className="text-[10px] font-black text-[#D90429] uppercase">
                              @{user.gamerTag}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-black font-mono text-slate-700 uppercase">
                        {user.department}
                      </td>
                      <td className="p-4 border-r-2 border-black font-black">
                        <span className="px-2 py-0.5 bg-[#FFF9E6] border border-black text-[10px] uppercase text-black">
                          {calculateRankTier(user.xp)}
                        </span>
                      </td>
                      <td className="p-4 border-r-2 border-black font-mono font-black text-base text-[#D90429]">
                        {user.xp.toLocaleString()} XP
                      </td>
                      <td className="p-4 border-r-2 border-black text-center font-mono font-black">
                        {user.gamesPlayed}
                      </td>
                      <td className="p-4 text-center font-mono font-black">
                        <span className="text-emerald-600">{user.wins}W</span> / <span className="text-rose-600">{user.losses}L</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
