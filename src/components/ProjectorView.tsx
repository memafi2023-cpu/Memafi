import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Medal, Crown, Sparkles, Tv, ArrowLeft, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { GameConfig, Player, Team } from '../types';

interface ProjectorViewProps {
  config: GameConfig;
  teams: Team[];
  players?: Player[];
  isGameOver?: boolean;
  onClose: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

export const ProjectorView: React.FC<ProjectorViewProps> = ({
  config,
  teams,
  players = [],
  isGameOver = false,
  onClose,
  onRestart,
  onToggleSound,
}) => {
  // Extract ranking items
  const leaderboardItems = config.mode === 'equipos'
    ? teams.map(t => ({ id: t.id, name: t.name, score: t.score, avatar: t.avatar, color: t.color, correct: t.correctCount, wrong: t.wrongCount }))
    : players.map(p => ({ id: p.id, name: p.name, score: p.score, avatar: p.avatar, color: 'from-blue-500 to-indigo-600', correct: p.correctCount, wrong: p.wrongCount }));

  const sortedItems = [...leaderboardItems].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sortedItems.map(i => i.score), 100);

  // Trigger confetti when game over or podium opened
  useEffect(() => {
    if (isGameOver || sortedItems.length > 0) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
        });
      } catch {
        // Ignore fallback
      }
    }
  }, [isGameOver]);

  const firstPlace = sortedItems[0];
  const secondPlace = sortedItems[1];
  const thirdPlace = sortedItems[2];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto select-none">
      {/* Background Glitz */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              Pantalla de Proyección TV
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isGameOver ? '🏆 ¡GRAN FINAL & PODIO!' : '📊 LEADERBOARD EN VIVO'}
            </h2>
          </div>
        </div>

        {/* Presenter Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
            title="Alternar Sonido"
          >
            {config.soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          <button
            onClick={onRestart}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition flex items-center gap-2"
            title="Reiniciar Partida"
          >
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <span className="hidden sm:inline text-xs font-bold">Reiniciar</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Juego</span>
          </button>
        </div>
      </div>

      {/* Center Stage: Winner Podium */}
      <div className="relative z-10 my-8 space-y-12 max-w-6xl mx-auto w-full">
        {sortedItems.length > 0 && (
          <div className="flex items-end justify-center gap-4 sm:gap-8 pt-8 px-4">
            {/* 2nd Place */}
            {secondPlace ? (
              <div className="flex flex-col items-center w-1/3 max-w-[200px] animate-fadeIn">
                <div className="text-center space-y-1 mb-2">
                  <div className="text-3xl">{secondPlace.avatar}</div>
                  <span className="font-black text-xs sm:text-sm text-slate-300 truncate block">
                    {secondPlace.name}
                  </span>
                  <span className="font-extrabold text-slate-400 text-sm">
                    {secondPlace.score} pts
                  </span>
                </div>
                <div className="w-full h-36 sm:h-48 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl border-t-4 border-slate-400 flex flex-col items-center justify-center p-3 shadow-2xl">
                  <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mb-1" />
                  <span className="text-2xl sm:text-4xl font-black text-slate-200">2º</span>
                </div>
              </div>
            ) : <div className="w-1/3 max-w-[200px]" />}

            {/* 1st Place - Champion */}
            {firstPlace && (
              <div className="flex flex-col items-center w-1/3 max-w-[240px] -mt-8 animate-bounce-short">
                <div className="text-center space-y-1 mb-2">
                  <Crown className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                  <div className="text-4xl">{firstPlace.avatar}</div>
                  <span className="font-black text-sm sm:text-base text-amber-300 truncate block">
                    {firstPlace.name}
                  </span>
                  <span className="font-black text-amber-400 text-lg sm:text-xl">
                    {firstPlace.score} pts
                  </span>
                </div>
                <div className="w-full h-48 sm:h-64 bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-3xl border-t-4 border-yellow-200 flex flex-col items-center justify-center p-4 shadow-2xl shadow-amber-500/30 text-slate-950">
                  <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-slate-950 mb-1" />
                  <span className="text-3xl sm:text-5xl font-black tracking-tight">1º</span>
                  <span className="text-[10px] font-black uppercase tracking-wider mt-1 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                    CAMPEÓN
                  </span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {thirdPlace ? (
              <div className="flex flex-col items-center w-1/3 max-w-[200px] animate-fadeIn">
                <div className="text-center space-y-1 mb-2">
                  <div className="text-3xl">{thirdPlace.avatar}</div>
                  <span className="font-black text-xs sm:text-sm text-amber-600 truncate block">
                    {thirdPlace.name}
                  </span>
                  <span className="font-extrabold text-slate-400 text-sm">
                    {thirdPlace.score} pts
                  </span>
                </div>
                <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-3xl border-t-4 border-amber-600 flex flex-col items-center justify-center p-3 shadow-2xl">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 mb-1" />
                  <span className="text-xl sm:text-3xl font-black text-amber-300">3º</span>
                </div>
              </div>
            ) : <div className="w-1/3 max-w-[200px]" />}
          </div>
        )}

        {/* Live Animated Progress Bars for all Teams/Players */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Clasificación General
          </h3>

          <div className="space-y-3">
            {sortedItems.map((item, idx) => {
              const barPercent = Math.max((item.score / maxScore) * 100, 5);

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-white">
                      <span className="w-5 text-center font-black text-amber-400">#{idx + 1}</span>
                      <span className="text-base">{item.avatar}</span>
                      <span className="text-sm font-extrabold">{item.name}</span>
                    </div>
                    <div className="text-amber-300 font-black text-sm">
                      {item.score} pts
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 shadow-md`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center text-xs text-slate-500 font-medium border-t border-slate-800/80 pt-4">
        TRIVIA STUDIO • Pantalla de Proyección & Presentación para Eventos y Reuniones
      </div>
    </div>
  );
};
