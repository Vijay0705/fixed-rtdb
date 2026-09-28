import React, { useState } from 'react';
import { User, GameResult } from '../types';
import { calculateRankTier } from '../data/games';
import { Users, Search, Trophy, Zap, X, Gamepad2, CheckCircle, XCircle } from 'lucide-react';

interface AdminPlayerManagementProps {
  students: User[];
  onRefresh: () => void;
}

export const AdminPlayerManagement: React.FC<AdminPlayerManagementProps> = ({ students, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentHistory, setStudentHistory] = useState<GameResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleInspectStudent = (student: User) => {
    setSelectedStudent(student);
    setLoadingHistory(true);
    fetch(`/api/users/${student.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.gameResults) {
          setStudentHistory(data.gameResults);
        }
      })
      .catch((err) => console.error('Error fetching student history:', err))
      .finally(() => setLoadingHistory(false));
  };

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.gamerTag.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000]">
        <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-black">
          REGISTERED STUDENT PARTICIPANTS ({students.length})
        </h2>
        <p className="text-xs font-bold uppercase text-black/90 mt-1">
          Roster of all verified college student players enrolled in the gaming arena.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000000] flex items-center gap-3">
        <Search className="w-5 h-5 text-black stroke-[2.5]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players by name, gamerTag, email, department, or roll ID..."
          className="w-full bg-transparent outline-none font-bold text-xs uppercase text-black placeholder:text-slate-400"
        />
      </div>

      {/* Roster Table */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center font-bold text-sm text-slate-600 uppercase">
            No student participants match search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-4 border-black text-xs font-black uppercase">
                  <th className="p-3 border-r-2 border-black">Student Player</th>
                  <th className="p-3 border-r-2 border-black">Email & Roll ID</th>
                  <th className="p-3 border-r-2 border-black">Department</th>
                  <th className="p-3 border-r-2 border-black font-mono">Rank Tier</th>
                  <th className="p-3 border-r-2 border-black font-mono">Total XP</th>
                  <th className="p-3 border-r-2 border-black text-center">Played</th>
                  <th className="p-3 text-center">Wins / Losses</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {filtered.map((st) => (
                  <tr
                    key={st.id}
                    onClick={() => handleInspectStudent(st)}
                    className="hover:bg-[#FFF9E6] cursor-pointer transition-colors"
                  >
                    <td className="p-3 border-r-2 border-black">
                      <div className="flex items-center gap-2.5">
                        <img src={st.avatar} alt={st.gamerTag} className="w-8 h-8 object-cover border-2 border-black" />
                        <div>
                          <p className="font-black text-xs uppercase text-black">{st.fullName}</p>
                          <p className="text-[10px] font-black text-[#D90429] uppercase">@{st.gamerTag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-700">
                      <p>{st.email}</p>
                      <p className="text-[10px] text-slate-500">ID: {st.studentId}</p>
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono uppercase text-slate-700">{st.department}</td>
                    <td className="p-3 border-r-2 border-black font-black uppercase">{calculateRankTier(st.xp)}</td>
                    <td className="p-3 border-r-2 border-black font-mono font-black text-sm text-[#D90429]">
                      {st.xp.toLocaleString()} XP
                    </td>
                    <td className="p-3 border-r-2 border-black text-center font-mono font-black">{st.gamesPlayed}</td>
                    <td className="p-3 text-center font-mono font-black">
                      <span className="text-emerald-600">{st.wins}W</span> / <span className="text-rose-600">{st.losses}L</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT STUDENT MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-2xl w-full shadow-[8px_8px_0_0_#000] relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 bg-[#D90429] text-white border-2 border-black hover:bg-[#b00320] cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.gamerTag}
                className="w-16 h-16 object-cover border-4 border-black shadow-[2px_2px_0_0_#000]"
              />
              <div>
                <span className="px-2 py-0.5 bg-[#FFB703] text-black font-mono text-[10px] font-black uppercase border border-black">
                  {selectedStudent.department} • {selectedStudent.studentId}
                </span>
                <h3 className="text-2xl font-black uppercase italic text-black">{selectedStudent.fullName}</h3>
                <p className="text-xs font-black uppercase text-[#D90429]">GamerTag: @{selectedStudent.gamerTag}</p>
                <p className="text-xs font-mono text-slate-600">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono font-black uppercase text-xs">
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">TOTAL XP</span>
                <span className="text-lg text-[#D90429]">{selectedStudent.xp} XP</span>
              </div>
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">RANK TIER</span>
                <span className="text-lg text-black">{calculateRankTier(selectedStudent.xp)}</span>
              </div>
              <div className="p-3 bg-[#FFF9E6] border-2 border-black">
                <span className="text-[10px] text-slate-500 block">WINS / LOSSES</span>
                <span className="text-lg text-black">{selectedStudent.wins}W / {selectedStudent.losses}L</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase italic border-b-2 border-black pb-1">Official Game History</h4>
              {loadingHistory ? (
                <p className="text-xs font-mono py-4">Loading player game records...</p>
              ) : studentHistory.length === 0 ? (
                <p className="text-xs font-bold text-slate-500 py-2 uppercase">No game results logged for this student yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {studentHistory.map((item) => (
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
};
