import React from 'react';
import { Volume2, VolumeX, Tv, History, Sparkles, Award, Palette, PhoneCall } from 'lucide-react';
import { GameConfig, GameState } from '../types';
import { THEMES } from './ThemeStyles';

interface HeaderProps {
  config: GameConfig;
  gameState: GameState;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenAiModal: () => void;
  onOpenProjector: () => void;
  onOpenThemeSelector: () => void;
  onOpenCallAssistant: () => void;
  onResetToSetup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  gameState,
  onToggleSound,
  onOpenHistory,
  onOpenAiModal,
  onOpenProjector,
  onOpenThemeSelector,
  onOpenCallAssistant,
  onResetToSetup,
}) => {
  const currentTheme = THEMES[config.themeStyle] || THEMES.show_tv;

  return (
    <header className={`w-full ${currentTheme.cardBg} border-b border-slate-800 px-4 py-3 sm:px-6 shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Title / Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onResetToSetup}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-500 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-indigo-300 bg-clip-text text-transparent">
              TRIVIA STUDIO
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Quiz Master & Team Challenge
            </p>
          </div>
        </div>

        {/* Current Game Badges (If playing or reveal) */}
        {gameState !== 'setup' && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs text-slate-300">
            <span className="font-semibold text-amber-400 uppercase tracking-wider">
              {config.mode === 'equipos' ? 'Equipos' : 'Individual'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="capitalize">{config.difficulty}</span>
            <span className="text-slate-600">•</span>
            <span className="truncate max-w-[120px] sm:max-w-[180px] text-indigo-300 font-medium">
              {config.customTopicName || config.categoryName}
            </span>
          </div>
        )}

        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-2">
          {/* AI Call Assistant Hotline Button */}
          <button
            onClick={onOpenCallAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xs font-black hover:brightness-110 shadow-md shadow-emerald-600/30 transition relative overflow-hidden group"
            title="Llamada al Presentador de IA Don Triviado"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="hidden sm:inline">Llamar Asistente IA</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:brightness-110 shadow-md shadow-purple-600/25 transition"
            title="Crear trivia personalizada con IA"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden md:inline">Generar con IA</span>
          </button>

          {/* Projector / TV View Mode */}
          <button
            onClick={onOpenProjector}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="Pantalla de Proyección TV"
          >
            <Tv className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline text-xs">Modo TV</span>
          </button>

          {/* Theme Picker */}
          <button
            onClick={onOpenThemeSelector}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition"
            title="Cambiar estilo de diseño"
          >
            <Palette className="w-4 h-4 text-pink-400" />
          </button>

          {/* History / Hall of Fame */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition"
            title="Historial y Salón de la Fama"
          >
            <Award className="w-4 h-4 text-amber-400" />
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs transition ${
              config.soundEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={config.soundEnabled ? 'Sonido Activado' : 'Sonido Silenciado'}
          >
            {config.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
