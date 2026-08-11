import React, { useState } from 'react';
import { GameConfig, GameState, Player, Question, Team, ThemeStyle } from './types';
import { Header } from './components/Header';
import { GameSetup } from './components/GameSetup';
import { QuestionCard } from './components/QuestionCard';
import { ProjectorView } from './components/ProjectorView';
import { AiTriviaModal } from './components/AiTriviaModal';
import { MatchHistoryModal } from './components/MatchHistoryModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AiCallAssistantModal } from './components/AiCallAssistantModal';
import { THEMES } from './components/ThemeStyles';
import { getFilteredQuestions } from './data/presetQuestions';
import { saveMatchHistory } from './utils/storage';
import { playSound } from './utils/audio';
import { Trophy, RefreshCw, Award, ArrowRight, Sparkles, Flame, Tv } from 'lucide-react';

const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team_1',
    name: 'Equipo Rojo',
    color: 'from-rose-500 to-red-600',
    avatar: '🦁',
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    lifelines: { '5050': true, pista: true, doble: true, saltar: true },
  },
  {
    id: 'team_2',
    name: 'Equipo Azul',
    color: 'from-blue-500 to-indigo-600',
    avatar: '🦅',
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    lifelines: { '5050': true, pista: true, doble: true, saltar: true },
  },
];

export default function App() {
  // Game Configuration State
  const [config, setConfig] = useState<GameConfig>({
    mode: 'equipos',
    difficulty: 'medio',
    timePerQuestion: 15,
    totalQuestions: 10,
    categoryId: 'todas',
    categoryName: 'Todas las Categorías',
    themeStyle: 'show_tv',
    soundEnabled: true,
    autoAdvance: true,
  });

  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [playerName, setPlayerName] = useState<string>('Jugador 1');
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [playerStats, setPlayerStats] = useState({ correct: 0, wrong: 0 });

  // Match State
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentTeamTurnIndex, setCurrentTeamTurnIndex] = useState<number>(0);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [isCallAssistantOpen, setIsCallAssistantOpen] = useState(false);
  const [callType, setCallType] = useState<'hotline' | 'lifeline'>('hotline');

  const openCallAssistant = (type: 'hotline' | 'lifeline' = 'hotline') => {
    setCallType(type);
    setIsCallAssistantOpen(true);
  };

  // Update Config
  const handleUpdateConfig = (updated: Partial<GameConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
  };

  // Start Game
  const handleStartGame = (customQuestions?: Question[]) => {
    let qList: Question[] = [];

    if (customQuestions && customQuestions.length > 0) {
      qList = customQuestions;
    } else {
      qList = getFilteredQuestions(
        config.categoryId,
        config.difficulty,
        config.totalQuestions
      );
    }

    if (qList.length === 0) {
      alert('No se encontraron preguntas para esta selección. Prueba con otra categoría.');
      return;
    }

    // Reset teams state
    const resetTeamsList = teams.map(t => ({
      ...t,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      lifelines: { '5050': true, pista: true, doble: true, saltar: true },
    }));

    setTeams(resetTeamsList);
    setPlayerScore(0);
    setPlayerStats({ correct: 0, wrong: 0 });
    setQuestions(qList);
    setCurrentQuestionIndex(0);
    setCurrentTeamTurnIndex(0);
    setGameState('playing');
  };

  // Handle Answer
  const handleAnswer = (optionIndex: number, isDoublePoints: boolean) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const isCorrect = optionIndex === currentQ.correctAnswerIndex;

    // Calculate score points
    let basePoints = 100;
    if (config.difficulty === 'medio') basePoints = 150;
    if (config.difficulty === 'dificil') basePoints = 200;
    if (config.difficulty === 'extremo') basePoints = 300;

    if (isDoublePoints) basePoints *= 2;

    let pointsDelta = isCorrect ? basePoints : 0;

    // Deduct penalty on hard/extreme wrong answers
    if (!isCorrect && optionIndex !== -1) {
      if (config.difficulty === 'dificil') pointsDelta = -50;
      if (config.difficulty === 'extremo') pointsDelta = -100;
    }

    // Update Team or Player
    if (config.mode === 'equipos' && teams.length > 0) {
      setTeams(prevTeams =>
        prevTeams.map((t, idx) => {
          if (idx === currentTeamTurnIndex) {
            return {
              ...t,
              score: Math.max(t.score + pointsDelta, 0),
              correctCount: t.correctCount + (isCorrect ? 1 : 0),
              wrongCount: t.wrongCount + (isCorrect ? 0 : 1),
            };
          }
          return t;
        })
      );
    } else {
      setPlayerScore(prev => Math.max(prev + pointsDelta, 0));
      setPlayerStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1),
      }));
    }

    // Advance turn or question
    const nextQIdx = currentQuestionIndex + 1;
    const nextTeamIdx = (currentTeamTurnIndex + 1) % (teams.length || 1);

    if (nextQIdx >= questions.length) {
      // Game Complete!
      setTimeout(() => {
        finishGame();
      }, 500);
    } else {
      setCurrentQuestionIndex(nextQIdx);
      setCurrentTeamTurnIndex(nextTeamIdx);
    }
  };

  // Handle Skip
  const handleSkip = () => {
    const nextQIdx = currentQuestionIndex + 1;
    const nextTeamIdx = (currentTeamTurnIndex + 1) % (teams.length || 1);

    if (nextQIdx >= questions.length) {
      finishGame();
    } else {
      setCurrentQuestionIndex(nextQIdx);
      setCurrentTeamTurnIndex(nextTeamIdx);
    }
  };

  // Use Lifeline
  const handleUseLifeline = (type: keyof Team['lifelines']) => {
    if (config.mode === 'equipos') {
      setTeams(prev =>
        prev.map((t, idx) => {
          if (idx === currentTeamTurnIndex) {
            return {
              ...t,
              lifelines: { ...t.lifelines, [type]: false },
            };
          }
          return t;
        })
      );
    }
  };

  // Finish Game & Record History
  const finishGame = () => {
    setGameState('game_over');
    playSound.victory(config.soundEnabled);

    let winnerName = 'Jugador';
    let scoresSummary: Array<{ name: string; score: number }> = [];

    if (config.mode === 'equipos') {
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      winnerName = sorted[0]?.name || 'Equipo';
      scoresSummary = sorted.map(t => ({ name: t.name, score: t.score }));
    } else {
      winnerName = playerName;
      scoresSummary = [{ name: playerName, score: playerScore }];
    }

    saveMatchHistory({
      mode: config.mode,
      difficulty: config.difficulty,
      categoryOrTopic: config.customTopicName || config.categoryName,
      winnerName,
      scores: scoresSummary,
    });
  };

  const currentTheme = THEMES[config.themeStyle] || THEMES.show_tv;
  const currentQ = questions[currentQuestionIndex];
  const currentTeam = teams[currentTeamTurnIndex];

  return (
    <div className={`min-h-screen ${currentTheme.bgGradient} flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 transition-colors duration-300`}>
      {/* Header Navigation */}
      <Header
        config={config}
        gameState={gameState}
        onToggleSound={() => handleUpdateConfig({ soundEnabled: !config.soundEnabled })}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenProjector={() => setIsProjectorOpen(true)}
        onOpenThemeSelector={() => setIsThemeModalOpen(true)}
        onOpenCallAssistant={() => openCallAssistant('hotline')}
        onResetToSetup={() => setGameState('setup')}
      />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* SETUP SCREEN */}
        {gameState === 'setup' && (
          <GameSetup
            config={config}
            teams={teams}
            onUpdateConfig={handleUpdateConfig}
            onUpdateTeams={setTeams}
            onStartGame={() => handleStartGame()}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onOpenCallAssistant={() => openCallAssistant('hotline')}
          />
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && currentQ && (
          <QuestionCard
            question={currentQ}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            config={config}
            currentTeam={currentTeam}
            playerName={playerName}
            playerScore={playerScore}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onUseLifeline={handleUseLifeline}
            onOpenCallAssistant={() => openCallAssistant('lifeline')}
            activeLifelines={
              config.mode === 'equipos' && currentTeam
                ? currentTeam.lifelines
                : { '5050': true, pista: true, doble: true, saltar: true }
            }
          />
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'game_over' && (
          <div className="w-full max-w-2xl mx-auto text-center space-y-6 py-8">
            <div className={`p-8 rounded-3xl ${currentTheme.cardBg} ${currentTheme.cardBorder} space-y-6 shadow-2xl`}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  ¡PARTIDA FINALIZADA!
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  {config.mode === 'equipos'
                    ? `¡Felicidades, ${[...teams].sort((a, b) => b.score - a.score)[0]?.name}!`
                    : `¡Gran Trabajo, ${playerName}!`}
                </h2>
              </div>

              {/* Final Scores Breakdown */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Puntuaciones Finales
                </h3>

                <div className="space-y-2">
                  {(config.mode === 'equipos' ? [...teams].sort((a, b) => b.score - a.score) : [{ name: playerName, score: playerScore, correctCount: playerStats.correct, wrongCount: playerStats.wrong, avatar: '👤' }]).map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl flex items-center justify-between border ${
                        idx === 0
                          ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-black text-amber-400 text-base">#{idx + 1}</span>
                        <span className="text-xl">{item.avatar}</span>
                        <span className="font-bold">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-amber-300">{item.score} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsProjectorOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                >
                  <Tv className="w-4 h-4 text-cyan-400" />
                  Ver Podio en Modo TV
                </button>

                <button
                  onClick={() => handleStartGame()}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl ${currentTheme.buttonPrimary} text-sm font-black flex items-center justify-center gap-2 transition`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <AiTriviaModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onTriviaGenerated={(topic, generatedQuestions) => {
          handleUpdateConfig({
            categoryId: 'custom',
            customTopicName: topic,
          });
          handleStartGame(generatedQuestions);
        }}
      />

      <MatchHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectSavedPack={(pack) => {
          handleUpdateConfig({
            categoryId: 'custom',
            customTopicName: pack.topic,
            difficulty: pack.difficulty,
            totalQuestions: pack.questionCount,
          });
          handleStartGame(pack.questions);
        }}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentThemeStyle={config.themeStyle}
        onSelectTheme={(style) => handleUpdateConfig({ themeStyle: style })}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <AiCallAssistantModal
        isOpen={isCallAssistantOpen}
        onClose={() => setIsCallAssistantOpen(false)}
        currentQuestion={currentQ}
        callType={callType}
        soundEnabled={config.soundEnabled}
      />

      {isProjectorOpen && (
        <ProjectorView
          config={config}
          teams={teams}
          players={[{ id: 'p1', name: playerName, avatar: '👤', score: playerScore, correctCount: playerStats.correct, wrongCount: playerStats.wrong }]}
          isGameOver={gameState === 'game_over'}
          onClose={() => setIsProjectorOpen(false)}
          onRestart={() => handleStartGame()}
          onToggleSound={() => handleUpdateConfig({ soundEnabled: !config.soundEnabled })}
        />
      )}
    </div>
  );
}
