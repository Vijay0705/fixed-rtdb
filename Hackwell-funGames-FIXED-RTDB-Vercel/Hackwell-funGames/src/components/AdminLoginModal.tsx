import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onOpenStudentAuth: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLogin,
  onOpenStudentAuth
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password sub-state
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter admin email and password.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await onAdminLogin(email, password);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Invalid admin credentials.');
    }
  };

  const handleRequestResetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken || 'reset_demo_token');
        setResetStep(2);
        setSuccessMessage('Reset code generated! Proceed to set your new password.');
      } else {
        setError(data.error || 'Failed to request reset token');
      }
    } catch (err) {
      setError('Failed to request password reset token.');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Password reset successfully! Please log in below.');
        setIsForgotPasswordView(false);
        setPassword(newPassword);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0_0_#000000] relative space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#D90429] text-white border-2 border-black hover:bg-[#b00320] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Modal Header */}
        <div className="border-b-4 border-black pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#D90429] text-white font-mono text-[10px] font-black uppercase border border-black flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Restricted Portal
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase italic text-black">
            OFFICIAL ADMIN LOGIN
          </h2>
          <p className="text-xs font-bold uppercase text-slate-600 mt-1">
            For college event organizers and referees ONLY.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#D90429] text-white border-2 border-black font-bold text-xs uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-400 text-black border-2 border-black font-bold text-xs uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {isForgotPasswordView ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="text-xs font-black uppercase italic text-[#D90429]">
                Admin Password Reset Portal
              </span>
              <button
                type="button"
                onClick={() => setIsForgotPasswordView(false)}
                className="text-[10px] font-black uppercase flex items-center gap-1 text-black hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
            </div>

            {resetStep === 1 ? (
              <form onSubmit={handleRequestResetToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@gamingarena.edu"
                    className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#219EBC] hover:bg-[#1a839d] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
                >
                  Generate Reset Token
                </button>
              </form>
            ) : (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Reset Token</label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-mono font-bold text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">New Admin Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FFB703] hover:bg-[#e0a100] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer"
                >
                  Save New Admin Password
                </button>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD LOGIN VIEW */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">Admin Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gamingarena.edu"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase">Password *</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordView(true);
                    setResetStep(1);
                    setError('');
                  }}
                  className="text-[10px] font-black uppercase text-[#D90429] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 stroke-[3]" />
              {loading ? 'Authenticating Admin...' : 'Sign In to Admin Control Center'}
            </button>
          </form>
        )}

        {/* Switch to Student Auth */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenStudentAuth();
            }}
            className="text-xs font-black uppercase text-black hover:underline cursor-pointer"
          >
            Not an Admin? Switch to Student Google Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
