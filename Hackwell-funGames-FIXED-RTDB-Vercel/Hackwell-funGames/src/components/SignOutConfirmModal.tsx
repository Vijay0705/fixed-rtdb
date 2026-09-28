import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userRole?: 'student' | 'participant' | 'admin' | 'ADMIN';
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userRole = 'participant'
}) => {
  if (!isOpen) return null;

  const isAdmin = userRole === 'admin' || userRole === 'ADMIN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0_0_#000000] relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#D90429] text-white border-2 border-black hover:bg-[#b00320] transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Modal Header Icon & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-[#FFB703] border-4 border-black shadow-[3px_3px_0_0_#000]">
            <AlertTriangle className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="px-2 py-0.5 bg-[#D90429] text-white font-mono text-[10px] font-black uppercase border border-black shadow-[2px_2px_0_0_#000]">
              CONFIRM SIGN OUT
            </span>
            <h3 className="text-xl font-black uppercase italic text-black mt-0.5">
              Do you really want to sign out?
            </h3>
          </div>
        </div>

        {/* Description Body */}
        <div className="p-4 bg-[#FFF9E6] border-2 border-black text-xs font-bold uppercase text-slate-800 space-y-1">
          {isAdmin ? (
            <p>
              Signing out will terminate your administrative session and return you to the admin login portal.
            </p>
          ) : (
            <p>
              Your current progress and leaderboard stats are safely saved in the college arena database!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="py-3 px-4 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2 text-center"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Yes, Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
