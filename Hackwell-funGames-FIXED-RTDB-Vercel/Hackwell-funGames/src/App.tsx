import React, { useState, useEffect } from 'react';
import { User, LeaderboardUser, GameResult } from './types';
import { calculateRankTier } from './data/games';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { GamesView } from './components/GamesView';
import { LeaderboardView } from './components/LeaderboardView';
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SignOutConfirmModal } from './components/SignOutConfirmModal';
import { AdminDashboard, AdminSubTab } from './components/AdminDashboard';
import { Trophy, Zap, CheckCircle2, AlertCircle, X, Lock, ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // URL Path Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  // Active View Tab for non-admin views
  const [activeTab, setActiveTab] = useState<
    'student-home' | 'games' | 'leaderboard' | 'student-score' | 'student-history'
  >('student-home');

  // Modals State
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<LeaderboardUser | null>(null);
  const [inspectedUserHistory, setInspectedUserHistory] = useState<GameResult[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper for path navigation
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial app data (leaderboard / student roster) and restore existing session
  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, meRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('hero_rank_token') || ''}`
          }
        })
      ]);

      const usersData = await usersRes.json();
      if (usersData.users) {
        setStudents(usersData.users);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user) {
          setCurrentUser(meData.user);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Student Google Authentication Handler
  const handleStudentGoogleAuth = async (studentData: {
    email: string;
    fullName: string;
    gamerTag: string;
    department: string;
    studentId: string;
    avatar?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/student-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem('hero_rank_token', data.token);
        setCurrentUser(data.user);
        showToast(`Signed in as student ${data.user.fullName}!`);
        setActiveTab('student-home');
        fetchData();
      } else if (data.error) {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Student authentication failed.', 'error');
    }
  };

  // Admin Login Handler
  const handleAdminLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        localStorage.setItem('hero_rank_token', data.token);
        setCurrentUser(data.user);
        showToast(`Welcome to Admin Control Center, ${data.user.fullName}!`);
        setIsAdminLoginOpen(false);
        navigate('/admin/dashboard');
        fetchData();
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid admin credentials.' };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to the authentication service. Please try again.'
      };
    }
  };

  // Sign Out Handler - Opens confirmation popup
  const handleLogout = () => {
    setIsSignOutModalOpen(true);
  };

  // Confirmed Sign Out
  const handleConfirmLogout = async () => {
    const token = localStorage.getItem('hero_rank_token');
    const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'ADMIN');

    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // Silently handle request errors
      }
    }

    localStorage.removeItem('hero_rank_token');
    setCurrentUser(null);
    setIsSignOutModalOpen(false);

    if (isAdmin) {
      showToast('Admin has left the building. 🫡💻 See you soon!');
      navigate('/admin/login');
    } else {
      showToast("And they're gone... 🚪💨 See you next time, legend!");
      navigate('/');
      setActiveTab('student-home');
    }
  };

  // Handle Inspecting User Row on Leaderboard
  const handleSelectUserForModal = (user: LeaderboardUser) => {
    setInspectedUser(user);
    fetch(`/api/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.gameResults) {
          setInspectedUserHistory(data.gameResults);
        }
      })
      .catch((err) => console.error('Error fetching player history:', err));
  };

  // Helper to map /admin/* paths to AdminSubTab
  const getAdminSubTabFromPath = (path: string): AdminSubTab => {
    if (path === '/admin/points') return 'update-points';
    if (path === '/admin/players') return 'players';
    if (path === '/admin/games') return 'games';
    if (path === '/admin/leaderboard') return 'leaderboard';
    if (path === '/admin/results') return 'game-results';
    if (path === '/admin/history') return 'xp-history';
    if (path === '/admin/analytics') return 'analytics';
    if (path === '/admin/audit') return 'audit-log';
    if (path === '/admin/profile') return 'admin-profile';
    return 'dashboard';
  };

  const getPathFromAdminSubTab = (tab: AdminSubTab): string => {
    switch (tab) {
      case 'update-points': return '/admin/points';
      case 'players': return '/admin/players';
      case 'games': return '/admin/games';
      case 'leaderboard': return '/admin/leaderboard';
      case 'game-results': return '/admin/results';
      case 'xp-history': return '/admin/history';
      case 'analytics': return '/admin/analytics';
      case 'audit-log': return '/admin/audit';
      case 'admin-profile': return '/admin/profile';
      default: return '/admin/dashboard';
    }
  };

  const isAdminUser = currentUser && (currentUser.role === 'admin' || currentUser.role === 'ADMIN');
  const isAdminRoute = currentPath.startsWith('/admin');

  // Automatic redirect logic for admin routes
  useEffect(() => {
    if (!loading) {
      if (currentPath === '/admin' || currentPath === '/admin/') {
        if (isAdminUser) {
          navigate('/admin/dashboard');
        } else {
          navigate('/admin/login');
        }
      } else if (isAdminRoute && !isAdminUser && currentPath !== '/admin/login') {
        navigate('/admin/login');
      }
    }
  }, [loading, isAdminRoute, isAdminUser, currentPath]);

  return (
    <div className="min-h-screen bg-transparent text-black font-sans selection:bg-[#FFB703] selection:text-black border-x-0 md:border-x-[8px] border-black">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div
            className={`px-4 py-3 border-4 border-black shadow-[4px_4px_0_0_#000000] flex items-center gap-2.5 text-xs font-black uppercase ${
              toastMessage.type === 'success' ? 'bg-[#FFB703] text-black' : 'bg-[#D90429] text-white'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-black stroke-[3]" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white stroke-[3]" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (isAdminRoute) {
            navigate('/');
          }
          setActiveTab(tab as any);
        }}
        onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
        onOpenAdminLogin={() => {
          navigate('/admin/login');
          setIsAdminLoginOpen(true);
        }}
        onLogout={handleLogout}
        currentPath={currentPath}
        onNavigateAdmin={(path) => navigate(path)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {isAdminRoute ? (
          /* ADMIN ROUTE RENDERING */
          loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="inline-block p-4 bg-[#FFB703] border-4 border-black shadow-[4px_4px_0_0_#000] animate-bounce">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-black uppercase italic">Verifying Admin Credentials...</h2>
            </div>
          ) : currentPath === '/admin/login' ? (
            isAdminUser ? (
              /* Already logged in as admin, redirect to dashboard */
              <div className="py-12 text-center space-y-4">
                <p className="font-black text-sm uppercase">Authenticated as Admin ({currentUser.email})</p>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 bg-[#FFB703] text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000]"
                >
                  Go to Admin Dashboard (/admin/dashboard)
                </button>
              </div>
            ) : (
              /* Standalone /admin/login page view */
              <div className="max-w-md mx-auto my-8 bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_#000000] space-y-6">
                <div className="text-center space-y-2 border-b-4 border-black pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D90429] border-2 border-black text-white shadow-[2px_2px_0_0_#000] mb-2">
                    <Lock className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h1 className="text-2xl font-black uppercase italic tracking-tight">ADMIN AUTHENTICATION</h1>
                  <p className="text-xs font-mono font-bold text-slate-600 uppercase">
                    Official Gaming Arena Control Center
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const email = (form.elements.namedItem('adminEmail') as HTMLInputElement).value;
                    const pass = (form.elements.namedItem('adminPassword') as HTMLInputElement).value;
                    const res = await handleAdminLogin(email, pass);
                    if (!res.success) {
                      showToast(res.error || 'Invalid credentials', 'error');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Admin Email / Username</label>
                    <input
                      name="adminEmail"
                      type="email"
                      defaultValue="ivijaysa@gmail.com"
                      required
                      className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-mono text-xs focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Admin Password</label>
                    <input
                      name="adminPassword"
                      type="password"
                      defaultValue="vijay007"
                      required
                      className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-mono text-xs focus:bg-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 stroke-[3]" />
                    Sign In to Admin Portal
                  </button>
                </form>

                <div className="pt-2 text-center border-t-2 border-black">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-xs font-black uppercase text-black hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Student Home
                  </button>
                </div>
              </div>
            )
          ) : !isAdminUser ? (
            /* 403 / ACCESS DENIED SCREEN FOR UNAUTHENTICATED / NON-ADMIN USER ON /admin/* */
            <div className="max-w-2xl mx-auto my-12 bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000000] text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D90429] text-white border-4 border-black shadow-[4px_4px_0_0_#000]">
                <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="px-3 py-1 bg-[#D90429] text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0_0_#000]">
                  403 — ACCESS DENIED
                </span>
                <h2 className="text-3xl font-black uppercase italic tracking-tight mt-3">
                  ADMIN AUTHENTICATION REQUIRED
                </h2>
                <p className="text-xs font-mono font-bold text-slate-600 uppercase mt-2">
                  Requested Path: <span className="text-[#D90429]">{currentPath}</span>
                </p>
              </div>

              <div className="p-4 bg-[#FFF9E6] border-2 border-black text-xs font-bold uppercase text-slate-800 space-y-1">
                <p>You must be logged in with an official admin account to access administration controls.</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Authorized Admin: <strong className="text-black">ivijaysa@gmail.com</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    navigate('/admin/login');
                    setIsAdminLoginOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 stroke-[3]" />
                  Sign In as Admin (/admin/login)
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
                >
                  Return to Public Leaderboard
                </button>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN ACCESSING /admin/* */
            <AdminDashboard
              adminUser={currentUser}
              students={students}
              onRefreshData={fetchData}
              onLogout={handleLogout}
              showToast={showToast}
              onSelectUserForModal={handleSelectUserForModal}
              activeSubTab={getAdminSubTabFromPath(currentPath)}
              onNavigateSubTab={(tab) => navigate(getPathFromAdminSubTab(tab))}
            />
          )
        ) : (
          /* STUDENT / VISITOR PORTAL */
          <>
            {activeTab === 'student-home' && (
              <StudentHome
                currentUser={currentUser}
                activeTab={activeTab}
                onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'games' && <GamesView />}

            {activeTab === 'leaderboard' && (
              <LeaderboardView onSelectUser={handleSelectUserForModal} />
            )}

            {activeTab === 'student-score' && (
              <StudentHome
                currentUser={currentUser}
                activeTab={activeTab}
                onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'student-history' && (
              <StudentHome
                currentUser={currentUser}
                activeTab={activeTab}
                onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}
          </>
        )}
      </main>

      {/* MODALS */}

      {/* Participant Auth Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthOpen}
        onClose={() => setIsStudentAuthOpen(false)}
        onLoginSuccess={(user, token) => {
          localStorage.setItem('hero_rank_token', token);
          setCurrentUser(user);
          showToast(`Welcome back, ${user.fullName}! 🎉`);
          setIsStudentAuthOpen(false);
          if (user.role === 'admin' || user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          }
          fetchData();
        }}
        existingStudents={students}
      />

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userRole={currentUser?.role}
      />

      {/* Admin Login Portal Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLogin={handleAdminLogin}
        onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
      />

      {/* Inspect Player Profile & Game History Modal */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-xl w-full shadow-[8px_8px_0_0_#000] relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectedUser(null)}
              className="absolute top-4 right-4 p-1.5 bg-[#D90429] text-white border-2 border-black hover:bg-[#b00320] cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <img
                src={inspectedUser.avatar}
                alt={inspectedUser.gamerTag}
                className="w-16 h-16 object-cover border-4 border-black shadow-[2px_2px_0_0_#000]"
              />
              <div>
                <span className="px-2 py-0.5 bg-[#FFB703] text-black font-mono text-[10px] font-black uppercase border border-black">
                  RANK #{inspectedUser.rank} • {inspectedUser.department}
                </span>
                <h3 className="text-2xl font-black uppercase italic text-black">{inspectedUser.fullName}</h3>
                <p className="text-xs font-black uppercase text-[#D90429]">GamerTag: @{inspectedUser.gamerTag}</p>
                <p className="text-xs font-mono text-slate-600">ID: {inspectedUser.studentId}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono font-black uppercase text-xs">
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">TOTAL XP</span>
                <span className="text-xl text-[#D90429]">{inspectedUser.xp.toLocaleString()} XP</span>
              </div>
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">RANK TIER</span>
                <span className="text-xl text-black">{calculateRankTier(inspectedUser.xp)}</span>
              </div>
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">WINS / LOSSES</span>
                <span className="text-xl text-black">{inspectedUser.wins}W / {inspectedUser.losses}L</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase italic border-b-2 border-black pb-1">
                Official Game History (Logged by Admin)
              </h4>
              {inspectedUserHistory.length === 0 ? (
                <p className="text-xs font-bold text-slate-500 py-3 uppercase">
                  No official game results logged yet.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {inspectedUserHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#FFF9E6] border-2 border-black flex items-center justify-between text-xs font-black uppercase"
                    >
                      <div>
                        <span>{item.game}</span>
                        <span className="ml-2 font-mono text-[10px] text-slate-600">[{item.result}]</span>
                      </div>
                      <span className="font-mono text-[#D90429]">+{item.xpAwarded} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
