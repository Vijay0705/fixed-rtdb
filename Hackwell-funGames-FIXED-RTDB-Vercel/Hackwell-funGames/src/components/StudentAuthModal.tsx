import React, { useState } from 'react';
import { User } from '../types';
import { X, UserCheck, AlertCircle, Eye, EyeOff, LogIn, CheckCircle2 } from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
  existingStudents: User[];
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingStudents
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Registration state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status & loading
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setError('');
    setSuccessMsg('');
    setName('');
    setUsername('');
    setDepartment('CSE');
    setTeamName('');
    setPassword('');
    setConfirmPassword('');
    setLoginUsername('');
    setLoginPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowLoginPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
            onLoginSuccess(data.user, data.token);
            handleClose();
          }, 1200);
        }
      }
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginUsername.trim() || !loginPassword) {
      setError('Please enter your Username/Email and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Invalid username/email or password.');
      } else if (data.token && data.user) {
        onLoginSuccess(data.user, data.token);
        handleClose();
      }
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0_0_#000000] relative space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
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
            {authMode === 'login' ? 'ACCOUNT SIGN IN' : 'PARTICIPANT REGISTRATION'}
          </h2>
          <p className="text-xs font-bold uppercase text-slate-600 mt-1">
            {authMode === 'login'
              ? 'Sign in with your GamerTag, Student ID, or Admin Email'
              : 'Join the official college gaming arena leaderboard'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
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
            <span>Sign In</span>
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
            <span>Register</span>
          </button>
        </div>

        {/* Notifications */}
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

        {/* Form - REGISTER MODE */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                1. Name <span className="text-[#D90429]">*</span>
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
                2. Username <span className="text-[#D90429]">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ApexLegend_99"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  3. Department <span className="text-[#D90429]">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none cursor-pointer"
                  required
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
                  4. Team Name <span className="text-[#D90429]">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Cyber Strikers"
                  className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                5. Password <span className="text-[#D90429]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-black hover:text-[#D90429] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                6. Confirm Password <span className="text-[#D90429]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-black hover:text-[#D90429] cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <UserCheck className="w-4 h-4 stroke-[3]" />
              {loading ? 'Creating Account...' : 'Register / Create Account'}
            </button>
          </form>
        )}

        {/* Form - LOGIN MODE */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Username or Registered Email <span className="text-[#D90429]">*</span>
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. GamerTag, Student ID, or Admin Email"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">
                Password <span className="text-[#D90429]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-black hover:text-[#D90429] cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <LogIn className="w-4 h-4 stroke-[3]" />
              {loading ? 'Authenticating...' : 'Sign In To Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
