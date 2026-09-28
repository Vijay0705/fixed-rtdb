import React, { useState, useEffect } from 'react';
import { XpHistoryEntry } from '../types';
import { History, Search, RefreshCw, Zap } from 'lucide-react';

export const AdminXpHistory: React.FC = () => {
  const [history, setHistory] = useState<XpHistoryEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/xp/history');
      const data = await res.json();
      if (data.xpHistory) {
        setHistory(data.xpHistory);
      }
    } catch (err) {
      console.error('Failed to fetch XP history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = history.filter((h) =>
    h.userGamerTag.toLowerCase().includes(search.toLowerCase()) ||
    h.game.toLowerCase().includes(search.toLowerCase()) ||
    h.performedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-black">
            OFFICIAL XP TRANSACTION HISTORY
          </h2>
          <p className="text-xs font-bold uppercase text-black/90 mt-1">
            Complete, immutable audit trail of all XP points awarded or voided across event games.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2 bg-[#D90429] text-white border-2 border-black shadow-[2px_2px_0_0_#000] cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000000] flex items-center gap-3">
        <Search className="w-5 h-5 text-black stroke-[2.5]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search XP history by gamerTag, game, or admin email..."
          className="w-full bg-transparent outline-none font-bold text-xs uppercase text-black placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-mono font-bold text-xs">Loading XP history...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center font-bold text-sm text-slate-600 uppercase">
            No XP transaction history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-4 border-black text-xs font-black uppercase">
                  <th className="p-3 border-r-2 border-black">Participant GamerTag</th>
                  <th className="p-3 border-r-2 border-black">Game Name</th>
                  <th className="p-3 border-r-2 border-black">Result / Note</th>
                  <th className="p-3 border-r-2 border-black font-mono">XP Amount</th>
                  <th className="p-3 border-r-2 border-black">Performed By Admin</th>
                  <th className="p-3">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFF9E6] transition-colors">
                    <td className="p-3 border-r-2 border-black font-black uppercase">@{item.userGamerTag}</td>
                    <td className="p-3 border-r-2 border-black uppercase">{item.game}</td>
                    <td className="p-3 border-r-2 border-black font-mono">{item.result}</td>
                    <td
                      className={`p-3 border-r-2 border-black font-mono font-black text-sm ${
                        item.amount >= 0 ? 'text-[#D90429]' : 'text-rose-700'
                      }`}
                    >
                      {item.amount >= 0 ? `+${item.amount}` : item.amount} XP
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-700">{item.performedBy}</td>
                    <td className="p-3 font-mono text-slate-600">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
