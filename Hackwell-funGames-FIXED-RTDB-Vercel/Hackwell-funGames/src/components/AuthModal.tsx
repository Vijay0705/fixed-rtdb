import React, { useState } from 'react';
import { User } from '../types';
import { X, UserCheck, AlertCircle, Eye, EyeOff, LogIn, CheckCircle2, Lock, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string, isAdmin: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Unified Login state (Student or Admin)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration state (Student)
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin Forgot / Reset Password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'confirm'>('request');

  // Status & loading
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setError('');
    setSuccessMsg('');
    setLoginIdentifier('');
    setLoginPassword('');
    setName('');
    setUsername('');
    setDepartment('CSE');
    setTeamName('');
    setPassword('');
    setConfirmPassword('');
    setShowLoginPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResetEmail('');
    setResetToken('');
    setNewAdminPassword('');
    setResetStep('request');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // UNIFIED LOGIN SUBMIT (Handles both Student & Admin)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please enter your Username/Email and Password.');
      return;
    }

    setLoading(true);

    try {
      const identifier = loginIdentifier.trim();
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: identifier,
          password: loginPassword
        })
      });

      let data = await res.json();

      // If participant login fails, try admin login endpoint
      if (!res.ok || data.error) {
        const adminRes = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: identifier,
            password: loginPassword
          })
        });

        const adminData = await adminRes.json();
        if (adminRes.ok && adminData.token && adminData.user) {
          res = adminRes;
          data = adminData;
        }
      }

      if (!res.ok || data.error) {
        setError(data.error || 'Invalid credentials. Please check your username/email and password.');
      } else if (data.token && data.user) {
        const user: User = data.user;
        const isAdmin = user.role === 'ADMIN' || user.role === 'admin';
        setSuccessMsg(`Sign in successful! Redirecting to ${isAdmin ? 'Admin Dashboard' : 'Student Portal'}...`);

        setTimeout(() => {
          onLoginSuccess(user, data.token, isAdmin);
          handleClose();
        }, 600);
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STUDENT REGISTRATION SUBMIT
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !username.trim() || !department.trim() || !teamName.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields (Name, Username, Department, Team Name, Password, and Confirm Password).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your Password and Confirm Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          department,
          teamName: teamName.trim(),
          password,
          confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Registration failed. Please try again.');
      } else {
        setSuccessMsg(data.message || 'Account registered successfully!');
        if (data.token && data.user) {
          setTimeout(() => {
            onLoginSuccess(data.user, data.token, false);
            handleClose();
          }, 800);
        }
      }
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN FORGOT PASSWORD REQUEST
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetEmail.trim()) {
      setError('Please enter your admin email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() })
      });
      const data = await res.json();

      if (res.ok && data.resetToken) {
        setResetToken(data.resetToken);
        setResetStep('confirm');
        setSuccessMsg('Reset code generated! Enter your new password below.');
      } else {
        setError(data.error || 'Failed to generate reset code.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ADMIN RESET PASSWORD CONFIRM
  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resetToken || !newAdminPassword) {
      setError('Please enter the reset token and your new password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword: newAdminPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Password updated! Please sign in with your new password.');
        setTimeout(() => {
          setAuthMode('login');
          setLoginIdentifier(resetEmail);
          setLoginPassword('');
          setResetStep('request');
        }, 1200);
      } else {
        setError(data.error || 'Password reset failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0_0_#000000] relative space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 bg-[#D90429] text-white border-2 border-black hover:bg-[#b00320] transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Header Title */}
        <div className="border-b-4 border-black pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#FFB703] text-black font-mono text-[10px] font-black uppercase border border-black shadow-[2px_2px_0_0_#000]">
              🎮 GAMING ARENA PORTAL
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase italic text-black">
            {authMode === 'login' && 'ACCOUNT SIGN IN'}
            {authMode === 'register' && 'PARTICIPANT REGISTRATION'}
            {authMode === 'forgot' && 'ADMIN PASSWORD RESET'}
          </h2>
          <p className="text-xs font-bold uppercase text-slate-600 mt-1">
            {authMode === 'login' && 'Sign in to access your Student Profile or Admin Control Center'}
            {authMode === 'register' && 'Join the official college gaming event leaderboard'}
            {authMode === 'forgot' && 'Reset your official gaming arena admin password'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {authMode !== 'forgot' && (
          <div className="grid grid-cols-2 gap-2 bg-[#FFF9E6] p-1.5 border-2 border-black">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 px-3 text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 border-2 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#FFB703] text-black border-black shadow-[2px_2px_0_0_#000]'
                  : 'bg-white text-black border-transparent hover:bg-slate-100'
              }`}
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 px-3 text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 border-2 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#FFB703] text-black border-black shadow-[2px_2px_0_0_#000]'
                  : 'bg-white text-black border-transparent hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-[#D90429] text-white border-2 border-black font-bold text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
            <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#38B000] text-white border-2 border-black font-bold text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
            <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.5]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* --- FORM 1: UNIFIED LOG IN --- */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Username or Email <span className="text-[#D90429]">*</span>
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Enter username or email address"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase">
                  Password <span className="text-[#D90429]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[10px] font-black uppercase text-[#D90429] hover:underline"
                >
                  Admin Reset?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>SIGN IN TO PORTAL</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* --- FORM 2: REGISTER MODE --- */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Full Name <span className="text-[#D90429]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Username / Gamer Tag <span className="text-[#D90429]">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ShadowStriker99"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Department <span className="text-[#D90429]">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                >
                  <option value="CSE">CSE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="AIML">AIML</option>
                  <option value="IT">IT</option>
                  <option value="CSBS">CSBS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Team Name <span className="text-[#D90429]">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. CyberKnights"
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Password <span className="text-[#D90429]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Confirm Password <span className="text-[#D90429]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>COMPLETE REGISTRATION</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* --- FORM 3: ADMIN FORGOT / RESET PASSWORD --- */}
        {authMode === 'forgot' && (
          <div className="space-y-4">
            {resetStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    Admin Email Address <span className="text-[#D90429]">*</span>
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter admin email address"
                    className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>GENERATE RESET CODE</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    Reset Token Code
                  </label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 border-2 border-black font-mono font-bold text-xs outline-none"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">
                    New Admin Password <span className="text-[#D90429]">*</span>
                  </label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#38B000] text-white hover:bg-[#2e9000] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0_0_#000000] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>SAVE NEW PASSWORD</span>
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className="w-full py-2 bg-white text-black border-2 border-black font-black text-xs uppercase hover:bg-slate-100 transition-colors"
            >
              ← Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
