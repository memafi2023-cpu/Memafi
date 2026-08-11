import React, { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { Difficulty, Question } from '../types';
import { saveCustomPack } from '../utils/storage';

interface AiTriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriviaGenerated: (topic: string, questions: Question[]) => void;
}

const TOPIC_SUGGESTIONS = [
  '⚡ Harry Potter & Mundo Mágico',
  '🦸‍♂️ Universo Cinematográfico de Marvel',
  '🎸 Historia del Rock & Pop de los 80s',
  '⚽ Champions League & Leyendas del Fútbol',
  '🍣 Gastronomía & Cocina del Mundo',
  '🤖 Inteligencia Artificial & Robótica',
  '🎮 Historia de Nintendo & Mario Bros',
  '🚀 Exploración Espacial & Astronomía',
];

export const AiTriviaModal: React.FC<AiTriviaModalProps> = ({
  isOpen,
  onClose,
  onTriviaGenerated,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medio');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedTopic?: string) => {
    const finalTopic = (selectedTopic || topicInput).trim();
    if (!finalTopic) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalTopic,
          count: questionCount,
          difficulty,
          language: 'es',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !Array.isArray(data.questions)) {
        throw new Error(data.error || data.details || 'Error al comunicar con la IA.');
      }

      // Save to localStorage
      saveCustomPack({
        title: `Trivia de ${finalTopic}`,
        topic: finalTopic,
        questionCount: data.questions.length,
        difficulty,
        questions: data.questions,
      });

      onTriviaGenerated(finalTopic, data.questions);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'No se pudo generar la trivia. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-950/80 overflow-hidden text-slate-100 p-6 space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Generador de Trivia con IA</h3>
              <p className="text-xs text-purple-300">Crea cuestionarios únicos de cualquier tema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-purple-400" /> Escribe tu tema o idea favorita:
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              placeholder="Ej: Mitología Griega, Series de los 90, Los Simpsons..."
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Ideas chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> O elige una sugerencia popular:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {TOPIC_SUGGESTIONS.map((sug) => {
                const cleanTopic = sug.replace(/^[^\s]+\s/, '');
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setTopicInput(cleanTopic);
                    }}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 hover:text-purple-200 border border-slate-700 text-xs transition"
                  >
                    {sug}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Question count */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Dificultad:</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
                <option value="extremo">Extremo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preguntas:</label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value={5}>5 Preguntas</option>
                <option value={10}>10 Preguntas</option>
                <option value={15}>15 Preguntas</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isLoading || !topicInput.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-yellow-300" />
                <span>Creando Trivia con Gemini IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Generar Paquete de Trivia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
