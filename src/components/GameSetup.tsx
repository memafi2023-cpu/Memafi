import React, { useState } from 'react';
import {
  Users,
  User,
  Sparkles,
  Zap,
  Plus,
  Trash2,
  Play,
  Sliders,
  Check,
  Flame,
  ShieldAlert,
  Clock,
  HelpCircle,
  FolderPlus,
  PhoneCall,
  Bot
} from 'lucide-react';
import { Difficulty, GameConfig, GameMode, Team, ThemeStyle } from '../types';
import { PRESET_CATEGORIES } from '../data/presetQuestions';
import { THEMES } from './ThemeStyles';
import { getCustomPacks } from '../utils/storage';

interface GameSetupProps {
  config: GameConfig;
  teams: Team[];
  onUpdateConfig: (updated: Partial<GameConfig>) => void;
  onUpdateTeams: (teams: Team[]) => void;
  onStartGame: () => void;
  onOpenAiModal: () => void;
  onOpenCallAssistant?: () => void;
}

const COLOR_PRESETS = [
  { name: 'Rojo Fuego', value: 'from-rose-500 to-red-600', badge: 'bg-red-500', text: 'text-red-400' },
  { name: 'Azul Eléctrico', value: 'from-blue-500 to-indigo-600', badge: 'bg-blue-500', text: 'text-blue-400' },
  { name: 'Verde Esmeralda', value: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500', text: 'text-emerald-400' },
  { name: 'Amarillo Dorado', value: 'from-amber-400 to-yellow-500', badge: 'bg-amber-400', text: 'text-amber-400' },
  { name: 'Morado Neón', value: 'from-purple-500 to-fuchsia-600', badge: 'bg-purple-500', text: 'text-purple-400' },
  { name: 'Naranja Cítrico', value: 'from-orange-500 to-amber-600', badge: 'bg-orange-500', text: 'text-orange-400' },
  { name: 'Cian Ciber', value: 'from-cyan-400 to-blue-500', badge: 'bg-cyan-400', text: 'text-cyan-400' },
  { name: 'Rosa Fucsia', value: 'from-pink-500 to-rose-600', badge: 'bg-pink-500', text: 'text-pink-400' },
];

const AVATAR_OPTIONS = ['🦁', '🦅', '🐉', '🐺', '🦊', '🚀', '⚡', '👑', '🔥', '🎯', '💎', '🏆'];

export const GameSetup: React.FC<GameSetupProps> = ({
  config,
  teams,
  onUpdateConfig,
  onUpdateTeams,
  onStartGame,
  onOpenAiModal,
  onOpenCallAssistant,
}) => {
  const currentTheme = THEMES[config.themeStyle] || THEMES.show_tv;
  const customPacks = getCustomPacks();

  const [newTeamName, setNewTeamName] = useState('');

  // Add team
  const handleAddTeam = () => {
    if (teams.length >= 6) return;
    const teamNum = teams.length + 1;
    const colorPreset = COLOR_PRESETS[teams.length % COLOR_PRESETS.length];
    const newTeam: Team = {
      id: `team_${Date.now()}_${teamNum}`,
      name: newTeamName.trim() || `Equipo ${teamNum}`,
      color: colorPreset.value,
      avatar: AVATAR_OPTIONS[(teams.length * 2) % AVATAR_OPTIONS.length],
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      lifelines: { '5050': true, pista: true, doble: true, saltar: true },
    };
    onUpdateTeams([...teams, newTeam]);
    setNewTeamName('');
  };

  // Remove team
  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 2) return; // Keep at least 2 teams for team mode
    onUpdateTeams(teams.filter(t => t.id !== id));
  };

  // Update team properties
  const handleUpdateTeamProp = (id: string, key: keyof Team, value: any) => {
    onUpdateTeams(
      teams.map(t => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl ${currentTheme.cardBg} ${currentTheme.cardBorder} relative overflow-hidden text-center`}>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Configuración de Partida
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Preparado para el Desafío de Trivia?
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Elige entre modo individual o por equipos, selecciona tu nivel de dificultad y juega con temas predeterminados o genera tus propios temas con IA.
          </p>
        </div>
      </div>

      {/* AI Voice Call Assistant Highlight Banner */}
      {onOpenCallAssistant && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Asistente Telefónico IA "Don Triviado"</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                  EN VIVO POR VOZ
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Llama en tiempo real a nuestro presentador virtual para pedir consejos de juego, explicaciones habladas o ayuda por teléfono.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCallAssistant}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Llamar Presentador IA</span>
          </button>
        </div>
      )}

      {/* 1. MODO DE JUEGO */}
      <div className={`p-6 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            1. Modo de Juego
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Individual Mode */}
          <button
            type="button"
            onClick={() => onUpdateConfig({ mode: 'individual' })}
            className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              config.mode === 'individual'
                ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className={`p-3 rounded-xl ${config.mode === 'individual' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                Modo Individual
                {config.mode === 'individual' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-400">
                Ponte a prueba en solitario. Acumula puntos, rompe tu propio récord y escala en el ranking.
              </p>
            </div>
          </button>

          {/* Team Mode */}
          <button
            type="button"
            onClick={() => onUpdateConfig({ mode: 'equipos' })}
            className={`p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              config.mode === 'equipos'
                ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className={`p-3 rounded-xl ${config.mode === 'equipos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                Modo por Equipos
                {config.mode === 'equipos' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-400">
                Competencia grupal por turnos. Crea de 2 a 6 equipos con nombres, colores y avatares personalizados.
              </p>
            </div>
          </button>
        </div>

        {/* Team Customizer if Team Mode Selected */}
        {config.mode === 'equipos' && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Configurar Equipos Participantes ({teams.length}/6)
              </span>
              <button
                type="button"
                onClick={handleAddTeam}
                disabled={teams.length >= 6}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Equipo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teams.map((team, index) => (
                <div key={team.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl">{team.avatar}</span>
                    <input
                      type="text"
                      value={team.name}
                      onChange={e => handleUpdateTeamProp(team.id, 'name', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold w-full focus:outline-none focus:border-amber-400"
                      placeholder={`Equipo ${index + 1}`}
                    />
                    {teams.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeam(team.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition"
                        title="Eliminar Equipo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Colors & Avatar Selector */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      {COLOR_PRESETS.slice(0, 5).map((cp) => (
                        <button
                          key={cp.name}
                          type="button"
                          onClick={() => handleUpdateTeamProp(team.id, 'color', cp.value)}
                          className={`w-5 h-5 rounded-full ${cp.badge} transition-transform ${
                            team.color === cp.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Avatar quick picker */}
                    <select
                      value={team.avatar}
                      onChange={e => handleUpdateTeamProp(team.id, 'avatar', e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs rounded px-1.5 py-0.5 text-white"
                    >
                      {AVATAR_OPTIONS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. NIVEL DE DIFICULTAD */}
      <div className={`p-6 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} space-y-4`}>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          2. Nivel de Dificultad
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'facil',
              title: 'Fácil',
              time: '25 segundos',
              desc: 'Ideal para principiantes y relajarse (+100 pts). Pistas ilimitadas.',
              color: 'emerald',
            },
            {
              id: 'medio',
              title: 'Medio',
              time: '15 segundos',
              desc: 'Equilibrio perfecto (+150 pts). Desafío estándar de concurso.',
              color: 'blue',
            },
            {
              id: 'dificil',
              title: 'Difícil',
              time: '10 segundos',
              desc: 'Reloj rápido (+200 pts). Penalización de -50 pts por error.',
              color: 'orange',
            },
            {
              id: 'extremo',
              title: 'Extremo',
              time: '7 segundos',
              desc: 'Modo experto (+300 pts). -100 pts por error y sin pistas.',
              color: 'rose',
            },
          ].map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() =>
                onUpdateConfig({
                  difficulty: diff.id as Difficulty,
                  timePerQuestion: diff.id === 'facil' ? 25 : diff.id === 'medio' ? 15 : diff.id === 'dificil' ? 10 : 7,
                })
              }
              className={`p-4 rounded-xl border-2 text-left transition-all space-y-2 relative ${
                config.difficulty === diff.id
                  ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white">{diff.title}</span>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {diff.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{diff.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. TEMA / CATEGORÍA & CREADOR IA */}
      <div className={`p-6 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            3. Tema y Categoría de Preguntas
          </h3>

          <button
            type="button"
            onClick={onOpenAiModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-purple-600/30 transition animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Crear Tema Personalizado con IA
          </button>
        </div>

        {/* Custom Packs List if any exist */}
        {customPacks.length > 0 && (
          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5" /> Paquetes de IA Guardados:
            </span>
            <div className="flex flex-wrap gap-2">
              {customPacks.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      categoryId: 'custom',
                      customTopicName: p.topic,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    config.categoryId === 'custom' && config.customTopicName === p.topic
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-800 text-purple-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  ✨ {p.topic} ({p.questions.length} preguntas)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preset Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onUpdateConfig({ categoryId: 'todas', categoryName: 'Todas las Categorías', customTopicName: undefined })}
            className={`p-3 rounded-xl border text-left transition ${
              config.categoryId === 'todas'
                ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-extrabold text-amber-300">🎲 Variado Mix</div>
            <div className="text-[11px] text-slate-400 mt-1">Preguntas aleatorias de todos los temas.</div>
          </button>

          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onUpdateConfig({ categoryId: cat.id, categoryName: cat.name, customTopicName: undefined })}
              className={`p-3 rounded-xl border text-left transition ${
                config.categoryId === cat.id
                  ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-extrabold text-amber-300">{cat.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. PREGUNTAS TOTALES & BOTÓN JUGAR */}
      <div className={`p-6 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} flex flex-col sm:flex-row items-center justify-between gap-6`}>
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cantidad de Preguntas
          </span>
          <div className="flex items-center gap-2 mt-1">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdateConfig({ totalQuestions: num })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  config.totalQuestions === num
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {num} Preguntas
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={onStartGame}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl ${currentTheme.buttonPrimary} text-lg font-black flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95`}
        >
          <Play className="w-6 h-6 fill-current" />
          ¡INICIAR PARTIDA!
        </button>
      </div>
    </div>
  );
};
