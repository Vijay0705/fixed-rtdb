import React, { useState, useEffect } from 'react';
import { GameResult } from '../types';
import { Search, Filter, Ban, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminGameResultsProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AdminGameResults: React.FC<AdminGameResultsProps> = ({ showToast }) => {
  const [results, setResults] = useState<GameResult[]>([]);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Void Modal state
  const [selectedResultToVoid, setSelectedResultToVoid] = useState<GameResult | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [voiding, setVoiding] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/admin/game-results');
      const data = await res.json();
      if (data.gameResults) {
        setResults(data.gameResults);
      }
    } catch (err) {
      console.error('Error fetching game results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleVoidResult = async () => {
    if (!selectedResultToVoid || !voidReason) {
      showToast('Please provide a reason for voiding this result.', 'error');
      return;
    }

    const token = localStorage.getItem('hero_rank_token');
    setVoiding(true);

    try {
      const res = await fetch('/api/admin/void-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resultId: selectedResultToVoid.id,
          voidReason
        })
      });

      const data = await res.json();
      setVoiding(false);
      setSelectedResultToVoid(null);

      if (data.success) {
        showToast('Game result voided successfully! XP reversed in database.');
        fetchResults();
      } else {
        showToast(data.error || 'Failed to void result.', 'error');
      }
    } catch (err) {
      setVoiding(false);
      showToast('Error voiding result.', 'error');
    }
  };

  const filtered = results.filter((r) => {
    const matchesSearch =
      r.userGamerTag.toLowerCase().includes(search.toLowerCase()) ||
      r.userFullName.toLowerCase().includes(search.toLowerCase()) ||
      r.game.toLowerCase().includes(search.toLowerCase());
    const matchesGame = gameFilter === 'ALL' || r.game === gameFilter;
    return matchesSearch && matchesGame;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-black">
            OFFICIAL GAME RESULTS & CORRECTIONS
          </h2>
          <p className="text-xs font-bold uppercase text-black/90 mt-1">
            Audit official tournament scores. Admins can void invalid entries with mandatory audit reasons.
          </p>
        </div>
        <button
          onClick={fetchResults}
          className="p-2 bg-[#D90429] hover:bg-[#b00320] text-white border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000000] flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-2 w-full">
          <Search className="w-5 h-5 text-black stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or gamerTag..."
            className="w-full bg-transparent outline-none font-bold text-xs uppercase text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-black shrink-0" />
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="p-2 bg-[#FFF9E6] border-2 border-black font-black text-xs uppercase outline-none cursor-pointer"
          >
            <option value="ALL">All 8 Games</option>
            <option value="Chess">Chess</option>
            <option value="UNO">UNO</option>
            <option value="Drawasourous / Scribble.io">Drawasourous</option>
            <option value="Among Us">Among Us</option>
            <option value="Antakshiri">Antakshiri</option>
            <option value="Dumb Charades">Dumb Charades</option>
            <option value="Guess the PIN">Guess the PIN</option>
            <option value="Free Fire / BGMI">BGMI / Free Fire</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-mono font-bold text-xs">Loading game results...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center font-bold text-sm text-slate-600 uppercase">
            No official game results found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-4 border-black text-xs font-black uppercase">
                  <th className="p-3 border-r-2 border-black">Student Player</th>
                  <th className="p-3 border-r-2 border-black">Game</th>
                  <th className="p-3 border-r-2 border-black">Result</th>
                  <th className="p-3 border-r-2 border-black font-mono">XP Awarded</th>
                  <th className="p-3 border-r-2 border-black">Recorded By Admin</th>
                  <th className="p-3 border-r-2 border-black">Date & Time</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FFF9E6] transition-colors ${
                      item.isVoided ? 'bg-rose-50 text-slate-400 line-through' : ''
                    }`}
                  >
                    <td className="p-3 border-r-2 border-black">
                      <p className="font-black text-sm uppercase text-black">{item.userFullName}</p>
                      <p className="text-[10px] font-black text-[#D90429] uppercase">@{item.userGamerTag}</p>
                    </td>
                    <td className="p-3 border-r-2 border-black font-black uppercase">{item.game}</td>
                    <td className="p-3 border-r-2 border-black uppercase font-mono">
                      {item.game === 'Dumb Charades' && item.moviesWon ? `${item.moviesWon} Movies Won` : item.result}
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono font-black text-sm text-[#D90429]">
                      +{item.xpAwarded} XP
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-700">{item.recordedByAdmin}</td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-600">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      {item.isVoided ? (
                        <span className="px-2 py-0.5 bg-rose-200 text-rose-800 border border-black text-[10px] uppercase font-black">
                          VOIDED ({item.voidReason})
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedResultToVoid(item);
                            setVoidReason('Incorrect score entry or duplicate submission.');
                          }}
                          className="px-2.5 py-1 bg-[#D90429] hover:bg-[#b00320] text-white border border-black font-black text-[10px] uppercase shadow-[2px_2px_0_0_#000] cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <Ban className="w-3 h-3" />
                          Void Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VOID CONFIRMATION MODAL */}
      {selectedResultToVoid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0_0_#000] space-y-4">
            <div className="border-b-4 border-black pb-2">
              <h3 className="text-xl font-black uppercase italic text-[#D90429]">VOID GAME RESULT ENTRY</h3>
              <p className="text-xs font-bold text-slate-600 uppercase mt-1">This action will reverse player XP and record an audit log.</p>
            </div>

            <div className="bg-[#FFF9E6] border-2 border-black p-3 text-xs font-black uppercase space-y-1">
              <p>Player: {selectedResultToVoid.userFullName} (@{selectedResultToVoid.userGamerTag})</p>
              <p>Game: {selectedResultToVoid.game} [{selectedResultToVoid.result}]</p>
              <p>XP To Deduct: -{selectedResultToVoid.xpAwarded} XP</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1">Mandatory Reason for Voiding *</label>
              <textarea
                rows={3}
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g. Referee reported incorrect score entry or participant disqualification"
                className="w-full p-2.5 bg-[#FFF9E6] border-2 border-black font-bold text-xs outline-none focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedResultToVoid(null)}
                className="flex-1 py-2.5 bg-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0_0_#000]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVoidResult}
                disabled={voiding}
                className="flex-1 py-2.5 bg-[#D90429] text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0_0_#000]"
              >
                {voiding ? 'Voiding...' : 'Confirm Void'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
