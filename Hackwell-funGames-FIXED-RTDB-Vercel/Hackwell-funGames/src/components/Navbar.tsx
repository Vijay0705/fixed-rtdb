import React from 'react';
import { User } from '../types';
import { calculateRankTier } from '../data/games';
import {
  Trophy,
  Gamepad2,
  TrendingUp,
  History,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles,
  Lock,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenStudentAuth: () => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
  currentPath?: string;
  onNavigateAdmin?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenStudentAuth,
  onOpenAdminLogin,
  onLogout,
  currentPath,
  onNavigateAdmin
}) => {
  const isStudent = currentUser && currentUser.role === 'student';
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'ADMIN');

  const isDashboardPage =
    currentPath === '/admin/dashboard' || currentPath === '/admin' || currentPath === '/admin/';

  const handleBrandClick = () => {
    if (isAdmin) {
      if (onNavigateAdmin) onNavigateAdmin('/admin/dashboard');
      else setActiveTab('admin-dashboard');
    } else {
      if (onNavigateAdmin && currentPath?.startsWith('/admin')) onNavigateAdmin('/');
      setActiveTab('student-home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#D90429] border-b-4 border-black text-white shadow-[0_4px_0_0_#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleBrandClick}
          >
            <div className="flex items-center justify-center w-11 h-11 bg-[#FFB703] border-4 border-black shadow-[3px_3px_0_0_#000000] rotate-[-2deg]">
              <Trophy className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter text-white uppercase italic drop-shadow-[2px_2px_0_#000]">
                  GAMING ARENA
                </span>
              </div>
              <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider -mt-1 hidden sm:block">
                College Gaming Event XP Portal
              </p>
            </div>
          </div>

          {/* Navigation Links (Student / General) */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-2">
              <button
                id="nav-home-btn"
                onClick={() => setActiveTab('student-home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                  activeTab === 'student-home'
                    ? 'bg-[#FFB703] text-black shadow-[3px_3px_0_0_#000000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#FFF9E6]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                Home
              </button>

              <button
                id="nav-games-btn"
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                  activeTab === 'games'
                    ? 'bg-[#FFB703] text-black shadow-[3px_3px_0_0_#000000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#FFF9E6]'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-black stroke-[2.5]" />
                Games
              </button>

              <button
                id="nav-leaderboard-btn"
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#FFB703] text-black shadow-[3px_3px_0_0_#000000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#FFF9E6]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-black stroke-[2.5]" />
                Leaderboard
              </button>

              {isStudent && (
                <button
                  id="nav-game-history-btn"
                  onClick={() => setActiveTab('student-history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                    activeTab === 'student-history'
                      ? 'bg-[#FFB703] text-black shadow-[3px_3px_0_0_#000000] -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#FFF9E6]'
                  }`}
                >
                  <History className="w-4 h-4 text-black stroke-[2.5]" />
                  Game History
                </button>
              )}
            </nav>
          )}

          {/* Navigation Links (Admin Mode) */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <button
                id="admin-navbar-dashboard-btn"
                onClick={() => {
                  if (onNavigateAdmin) {
                    onNavigateAdmin('/admin/dashboard');
                  } else {
                    setActiveTab('admin-dashboard');
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer shadow-[3px_3px_0_0_#000000] ${
                  isDashboardPage
                    ? 'bg-[#FFB703] text-black ring-2 ring-white -translate-y-0.5 scale-105'
                    : 'bg-[#FFB703] text-black hover:bg-[#e0a100]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
                <span>Dashboard</span>
                <span className="ml-1 px-1.5 py-0.5 bg-black text-[#FFB703] text-[9px] font-mono font-bold">
                  ADMIN
                </span>
              </button>

              <button
                onClick={() => {
                  if (onNavigateAdmin) {
                    onNavigateAdmin('/');
                  } else {
                    setActiveTab('student-home');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase tracking-wider transition-all border-2 border-black cursor-pointer ${
                  !currentPath?.startsWith('/admin')
                    ? 'bg-white text-black shadow-[2px_2px_0_0_#000]'
                    : 'bg-white/80 text-black hover:bg-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                Public View
              </button>
            </div>
          )}

          {/* User Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  id="user-badge-header"
                  onClick={handleBrandClick}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white text-black border-2 border-black shadow-[2px_2px_0_0_#000000] cursor-pointer hover:bg-[#FFF9E6] transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.gamerTag}
                    className="w-7 h-7 object-cover border-2 border-black"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black uppercase max-w-[110px] truncate leading-tight">
                      {currentUser.gamerTag}
                    </p>
                    <p className="text-[9px] font-mono font-bold text-[#D90429] uppercase leading-none">
                      {currentUser.role === 'admin' || currentUser.role === 'ADMIN' ? 'Official Admin' : `${currentUser.xp} XP (${calculateRankTier(currentUser.xp)})`}
                    </p>
                  </div>
                </div>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_0_#000000] transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                id="open-auth-btn"
                onClick={onOpenStudentAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_0_#000000] transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        {isAdmin ? (
          <div className="md:hidden flex items-center justify-between px-3 py-2 border-t-2 border-black text-xs bg-[#FFB703] text-black font-black uppercase">
            <button
              id="mobile-admin-dashboard-btn"
              onClick={() => {
                if (onNavigateAdmin) onNavigateAdmin('/admin/dashboard');
                else setActiveTab('admin-dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer ${
                isDashboardPage
                  ? 'bg-black text-[#FFB703]'
                  : 'bg-white text-black'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Admin Dashboard</span>
            </button>
            <span className="text-[10px] font-mono font-black uppercase">OFFICIAL ADMIN MODE</span>
          </div>
        ) : (
          <div className="md:hidden flex items-center justify-around py-2 border-t-2 border-black text-xs bg-white text-black font-black uppercase">
            <button
              onClick={() => setActiveTab('student-home')}
              className={`p-1 text-[10px] ${activeTab === 'student-home' ? 'bg-[#FFB703] border border-black' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`p-1 text-[10px] ${activeTab === 'games' ? 'bg-[#FFB703] border border-black' : ''}`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`p-1 text-[10px] ${activeTab === 'leaderboard' ? 'bg-[#FFB703] border border-black' : ''}`}
            >
              Leaderboard
            </button>
            {isStudent && (
              <button
                onClick={() => setActiveTab('student-history')}
                className={`p-1 text-[10px] ${activeTab === 'student-history' ? 'bg-[#FFB703] border border-black' : ''}`}
              >
                History
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
