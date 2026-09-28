import React, { useState } from 'react';
import { User, EventGame } from '../types';
import { Zap, PlusCircle, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface AdminUpdatePointsProps {
  students: User[];
  onPointsUpdated: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

const EVENT_GAMES_LIST: EventGame[] = [
  'Chess',
  'UNO',
  'Drawasourous / Scribble.io',
  'Among Us',
  'Antakshiri',
  'Dumb Charades',
  'Guess the PIN',
  'Free Fire / BGMI'
];

export const AdminUpdatePoints: React.FC<AdminUpdatePointsProps> = ({
  students,
  onPointsUpdated,
  showToast
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedGame, setSelectedGame] = useState<EventGame>('Chess');
  const [result, setResult] = useState<string>('WIN');
  const [moviesWon, setMoviesWon] = useState<number>(1);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Calculate XP strictly on frontend preview matching backend logic
  const calculateXpPreview = (): number => {
    switch (selectedGame) {
      case 'Chess':
        return result === 'WIN' ? 50 : 0;
      case 'UNO':
        return result === 'WIN' ? 25 : 0;
      case 'Drawasourous / Scribble.io':
        return result === 'WIN' ? 10 : 0;
      case 'Among Us':
        return result === 'WIN' ? 15 : 0;
      case 'Antakshiri':
        return result === 'WIN' ? 10 : 0;
      case 'Dumb Charades':
        return Math.max(0, moviesWon) * 5;
      case 'Guess the PIN':
        return result === 'CORRECT WITHIN TIME' ? 10 : 0;
      case 'Free Fire / BGMI':
        return result === 'WIN' ? 60 : 0;
      default:
        return 0;
    }
  };

  const xpToAward = calculateXpPreview();
  const currentXp = selectedStudent ? selectedStudent.xp : 0;
  const newTotalXp = currentXp + xpToAward;

  const handleSubmitPoints = async () => {
    if (!selectedStudent) {
      showToast('Please select a student participant', 'error');
      return;
    }

    const token = localStorage.getItem('hero_rank_token');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/update-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedStudent.id,
          game: selectedGame,
          result: selectedGame === 'Dumb Charades' ? 'WIN' : result,
          moviesWon: selectedGame === 'Dumb Charades' ? moviesWon : undefined
        })
      });

      const data = await res.json();
      setLoading(false);
      setIsConfirming(false);

      if (data.success) {
        showToast(`Logged official ${selectedGame} result for ${selectedStudent.fullName} (+${xpToAward} XP)`);
        onPointsUpdated();
      } else {
        showToast(data.error || 'Failed to update points', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('Error recording result to database.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Banner */}
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000]">
        <div className="flex items-center gap-2 text-black">
          <Zap className="w-7 h-7 fill-black stroke-[2.5]" />
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight">
            UPDATE EVENT POINTS (OFFICIAL ADMIN TOOL)
          </h2>
        </div>
        <p className="text-xs font-bold uppercase text-black/90 mt-1">
          Select participant and game result. XP values are calculated automatically by the backend rules.
        </p>
      </div>

      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_0_#000000] space-y-6">
        {/* Step 1: Select Student Participant */}
        <div>
          <label className="block text-xs font-black uppercase mb-1.5 text-black">
            1. Select Student Participant *
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full p-3 bg-[#FFF9E6] border-2 border-black font-black text-xs uppercase outline-none focus:bg-white cursor-pointer"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.fullName} (@{st.gamerTag}) • {st.department} • Current: {st.xp} XP
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Game */}
        <div>
          <label className="block text-xs font-black uppercase mb-1.5 text-black">
            2. Select Event Game *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EVENT_GAMES_LIST.map((gameName) => (
              <button
                key={gameName}
                type="button"
                onClick={() => {
                  setSelectedGame(gameName);
                  if (gameName === 'Guess the PIN') {
                    setResult('CORRECT WITHIN TIME');
                  } else {
                    setResult('WIN');
                  }
                }}
                className={`p-3 border-2 border-black font-black text-xs uppercase text-left transition-all cursor-pointer ${
                  selectedGame === gameName
                    ? 'bg-[#FFB703] text-black shadow-[3px_3px_0_0_#000]'
                    : 'bg-[#FFF9E6] hover:bg-slate-100 text-black'
                }`}
              >
                {gameName}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Select Result according to Game */}
        <div className="p-4 bg-[#FFF9E6] border-2 border-black space-y-3">
          <label className="block text-xs font-black uppercase text-black">
            3. Game Result Input for <span className="underline">{selectedGame}</span>:
          </label>

          {/* Special Input for Dumb Charades */}
          {selectedGame === 'Dumb Charades' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Rule: +5 XP awarded per movie won by the team.
              </p>
              <div className="flex items-center gap-3">
                <label className="text-xs font-black uppercase">Number of Movies Won:</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={moviesWon}
                  onChange={(e) => setMoviesWon(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-24 p-2 bg-white border-2 border-black font-mono font-black text-sm outline-none"
                />
                <span className="text-xs font-black font-mono text-[#D90429]">
                  = +{moviesWon * 5} XP
                </span>
              </div>
            </div>
          )}

          {/* Special Options for Guess the PIN */}
          {selectedGame === 'Guess the PIN' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Codebreaking Result:</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full p-2.5 bg-white border-2 border-black font-black text-xs uppercase outline-none"
              >
                <option value="CORRECT WITHIN TIME">CORRECT WITHIN TIME (+10 XP)</option>
                <option value="WRONG">WRONG GUESS (0 XP)</option>
                <option value="TIMEOUT">TIMEOUT / CLOCK EXPIRATION (0 XP)</option>
              </select>
            </div>
          )}

          {/* Standard WIN / LOSS for Chess, UNO, Drawasourous, Among Us, Antakshiri */}
          {selectedGame !== 'Dumb Charades' && selectedGame !== 'Guess the PIN' && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setResult('WIN')}
                className={`flex-1 py-3 border-2 border-black font-black text-xs uppercase tracking-wider cursor-pointer ${
                  result === 'WIN' ? 'bg-emerald-400 text-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black'
                }`}
              >
                🏆 WIN (+XP)
              </button>
              <button
                type="button"
                onClick={() => setResult('LOSS')}
                className={`flex-1 py-3 border-2 border-black font-black text-xs uppercase tracking-wider cursor-pointer ${
                  result === 'LOSS' ? 'bg-rose-400 text-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black'
                }`}
              >
                ❌ LOSS (0 XP)
              </button>
            </div>
          )}
        </div>

        {/* LIVE XP PREVIEW BOX BEFORE SAVING */}
        <div className="bg-black text-white p-5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[10px] uppercase text-slate-400">Target Student: {selectedStudent?.fullName}</p>
            <div className="flex items-center gap-3 text-sm font-bold">
              <span>Current: {currentXp} XP</span>
              <span>+</span>
              <span className="text-[#FFB703] font-black text-base">Award: +{xpToAward} XP</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block">NEW TOTAL XP:</span>
            <span className="text-2xl font-black text-emerald-400">{newTotalXp} XP</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="w-full py-4 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-sm uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          Review & Record Game Result
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0_0_#000] space-y-5">
            <div className="border-b-4 border-black pb-3">
              <h3 className="text-xl font-black uppercase italic text-black">CONFIRM OFFICIAL RESULT ENTRY</h3>
              <p className="text-xs font-bold text-slate-600 uppercase mt-1">Please double-check details before publishing to live leaderboard:</p>
            </div>

            <div className="bg-[#FFF9E6] border-2 border-black p-4 space-y-2 text-xs font-black uppercase">
              <p><span className="text-slate-500">Participant:</span> {selectedStudent?.fullName} (@{selectedStudent?.gamerTag})</p>
              <p><span className="text-slate-500">Game:</span> {selectedGame}</p>
              <p><span className="text-slate-500">Result:</span> {selectedGame === 'Dumb Charades' ? `${moviesWon} Movies Won` : result}</p>
              <p><span className="text-slate-500">XP Calculated:</span> <span className="text-[#D90429]">+{xpToAward} XP</span></p>
              <p><span className="text-slate-500">New Total XP:</span> {newTotalXp} XP</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="flex-1 py-3 bg-white hover:bg-slate-100 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitPoints}
                disabled={loading}
                className="flex-1 py-3 bg-[#D90429] hover:bg-[#b00320] text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
              >
                {loading ? 'Saving...' : 'Confirm & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
