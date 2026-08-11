import React from 'react';
import { Palette, X, Check } from 'lucide-react';
import { ThemeStyle } from '../types';
import { THEMES } from './ThemeStyles';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentThemeStyle: ThemeStyle;
  onSelectTheme: (style: ThemeStyle) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentThemeStyle,
  onSelectTheme,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Estilo Visual y Tema</h3>
              <p className="text-xs text-slate-400">Personaliza la estética de tu concurso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(THEMES).map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onSelectTheme(theme.id);
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all space-y-2 relative overflow-hidden ${
                currentThemeStyle === theme.id
                  ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{theme.name}</span>
                {currentThemeStyle === theme.id && (
                  <Check className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
