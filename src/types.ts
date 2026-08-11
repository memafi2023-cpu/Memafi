export type GameMode = 'individual' | 'equipos';

export type Difficulty = 'facil' | 'medio' | 'dificil' | 'extremo';

export type ThemeStyle = 'show_tv' | 'cyber_neon' | 'warm_studio' | 'retro_arcade';

export type LifelineType = '5050' | 'pista' | 'doble' | 'saltar';

export type GameState = 'setup' | 'playing' | 'game_over';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
  category: string;
  difficulty: Difficulty;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  color: string; // Tailwind color or hex
  avatar: string; // Icon or emoji
  score: number;
  correctCount: number;
  wrongCount: number;
  lifelines: Record<LifelineType, boolean>; // true = available, false = used
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  correctCount: number;
  wrongCount: number;
}

export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  timePerQuestion: number; // in seconds
  totalQuestions: number;
  categoryId: string;
  categoryName: string;
  customTopicName?: string;
  themeStyle: ThemeStyle;
  soundEnabled: boolean;
  autoAdvance: boolean;
}

export interface CustomTriviaPack {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  questionCount: number;
  difficulty: Difficulty;
  questions: Question[];
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  mode: GameMode;
  difficulty: Difficulty;
  categoryOrTopic: string;
  winnerName: string;
  scores: Array<{ name: string; score: number; color?: string; avatar?: string }>;
}
