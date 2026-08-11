import React, { useEffect, useState } from 'react';
import {
  Clock,
  Zap,
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  Eye,
  SkipForward,
  PhoneCall
} from 'lucide-react';
import { GameConfig, LifelineType, Question, Team } from '../types';
import { THEMES } from './ThemeStyles';
import { playSound } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  config: GameConfig;
  currentTeam?: Team;
  playerName?: string;
  playerScore?: number;
  onAnswer: (optionIndex: number, isDoublePoints: boolean) => void;
  onSkip: () => void;
  onUseLifeline: (type: LifelineType) => void;
  activeLifelines: Record<LifelineType, boolean>;
  onOpenCallAssistant?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  config,
  currentTeam,
  playerName = 'Jugador',
  playerScore = 0,
  onAnswer,
  onSkip,
  onUseLifeline,
  activeLifelines,
  onOpenCallAssistant,
}) => {
  const currentTheme = THEMES[config.themeStyle] || THEMES.show_tv;

  const [timeLeft, setTimeLeft] = useState<number>(config.timePerQuestion);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isDoublePoints, setIsDoublePoints] = useState(false);

  // Timer Countdown Effect
  useEffect(() => {
    setTimeLeft(config.timePerQuestion);
    setSelectedOption(null);
    setIsAnswered(false);
    setDisabledOptions([]);
    setShowHint(false);
    setIsDoublePoints(false);
  }, [question, config.timePerQuestion]);

  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          playSound.tick(config.soundEnabled);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isAnswered, config.soundEnabled]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // Timeout
    playSound.wrong(config.soundEnabled);
    setTimeout(() => {
      onAnswer(-1, isDoublePoints);
    }, 2000);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered || disabledOptions.includes(index)) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctAnswerIndex;
    if (isCorrect) {
      playSound.correct(config.soundEnabled);
    } else {
      playSound.wrong(config.soundEnabled);
    }

    setTimeout(() => {
      onAnswer(index, isDoublePoints);
    }, 2200);
  };

  // Handle 50:50 Lifeline
  const handleUse5050 = () => {
    if (!activeLifelines['5050'] || isAnswered) return;
    onUseLifeline('5050');
    playSound.lifeline(config.soundEnabled);

    const wrongIndices = [0, 1, 2, 3].filter(i => i !== question.correctAnswerIndex);
    // Randomly select 2 wrong options to disable
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setDisabledOptions(shuffled.slice(0, 2));
  };

  // Handle Hint Lifeline
  const handleUseHint = () => {
    if (!activeLifelines.pista || isAnswered) return;
    onUseLifeline('pista');
    playSound.lifeline(config.soundEnabled);
    setShowHint(true);
  };

  // Handle Double Points Lifeline
  const handleUseDouble = () => {
    if (!activeLifelines.doble || isAnswered || isDoublePoints) return;
    onUseLifeline('doble');
    playSound.lifeline(config.soundEnabled);
    setIsDoublePoints(true);
  };

  // Handle Skip Lifeline
  const handleUseSkip = () => {
    if (!activeLifelines.saltar || isAnswered) return;
    onUseLifeline('saltar');
    playSound.lifeline(config.soundEnabled);
    onSkip();
  };

  // Timer Percent & Color
  const timerPercent = (timeLeft / config.timePerQuestion) * 100;
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Turn & Score Header Bar */}
      <div className={`p-4 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} flex flex-wrap items-center justify-between gap-4 shadow-xl`}>
        {/* Active Player / Team */}
        <div className="flex items-center gap-3">
          {config.mode === 'equipos' && currentTeam ? (
            <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${currentTeam.color} text-white font-extrabold text-sm shadow-md`}>
              <span className="text-xl">{currentTeam.avatar}</span>
              <span>TURNO: {currentTeam.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700">
              <span className="text-lg">👤</span>
              <span>Jugador: {playerName}</span>
            </div>
          )}

          {isDoublePoints && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs animate-bounce shadow-md">
              ⚡ 2X PUNTOS
            </span>
          )}
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-extrabold text-slate-400">Puntuación</span>
            <div className="text-lg font-black text-amber-300">
              {config.mode === 'equipos' ? (currentTeam?.score || 0) : playerScore} pts
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700" />

          <div className="text-right">
            <span className="text-[10px] uppercase font-extrabold text-slate-400">Pregunta</span>
            <div className="text-sm font-black text-white">
              {questionNumber} / {totalQuestions}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className={`p-6 sm:p-8 rounded-3xl ${currentTheme.cardBg} ${currentTheme.cardBorder} relative shadow-2xl space-y-6`}>
        {/* Timer Bar & Category Badge */}
        <div className="flex items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold capitalize">
            {question.category} • {question.difficulty}
          </span>

          {/* Animated Countdown Ring */}
          <div className="flex items-center gap-2">
            <div className={`relative w-12 h-12 flex items-center justify-center font-black text-base rounded-full ${
              isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-amber-300'
            }`}>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isTimeCritical ? 'text-rose-500' : 'text-amber-400'}
                  strokeDasharray={`${timerPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="py-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {question.text}
          </h2>

          {/* Hint text if active */}
          {showHint && question.hint && (
            <div className="mt-4 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-start gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-yellow-300">Pista IA: </span>
                {question.hint}
              </div>
            </div>
          )}
        </div>

        {/* Lifelines Toolbar (Comodines) */}
        <div className="pt-2 pb-2 border-y border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Comodines:
          </span>

          <div className="flex items-center gap-2">
            {/* AI Call Lifeline */}
            {onOpenCallAssistant && (
              <button
                type="button"
                onClick={onOpenCallAssistant}
                disabled={isAnswered}
                className="px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400 hover:brightness-110 transition flex items-center gap-1 shadow-md animate-pulse"
                title="Llamar al Asistente IA Don Triviado por Teléfono"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-200" />
                <span>Llamar Experto IA</span>
              </button>
            )}

            {/* 50:50 */}
            <button
              type="button"
              onClick={handleUse5050}
              disabled={!activeLifelines['5050'] || isAnswered || disabledOptions.length > 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                activeLifelines['5050'] && !isAnswered && disabledOptions.length === 0
                  ? 'bg-purple-900/60 text-purple-200 border-purple-500 hover:bg-purple-800 shadow-md'
                  : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              50:50
            </button>

            {/* Hint */}
            <button
              type="button"
              onClick={handleUseHint}
              disabled={!activeLifelines.pista || isAnswered || showHint || config.difficulty === 'extremo'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                activeLifelines.pista && !isAnswered && !showHint && config.difficulty !== 'extremo'
                  ? 'bg-amber-900/60 text-amber-200 border-amber-500 hover:bg-amber-800 shadow-md'
                  : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Pista
            </button>

            {/* Double Points */}
            <button
              type="button"
              onClick={handleUseDouble}
              disabled={!activeLifelines.doble || isAnswered || isDoublePoints}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                activeLifelines.doble && !isAnswered && !isDoublePoints
                  ? 'bg-amber-500 text-slate-950 border-amber-400 hover:brightness-110 shadow-md'
                  : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> 2X Puntos
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={handleUseSkip}
              disabled={!activeLifelines.saltar || isAnswered}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                activeLifelines.saltar && !isAnswered
                  ? 'bg-cyan-900/60 text-cyan-200 border-cyan-500 hover:bg-cyan-800 shadow-md'
                  : 'bg-slate-900 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <SkipForward className="w-3.5 h-3.5" /> Saltar
            </button>
          </div>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isDisabled = disabledOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === question.correctAnswerIndex;

            let optionStyle = currentTheme.optionBase;

            if (isAnswered) {
              if (isCorrectAnswer) {
                optionStyle = currentTheme.optionCorrect;
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle = currentTheme.optionWrong;
              } else {
                optionStyle = 'opacity-40 border-slate-800 bg-slate-900/40 text-slate-500';
              }
            } else if (isDisabled) {
              optionStyle = 'opacity-25 border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed line-through';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered || isDisabled}
                className={`p-4 rounded-2xl text-left transition-all relative flex items-center gap-3.5 font-bold text-sm sm:text-base ${optionStyle}`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                  isAnswered && isCorrectAnswer
                    ? 'bg-white text-emerald-950'
                    : 'bg-slate-800/80 text-amber-300 border border-slate-700'
                }`}>
                  {letter}
                </span>

                <span className="flex-1">{option}</span>

                {isAnswered && isCorrectAnswer && (
                  <CheckCircle className="w-6 h-6 text-emerald-300 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-6 h-6 text-rose-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card when answered */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-slate-200 text-xs sm:text-sm space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>SABÍAS QUE...</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
