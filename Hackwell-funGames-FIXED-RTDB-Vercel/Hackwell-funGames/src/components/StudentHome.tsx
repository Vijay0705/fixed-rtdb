import React, { useEffect, useState } from 'react';
import { User, GameResult } from '../types';
import { calculateRankTier } from '../data/games';
import { Trophy, Zap, Gamepad2, Award, CheckCircle, XCircle, ArrowRight, UserCheck } from 'lucide-react';

interface StudentHomeProps {
  currentUser: User | null;
  activeTab?: string;
  onOpenStudentAuth: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  currentUser,
  activeTab = 'student-home',
  onOpenStudentAuth,
  onNavigateTab
}) => {
  const [myResults, setMyResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      fetch(`/api/users/${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.gameResults) {
            setMyResults(data.gameResults);
          }
        })
        .catch((err) => console.error('Error fetching student results:', err))
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // If viewing the Home Tab, ALWAYS display the exact Home Hero & 8 Official Games layout from screenshot!
  if (activeTab === 'student-home' || !currentUser) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
        {/* Top Hero Card */}
        <div className="bg-white border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0_0_#000000] text-center">
          {/* Trophy Icon Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFB703] border-4 border-black shadow-[4px_4px_0_0_#000000] mx-auto flex items-center justify-center mb-6">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-black stroke-[3]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black italic leading-tight">
            WELCOME TO THE COLLEGE GAMING ARENA!
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base font-bold text-black/85 max-w-2xl mx-auto leading-relaxed mt-4 mb-8">
            The official campus leaderboard and XP hub for Chess, UNO, Drawasourous, Among Us, Antakshiri, Dumb Charades, Guess the PIN, and Free Fire / BGMI!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={currentUser ? () => onNavigateTab('student-score') : onOpenStudentAuth}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-sm uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000] transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
              {currentUser ? `MY PROFILE (${currentUser.gamerTag})` : 'SIGN IN'}
            </button>
            <button
              onClick={() => onNavigateTab('leaderboard')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-sm uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              VIEW LIVE LEADERBOARD
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Bottom 8 Official Event Games Card */}
        <div className="bg-white border-4 border-black p-6 sm:p-7 shadow-[6px_6px_0_0_#000000] text-left">
          <h3 className="font-black text-base sm:text-lg uppercase italic border-b-4 border-black pb-3 mb-4 text-[#D90429] flex items-center gap-2">
            <span>🎮</span> 8 OFFICIAL EVENT GAMES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-black uppercase text-black">
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>♟️</span>
              <span>1. CHESS (+50 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>🃏</span>
              <span>2. UNO (+25 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>✏️</span>
              <span>3. DRAWASOUROUS (+10 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>👾</span>
              <span>4. AMONG US (+15 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>🎵</span>
              <span>5. ANTAKSHIRI (+10 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>🎭</span>
              <span>6. DUMB CHARADES (+5 XP/MOVIE)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>🔢</span>
              <span>7. GUESS THE PIN (+10 XP)</span>
            </div>
            <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
              <span>🎯</span>
              <span>8. FREE FIRE / BGMI (+60 XP)</span>
            </div>
          </div>
        </div>

        {/* If logged in on home tab, quick shortcut to student dashboard */}
        {currentUser && (
          <div className="bg-[#FFB703] border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-black uppercase">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white text-[10px]">LOGGED IN</span>
              <span>{currentUser.fullName} ({currentUser.gamerTag}) • {currentUser.xp} XP</span>
            </div>
            <button
              onClick={() => onNavigateTab('student-score')}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            >
              View My Score & Match Results →
            </button>
          </div>
        )}
      </div>
    );
  }

  const winRate = currentUser.gamesPlayed > 0 ? Math.round((currentUser.wins / currentUser.gamesPlayed) * 100) : 0;

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#FFB703] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_0_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.gamerTag}
            className="w-20 h-20 object-cover border-4 border-black shadow-[3px_3px_0_0_#000]"
          />
          <div>
            <span className="px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              {currentUser.department} • ID: {currentUser.studentId}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase italic text-black tracking-tight mt-1">
              WELCOME, {currentUser.fullName}!
            </h1>
            <p className="text-xs font-black uppercase text-black/90">
              GamerTag: <span className="underline">{currentUser.gamerTag}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('games')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
          >
            Event Games List
          </button>
          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
          >
            Live Leaderboard
          </button>
        </div>
      </div>

      {/* Official Student Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000000] space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">TOTAL XP</span>
            <Zap className="w-5 h-5 text-[#FFB703] stroke-[3] fill-[#FFB703]" />
          </div>
          <p className="text-3xl font-black text-black font-mono">{currentUser.xp.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase">Official Event XP Points</p>
        </div>

        <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000000] space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">CURRENT RANK</span>
            <Award className="w-5 h-5 text-[#D90429] stroke-[3]" />
          </div>
          <p className="text-2xl font-black text-[#D90429] uppercase italic">{calculateRankTier(currentUser.xp)}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase">Based on total XP</p>
        </div>

        <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000000] space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">GAMES PLAYED</span>
            <Gamepad2 className="w-5 h-5 text-[#219EBC] stroke-[3]" />
          </div>
          <p className="text-3xl font-black text-black font-mono">{currentUser.gamesPlayed}</p>
          <p className="text-[10px] font-bold text-slate-600 uppercase">Matches logged by Admin</p>
        </div>

        <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000000] space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-black uppercase tracking-wider">WINS / LOSSES</span>
            <Trophy className="w-5 h-5 text-amber-500 stroke-[3]" />
          </div>
          <p className="text-2xl font-black text-black font-mono">
            <span className="text-emerald-600">{currentUser.wins}W</span> - <span className="text-rose-600">{currentUser.losses}L</span>
          </p>
          <p className="text-[10px] font-bold text-slate-600 uppercase">{winRate}% Victory Ratio</p>
        </div>
      </div>

      {/* MY GAME PERFORMANCE (Read-Only) */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-4">
        <div className="flex items-center justify-between border-b-4 border-black pb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#D90429] stroke-[3]" />
            <h2 className="text-xl font-black uppercase italic text-black">MY OFFICIAL GAME PERFORMANCE</h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">Read-Only Official Results</span>
        </div>

        {loading ? (
          <p className="text-xs font-mono text-center py-6">Loading game history...</p>
        ) : myResults.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm font-bold uppercase text-slate-600">No official game results recorded yet.</p>
            <p className="text-xs font-mono text-slate-500">Participate in event matches! The event admin will log your official results after each game.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-2 border-black text-xs font-black uppercase">
                  <th className="p-3 border-r-2 border-black">Game Name</th>
                  <th className="p-3 border-r-2 border-black">Result</th>
                  <th className="p-3 border-r-2 border-black">XP Earned</th>
                  <th className="p-3 border-r-2 border-black">Recorded Date</th>
                  <th className="p-3">Logged By Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {myResults.map((item) => {
                  const isWin = item.result === 'WIN' || item.result === 'CORRECT WITHIN TIME' || (item.game === 'Dumb Charades' && (item.moviesWon || 0) > 0);
                  return (
                    <tr key={item.id} className="hover:bg-[#FFF9E6] transition-colors">
                      <td className="p-3 border-r-2 border-black font-black uppercase">{item.game}</td>
                      <td className="p-3 border-r-2 border-black">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 border border-black font-black text-[10px] uppercase ${
                            isWin ? 'bg-emerald-300 text-black' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isWin ? <CheckCircle className="w-3.5 h-3.5 stroke-[3]" /> : <XCircle className="w-3.5 h-3.5 stroke-[3]" />}
                          {item.game === 'Dumb Charades' && item.moviesWon ? `${item.moviesWon} Movies Won` : item.result}
                        </span>
                      </td>
                      <td className="p-3 border-r-2 border-black font-mono font-black text-[#D90429]">
                        +{item.xpAwarded} XP
                      </td>
                      <td className="p-3 border-r-2 border-black font-mono text-slate-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.recordedByAdmin}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 8 Official Event Games Reference */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] text-left">
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
          <h3 className="font-black text-base sm:text-lg uppercase italic text-[#D90429] flex items-center gap-2">
            <span>🎮</span> 8 OFFICIAL EVENT GAMES & XP
          </h3>
          <button
            onClick={() => onNavigateTab('games')}
            className="text-xs font-black uppercase underline hover:text-[#D90429] cursor-pointer"
          >
            View Full Game Rules →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-black uppercase text-black">
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>♟️</span>
            <span>1. CHESS (+50 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>🃏</span>
            <span>2. UNO (+25 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>✏️</span>
            <span>3. DRAWASOUROUS (+10 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>👾</span>
            <span>4. AMONG US (+15 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>🎵</span>
            <span>5. ANTAKSHIRI (+10 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>🎭</span>
            <span>6. DUMB CHARADES (+5 XP/MOVIE)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>🔢</span>
            <span>7. GUESS THE PIN (+10 XP)</span>
          </div>
          <div className="p-3 bg-white border-2 border-black flex items-center gap-2 hover:bg-[#FFF9E6] transition-colors">
            <span>🎯</span>
            <span>8. FREE FIRE / BGMI (+60 XP)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
