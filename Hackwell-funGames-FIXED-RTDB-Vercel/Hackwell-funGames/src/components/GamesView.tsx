import React from 'react';
import { EVENT_GAMES } from '../data/games';
import { Gamepad2, Shield, Zap, CheckCircle2 } from 'lucide-react';

export const GamesView: React.FC = () => {
  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#FFB703] border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_0_#000000] rotate-[-0.5deg]">
        <div className="flex items-center gap-3 mb-2">
          <Gamepad2 className="w-8 h-8 text-black stroke-[3]" />
          <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-black">
            OFFICIAL EVENT GAMES & XP RULES
          </h1>
        </div>
        <p className="text-xs sm:text-sm font-bold uppercase text-black/90 max-w-3xl">
          The College Gaming Arena features 8 official games. XP points are awarded strictly according to official game results logged by event referees and admins.
        </p>
      </div>

      {/* Grid of the 8 Official Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENT_GAMES.map((game, index) => (
          <div
            key={game.id}
            className="bg-white border-4 border-black shadow-[6px_6px_0_0_#000000] flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Banner Header */}
              <div className="relative h-36 border-b-4 border-black overflow-hidden bg-slate-900">
                <img
                  src={game.banner}
                  alt={game.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FFB703] border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0_0_#000] text-black">
                  Game #{index + 1} • {game.category}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#D90429] text-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0_0_#000]">
                  {game.winXpText}
                </div>
              </div>

              {/* Game Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-black">{game.name}</h3>
                  <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">{game.description}</p>
                </div>

                {/* Rules List */}
                <div className="bg-[#FFF9E6] border-2 border-black p-3 space-y-1.5">
                  <p className="text-[10px] font-black uppercase text-black flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#D90429]" />
                    Official Event Rules:
                  </p>
                  <ul className="space-y-1 pl-1">
                    {game.rules.map((rule, idx) => (
                      <li key={idx} className="text-[11px] font-bold text-slate-800 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* XP Award Footer Banner */}
            <div className="bg-black text-white px-5 py-3 border-t-4 border-black flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">XP Scoring System</span>
              <span className="text-xs font-mono font-black text-[#FFB703] uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FFB703]" />
                {game.xpRule}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
