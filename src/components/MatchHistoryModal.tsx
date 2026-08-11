import React, { useState } from 'react';
import { Award, Trophy, X, Trash2, Calendar, FolderPlus, Sparkles, History } from 'lucide-react';
import { deleteCustomPack, getCustomPacks, getMatchHistory } from '../utils/storage';
import { CustomTriviaPack, MatchHistoryItem } from '../types';

interface MatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSavedPack: (pack: CustomTriviaPack) => void;
}

export const MatchHistoryModal: React.FC<MatchHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectSavedPack,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'packs'>('history');
  const [historyItems, setHistoryItems] = useState<MatchHistoryItem[]>(getMatchHistory());
  const [customPacks, setCustomPacks] = useState<CustomTriviaPack[]>(getCustomPacks());

  if (!isOpen) return null;

  const handleDeletePack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteCustomPack(id);
    setCustomPacks(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Salón de la Fama & Archivo</h3>
              <p className="text-xs text-slate-400">Historial de partidas y trivias personalizadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <History className="w-4 h-4" /> Historial de Partidas ({historyItems.length})
          </button>

          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'packs'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Trivias IA Guardadas ({customPacks.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeTab === 'history' ? (
            historyItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Trophy className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm font-semibold">No hay historial de partidas aún.</p>
                <p className="text-xs">¡Completa tu primera partida para inaugurar el Salón de la Fama!</p>
              </div>
            ) : (
              historyItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-2">
                    <span className="flex items-center gap-1 text-amber-400 font-bold capitalize">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.categoryOrTopic} ({item.mode === 'equipos' ? 'Equipos' : 'Individual'})
                    </span>
                    <span>{new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-black text-white">Ganador: {item.winnerName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      {item.scores.map((s, idx) => (
                        <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {s.name}: {s.score}pts
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            customPacks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <FolderPlus className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-sm font-semibold">No tienes trivias de IA guardadas.</p>
                <p className="text-xs">¡Usa el Generador de IA para crear tus temas favoritos!</p>
              </div>
            ) : (
              customPacks.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => {
                    onSelectSavedPack(pack);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition">
                        {pack.topic}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {pack.questionCount} Preguntas
                      </span>
                      <button
                        onClick={(e) => handleDeletePack(pack.id, e)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Eliminar Paquete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Dificultad: <span className="capitalize font-bold text-slate-300">{pack.difficulty}</span>
                  </p>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
