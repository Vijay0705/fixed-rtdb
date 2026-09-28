import React, { useState } from 'react';
import { User, LeaderboardUser } from '../types';
import { AdminUpdatePoints } from './AdminUpdatePoints';
import { AdminGameResults } from './AdminGameResults';
import { AdminXpHistory } from './AdminXpHistory';
import { AdminPlayerManagement } from './AdminPlayerManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminAuditLog } from './AdminAuditLog';
import { GamesView } from './GamesView';
import { LeaderboardView } from './LeaderboardView';
import {
  ShieldAlert,
  Zap,
  Users,
  Gamepad2,
  TrendingUp,
  History,
  BarChart3,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  PlusCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';

export type AdminSubTab =
  | 'dashboard'
  | 'update-points'
  | 'players'
  | 'games'
  | 'leaderboard'
  | 'game-results'
  | 'xp-history'
  | 'analytics'
  | 'audit-log'
  | 'admin-profile';

interface AdminDashboardProps {
  adminUser: User;
  students: User[];
  onRefreshData: () => void;
  onLogout: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
  onSelectUserForModal: (user: LeaderboardUser) => void;
  activeSubTab?: AdminSubTab;
  onNavigateSubTab?: (tab: AdminSubTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  students,
  onRefreshData,
  onLogout,
  showToast,
  onSelectUserForModal,
  activeSubTab,
  onNavigateSubTab
}) => {
  const [internalTab, setInternalTab] = useState<AdminSubTab>('dashboard');

  const adminTab = activeSubTab || internalTab;

  const handleTabClick = (tab: AdminSubTab) => {
    if (onNavigateSubTab) {
      onNavigateSubTab(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);
  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  const totalGamesPlayed = students.reduce((sum, s) => sum + s.gamesPlayed, 0);
  const totalXpAwarded = students.reduce((sum, s) => sum + s.xp, 0);

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Top Admin Header Bar */}
      <div className="bg-[#D90429] text-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#FFB703] text-black font-mono text-[10px] font-black uppercase border border-black shadow-[2px_2px_0_0_#000]">
              OFFICIAL ADMIN CONTROL CENTER
            </span>
            <span className="text-xs font-mono font-bold text-white/90 uppercase">
              Logged in as: {adminUser.fullName} ({adminUser.email})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight italic">
            COLLEGE GAMING EVENT MANAGEMENT
          </h1>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Exit Admin Mode
        </button>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="bg-white border-4 border-black p-2 shadow-[6px_6px_0_0_#000000] flex items-center gap-1.5 overflow-x-auto text-xs font-black uppercase">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'dashboard' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => handleTabClick('update-points')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'update-points' ? 'bg-[#D90429] text-white shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          Update Points
        </button>

        <button
          onClick={() => handleTabClick('players')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'players' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Players ({students.length})
        </button>

        <button
          onClick={() => handleTabClick('games')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'games' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Event Games
        </button>

        <button
          onClick={() => handleTabClick('leaderboard')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'leaderboard' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Leaderboard
        </button>

        <button
          onClick={() => handleTabClick('game-results')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'game-results' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Game Results
        </button>

        <button
          onClick={() => handleTabClick('xp-history')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'xp-history' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          XP History
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'analytics' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Analytics
        </button>

        <button
          onClick={() => handleTabClick('audit-log')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'audit-log' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Audit Log
        </button>

        <button
          onClick={() => handleTabClick('admin-profile')}
          className={`px-3 py-2 border-2 border-black cursor-pointer whitespace-nowrap transition-all ${
            adminTab === 'admin-profile' ? 'bg-[#FFB703] text-black shadow-[2px_2px_0_0_#000]' : 'bg-[#FFF9E6] text-black'
          }`}
        >
          Admin Profile
        </button>
      </div>

      {/* VIEW CONTENT SWITCHER */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Main Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-slate-500 block">TOTAL PARTICIPANTS</span>
              <p className="text-3xl font-black text-black font-mono">{students.length}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">Verified College Students</p>
            </div>

            <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-slate-500 block">TOTAL GAMES LOGGED</span>
              <p className="text-3xl font-black text-black font-mono">{totalGamesPlayed}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">Official Event Results</p>
            </div>

            <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-slate-500 block">TOTAL XP AWARDED</span>
              <p className="text-3xl font-black text-[#D90429] font-mono">{totalXpAwarded.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">Distributed Event Points</p>
            </div>

            <div className="bg-[#FFB703] border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-black block">👑 CURRENT #1 CHAMPION</span>
              <p className="text-xl font-black text-black uppercase italic truncate mt-1">
                {top1 ? top1.fullName : 'None'}
              </p>
              <p className="text-[10px] font-black text-black font-mono mt-1">{top1 ? `${top1.xp} XP` : '0 XP'}</p>
            </div>

            <div className="bg-[#E0E0E0] border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-black block">🥈 CURRENT #2 RUNNER-UP</span>
              <p className="text-xl font-black text-black uppercase italic truncate mt-1">
                {top2 ? top2.fullName : 'None'}
              </p>
              <p className="text-[10px] font-black text-black font-mono mt-1">{top2 ? `${top2.xp} XP` : '0 XP'}</p>
            </div>

            <div className="bg-[#D4A373] border-4 border-black p-5 shadow-[5px_5px_0_0_#000]">
              <span className="text-[10px] font-black uppercase text-black block">🥉 CURRENT #3 THIRD PLACE</span>
              <p className="text-xl font-black text-black uppercase italic truncate mt-1">
                {top3 ? top3.fullName : 'None'}
              </p>
              <p className="text-[10px] font-black text-black font-mono mt-1">{top3 ? `${top3.xp} XP` : '0 XP'}</p>
            </div>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] space-y-4">
            <h3 className="font-black text-lg uppercase italic border-b-4 border-black pb-2 text-black">
              ⚡ QUICK ADMIN ACTIONS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleTabClick('update-points')}
                className="p-4 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase border-2 border-black shadow-[4px_4px_0_0_#000] cursor-pointer flex flex-col items-center text-center gap-2 transition-all"
              >
                <Zap className="w-6 h-6 stroke-[2.5]" />
                <span>UPDATE EVENT POINTS</span>
              </button>

              <button
                onClick={() => handleTabClick('players')}
                className="p-4 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase border-2 border-black shadow-[4px_4px_0_0_#000] cursor-pointer flex flex-col items-center text-center gap-2 transition-all"
              >
                <Users className="w-6 h-6 stroke-[2.5]" />
                <span>VIEW PLAYERS</span>
              </button>

              <button
                onClick={() => handleTabClick('leaderboard')}
                className="p-4 bg-[#219EBC] hover:bg-[#1a839d] text-white font-black text-xs uppercase border-2 border-black shadow-[4px_4px_0_0_#000] cursor-pointer flex flex-col items-center text-center gap-2 transition-all"
              >
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                <span>VIEW LEADERBOARD</span>
              </button>

              <button
                onClick={() => handleTabClick('game-results')}
                className="p-4 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase border-2 border-black shadow-[4px_4px_0_0_#000] cursor-pointer flex flex-col items-center text-center gap-2 transition-all"
              >
                <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
                <span>VIEW GAME RESULTS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'update-points' && (
        <AdminUpdatePoints
          students={students}
          onPointsUpdated={onRefreshData}
          showToast={showToast}
        />
      )}

      {adminTab === 'players' && (
        <AdminPlayerManagement students={students} onRefresh={onRefreshData} />
      )}

      {adminTab === 'games' && <GamesView />}

      {adminTab === 'leaderboard' && (
        <LeaderboardView
          onSelectUser={(u) => onSelectUserForModal(u)}
        />
      )}

      {adminTab === 'game-results' && <AdminGameResults showToast={showToast} />}

      {adminTab === 'xp-history' && <AdminXpHistory />}

      {adminTab === 'analytics' && <AdminAnalytics />}

      {adminTab === 'audit-log' && <AdminAuditLog />}

      {adminTab === 'admin-profile' && (
        <div className="bg-white border-4 border-black p-8 max-w-xl mx-auto shadow-[6px_6px_0_0_#000000] space-y-4">
          <div className="border-b-4 border-black pb-3">
            <span className="px-2 py-0.5 bg-[#D90429] text-white font-mono text-[10px] font-black uppercase border border-black">
              Verified Event Admin
            </span>
            <h3 className="text-2xl font-black uppercase italic text-black mt-1">{adminUser.fullName}</h3>
            <p className="text-xs font-mono text-slate-600">{adminUser.email}</p>
          </div>

          <div className="space-y-2 text-xs font-black uppercase">
            <p><span className="text-slate-500">Department:</span> {adminUser.department}</p>
            <p><span className="text-slate-500">Admin ID:</span> {adminUser.studentId}</p>
            <p><span className="text-slate-500">Role:</span> Official Tournament Referee / Admin</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
          >
            Sign Out of Admin Mode
          </button>
        </div>
      )}
    </div>
  );
};
