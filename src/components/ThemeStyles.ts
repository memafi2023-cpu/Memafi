import { ThemeStyle } from '../types';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  buttonPrimary: string;
  optionBase: string;
  optionHover: string;
  optionCorrect: string;
  optionWrong: string;
}

export const THEMES: Record<ThemeStyle, ThemeConfig> = {
  show_tv: {
    id: 'show_tv',
    name: 'Show de TV',
    description: 'Estilo programa de concurso con matices dorados y violetas radiantes.',
    bgGradient: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-100',
    cardBg: 'bg-slate-900/90 backdrop-blur-md',
    cardBorder: 'border-2 border-amber-500/30 shadow-xl shadow-purple-950/50',
    textPrimary: 'text-amber-100',
    textSecondary: 'text-amber-200/70',
    accent: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold',
    buttonPrimary: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/25 hover:brightness-110',
    optionBase: 'bg-slate-800/80 border-2 border-purple-500/30 text-slate-100 hover:border-amber-400/80 hover:bg-slate-800',
    optionHover: 'border-amber-400 bg-purple-900/40 shadow-lg shadow-amber-500/10',
    optionCorrect: 'bg-emerald-600/90 border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 animate-pulse',
    optionWrong: 'bg-rose-900/90 border-2 border-rose-500 text-white shadow-lg shadow-rose-500/20',
  },
  cyber_neon: {
    id: 'cyber_neon',
    name: 'Neón Cyber',
    description: 'Estilo arcade ciberpunk con contraste neón cian, magenta y amarillo.',
    bgGradient: 'bg-slate-950 text-cyan-100',
    cardBg: 'bg-slate-900/95 backdrop-blur-md',
    cardBorder: 'border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20',
    textPrimary: 'text-cyan-300',
    textSecondary: 'text-slate-400',
    accent: 'bg-cyan-500 text-slate-950 font-extrabold',
    buttonPrimary: 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50',
    optionBase: 'bg-slate-900 border-2 border-cyan-800/60 text-slate-200 hover:border-cyan-400 hover:shadow-cyan-500/20',
    optionHover: 'border-cyan-400 bg-cyan-950/60 text-cyan-200',
    optionCorrect: 'bg-emerald-950 border-2 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/40',
    optionWrong: 'bg-fuchsia-950 border-2 border-fuchsia-500 text-fuchsia-200 shadow-lg shadow-fuchsia-500/40',
  },
  warm_studio: {
    id: 'warm_studio',
    name: 'Estudio Cálido',
    description: 'Diseño moderno, limpio y profesional con tonos arena e índigo.',
    bgGradient: 'bg-slate-900 text-slate-100',
    cardBg: 'bg-slate-800/90 backdrop-blur-md',
    cardBorder: 'border border-slate-700 shadow-lg',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    accent: 'bg-indigo-500 text-white font-semibold',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30',
    optionBase: 'bg-slate-700/60 border border-slate-600 text-slate-100 hover:border-indigo-400 hover:bg-slate-700',
    optionHover: 'border-indigo-400 bg-slate-700 text-white',
    optionCorrect: 'bg-emerald-600 border border-emerald-400 text-white shadow-md shadow-emerald-600/20',
    optionWrong: 'bg-rose-600 border border-rose-400 text-white shadow-md shadow-rose-600/20',
  },
  retro_arcade: {
    id: 'retro_arcade',
    name: 'Retro Arcade',
    description: 'Vibra ochentera con bordes pixelados y colores primarios vibrantes.',
    bgGradient: 'bg-neutral-950 text-yellow-300',
    cardBg: 'bg-neutral-900',
    cardBorder: 'border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]',
    textPrimary: 'text-yellow-300 font-black',
    textSecondary: 'text-neutral-300',
    accent: 'bg-yellow-400 text-black font-black',
    buttonPrimary: 'bg-yellow-400 text-black font-black border-2 border-black hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1',
    optionBase: 'bg-neutral-800 border-2 border-neutral-600 text-white font-bold hover:border-yellow-400',
    optionHover: 'border-yellow-400 bg-neutral-800 text-yellow-300',
    optionCorrect: 'bg-green-600 border-2 border-white text-white font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
    optionWrong: 'bg-red-600 border-2 border-white text-white font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
  },
};
