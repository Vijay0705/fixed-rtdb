import React, { useState, useEffect } from 'react';
import { AuditLogEntry } from '../types';
import { ShieldCheck, Search, RefreshCw } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('hero_rank_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.auditLogs) {
        setLogs(data.auditLogs);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-[#FFB703] border-4 border-black p-6 shadow-[6px_6px_0_0_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-black">
            ADMIN SECURITY & AUDIT TRAIL
          </h2>
          <p className="text-xs font-bold uppercase text-black/90 mt-1">
            Official immutable log of all admin operations, point entries, result voids, and auth actions.
          </p>
        </div>
        <button
          onClick={fetchAuditLogs}
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
          placeholder="Search audit logs by action, admin email, or detail..."
          className="w-full bg-transparent outline-none font-bold text-xs uppercase text-black placeholder:text-slate-400"
        />
      </div>

      <div className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-mono font-bold text-xs">Loading admin audit logs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center font-bold text-sm text-slate-600 uppercase">
            No audit records found matching search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-4 border-black text-xs font-black uppercase">
                  <th className="p-3 border-r-2 border-black">Action Type</th>
                  <th className="p-3 border-r-2 border-black">Admin Officer</th>
                  <th className="p-3 border-r-2 border-black">Audit Details</th>
                  <th className="p-3 border-r-2 border-black font-mono">IP Address</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-bold">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFF9E6] transition-colors">
                    <td className="p-3 border-r-2 border-black">
                      <span className="px-2 py-0.5 bg-[#FFB703] text-black border border-black font-black text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-800">{log.performedBy}</td>
                    <td className="p-3 border-r-2 border-black text-black">{log.details}</td>
                    <td className="p-3 border-r-2 border-black font-mono text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3 font-mono text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
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
