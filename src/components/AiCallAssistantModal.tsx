import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Bot,
  User,
  Radio,
  CheckCircle2,
  Grid,
  Zap,
  Activity,
  Smile,
  Brain,
  Flame
} from 'lucide-react';
import { Question } from '../types';
import { playSound } from '../utils/audio';

interface AiCallAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestion?: Question;
  callType?: 'hotline' | 'lifeline';
  soundEnabled?: boolean;
}

type PersonalityType = 'showman' | 'sabia' | 'retador';

export const AiCallAssistantModal: React.FC<AiCallAssistantModalProps> = ({
  isOpen,
  onClose,
  currentQuestion,
  callType = 'hotline',
  soundEnabled = true,
}) => {
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [personality, setPersonality] = useState<PersonalityType>('showman');
  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTtsActive, setIsTtsActive] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeakingAi, setIsSpeakingAi] = useState<boolean>(false);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Live spoken caption state (Only current response, no chat thread history)
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [suggestedOptionIndex, setSuggestedOptionIndex] = useState<number | undefined>(undefined);
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');

  const [followUps, setFollowUps] = useState<string[]>([
    callType === 'lifeline' ? '¿Cuál es la opción más probable?' : '¿Qué categoría me recomiendas?',
    callType === 'lifeline' ? 'Elimina una opción dudosa' : 'Dame un consejo de estrategia',
    'Cuéntame un dato curioso',
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize call
  useEffect(() => {
    if (!isOpen) {
      handleEndCall();
      return;
    }

    setCallStatus('dialing');
    setCallDuration(0);
    setCurrentCaption('');
    setSuggestedOptionIndex(undefined);
    setLastUserSpeech('');
    setShowKeypad(false);

    // Play initial ringtone
    playSound.ringtone(soundEnabled);
    ringtoneIntervalRef.current = setInterval(() => {
      playSound.ringtone(soundEnabled);
    }, 2000);

    // Connect after 2.2 seconds ring
    const connectTimeout = setTimeout(() => {
      if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
      setCallStatus('connected');
      playSound.callConnected(soundEnabled);

      let personaTitle = 'Don Triviado AI';
      if (personality === 'sabia') personaTitle = 'Dra. Sofía AI';
      if (personality === 'retador') personaTitle = 'Profesor Cero AI';

      const initialGreeting = callType === 'lifeline' && currentQuestion
        ? `¡Línea directa Gemini! Hablas con ${personaTitle}. Veo que tienes dudas en la pregunta de "${currentQuestion.category || 'Trivia'}". ¿En qué opción tienes dudas?`
        : `¡Llamada de voz en vivo! Bienvenido a Trivia Studio. Soy ${personaTitle}. ¿En qué te puedo asesorar hoy?`;

      setCurrentCaption(initialGreeting);
      speakText(initialGreeting);
    }, 2200);

    return () => {
      clearTimeout(connectTimeout);
      if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeechSynthesis();
    };
  }, [isOpen, callType, currentQuestion, personality]);

  // Call Duration Timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (!isTtsActive || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    stopSpeechSynthesis();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = personality === 'sabia' ? 1.1 : personality === 'retador' ? 0.9 : 1.0;

      utterance.onstart = () => setIsSpeakingAi(true);
      utterance.onend = () => setIsSpeakingAi(false);
      utterance.onerror = () => setIsSpeakingAi(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeakingAi(false);
    }
  };

  const stopSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAi(false);
    }
  };

  // Web Speech Recognition Handler
  const handleStartSpeechToText = () => {
    if (isMuted || loadingAi) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz directo. Utiliza las consultas rápidas por voz o el teclado numérico.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Handle DTMF Keypad Click
  const handleKeypadPress = (key: string) => {
    playSound.dtmfTone(key, soundEnabled);

    if (callType === 'lifeline' && currentQuestion) {
      if (['1', '2', '3', '4'].includes(key)) {
        const optIndex = parseInt(key) - 1;
        const optText = currentQuestion.options[optIndex];
        if (optText) {
          handleSendMessage(`Marqué la opción ${key} ("${optText}"). ¿Es correcta?`);
        }
      } else if (key === '*') {
        handleSendMessage('He pulsado asterisco para pedir una pista adicional.');
      } else if (key === '#') {
        handleSendMessage('He pulsado numeral para descartar opciones incorrectas.');
      }
    } else {
      handleSendMessage(`He marcado el dígito ${key} en mi teléfono.`);
    }
  };

  // Send Message to Server API
  const handleSendMessage = async (textInput: string) => {
    if (!textInput.trim() || loadingAi) return;

    stopSpeechSynthesis();
    setLastUserSpeech(textInput);
    setLoadingAi(true);

    try {
      const response = await fetch('/api/call-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textInput,
          callType,
          currentQuestion,
          personality,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        const aiResponseText = resData.data.spokenResponse;
        const suggestedOpt = resData.data.suggestedOptionIndex;

        setCurrentCaption(aiResponseText);
        setSuggestedOptionIndex(suggestedOpt >= 0 ? suggestedOpt : undefined);

        if (Array.isArray(resData.data.followUpPrompts)) {
          setFollowUps(resData.data.followUpPrompts);
        }

        speakText(aiResponseText);
      } else {
        const fallbackText = 'Se cortó un poco la señal en la transmisión Gemini, pero mantén la concentración en el enunciado.';
        setCurrentCaption(fallbackText);
        speakText(fallbackText);
      }
    } catch {
      const fallbackText = 'Tuve una interferencia de línea. ¡Intenta hablarme de nuevo por favor!';
      setCurrentCaption(fallbackText);
      speakText(fallbackText);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleEndCall = () => {
    stopSpeechSynthesis();
    if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    playSound.callEnded(soundEnabled);
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentPersonaName = personality === 'showman' ? 'Don Triviado' : personality === 'sabia' ? 'Dra. Sofía' : 'Profesor Cero';
  const currentPersonaAvatar = personality === 'showman' ? '🎙️' : personality === 'sabia' ? '🔬' : '⚡';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col relative">

        {/* Top Header Bar */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              LLAMADA DE VOZ EN VIVO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTtsActive(!isTtsActive)}
              className={`p-2 rounded-xl transition ${
                isTtsActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
              }`}
              title={isTtsActive ? 'Sintetizador de Voz Activado' : 'Sintetizador de Voz Silenciado'}
            >
              {isTtsActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleEndCall}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persona Switcher Bar */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setPersonality('showman')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              personality === 'showman' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Don Triviado
          </button>
          <button
            onClick={() => setPersonality('sabia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              personality === 'sabia' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" /> Dra. Sofía
          </button>
          <button
            onClick={() => setPersonality('retador')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              personality === 'retador' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Prof. Cero
          </button>
        </div>

        {/* Main Phone Call Stage (Pure Phone Call Screen) */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">

          {/* Caller Avatar & Halo Rings */}
          <div className="relative my-2">
            {/* Animated Pulsing Ring */}
            <div className={`absolute -inset-4 rounded-full transition-all duration-500 ${
              isSpeakingAi
                ? 'bg-emerald-500/30 animate-ping'
                : isListening
                ? 'bg-cyan-500/30 animate-ping'
                : 'bg-slate-800/20'
            }`} />

            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${
              personality === 'showman'
                ? 'from-amber-500 via-amber-400 to-yellow-300'
                : personality === 'sabia'
                ? 'from-purple-600 via-purple-500 to-indigo-400'
                : 'from-rose-600 via-rose-500 to-orange-400'
            } text-slate-950 font-black text-4xl flex items-center justify-center shadow-2xl relative z-10 border-4 border-slate-900`}>
              <span>{currentPersonaAvatar}</span>
            </div>

            {callStatus === 'connected' && (
              <div className="absolute bottom-1 right-1 z-20 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-lg">
                <Radio className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              </div>
            )}
          </div>

          {/* Presenter Name & Call Duration */}
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-wide">{currentPersonaName} AI</h2>
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold">
              {callStatus === 'dialing' && (
                <span className="text-amber-400 animate-pulse flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 animate-bounce" /> Estableciendo conexión telefónica...
                </span>
              )}
              {callStatus === 'connected' && (
                <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{formatTime(callDuration)}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-sans">HD Audio</span>
                </span>
              )}
              {callStatus === 'ended' && (
                <span className="text-rose-400">Llamada Finalizada</span>
              )}
            </div>
          </div>

          {/* Live Audio Frequency Waveform Visualizer */}
          <div className="w-full py-2 flex items-center justify-center gap-1.5 h-12">
            {[30, 75, 100, 60, 95, 40, 85, 100, 70, 45, 80, 90].map((heightPct, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isSpeakingAi
                    ? 'bg-gradient-to-t from-emerald-400 to-teal-300 animate-pulse'
                    : isListening
                    ? 'bg-gradient-to-t from-cyan-400 to-blue-400 animate-pulse'
                    : 'bg-slate-800 h-2'
                }`}
                style={{
                  height: isSpeakingAi || isListening ? `${Math.max(heightPct * (isSpeakingAi ? 1.0 : 0.7), 20)}%` : '8px',
                  animationDelay: `${idx * 0.07}s`,
                }}
              />
            ))}
          </div>

          {/* Live Spoken Voice Caption (Single Active Banner, NOT a chat) */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-h-[100px] flex flex-col items-center justify-center text-center shadow-inner relative">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Procesando respuesta de voz con Gemini...</span>
              </div>
            ) : currentCaption ? (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed italic">
                  "{currentCaption}"
                </p>

                {suggestedOptionIndex !== undefined && currentQuestion && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sugerencia: Opción {String.fromCharCode(65 + suggestedOptionIndex)} ("{currentQuestion.options[suggestedOptionIndex]}")</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Presiona "Hablar por Voz" para conversar o presiona una consulta rápida.
              </p>
            )}

            {lastUserSpeech && (
              <div className="mt-2 text-[10px] text-cyan-400 font-medium">
                Tú dijiste: "{lastUserSpeech}"
              </div>
            )}
          </div>
        </div>

        {/* DTMF Touch Keypad Drawer */}
        {showKeypad && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Teclado Telefónico DTMF</span>
              <span className="text-[10px] text-emerald-400 font-mono">Tonos Telefónicos</span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeypadPress(k)}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-extrabold text-base transition active:scale-95 shadow"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Voice Queries (Triggers voice response directly) */}
        {!showKeypad && (
          <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 shrink-0 space-y-2">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {followUps.map((prompt, idx) => (
                <button
                  key={idx}
                  disabled={loadingAi || callStatus !== 'connected'}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-bold transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phone Call Actions Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-around shrink-0">
          {/* Keypad */}
          <button
            onClick={() => setShowKeypad(!showKeypad)}
            className={`p-3 rounded-2xl transition flex flex-col items-center gap-1 ${
              showKeypad ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
            title="Teclado Telefónico DTMF"
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-bold">Teclado</span>
          </button>

          {/* Mic Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl transition flex flex-col items-center gap-1 ${
              isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px] font-bold">{isMuted ? 'Silenciado' : 'Micrófono'}</span>
          </button>

          {/* Main Speak Button */}
          <button
            disabled={loadingAi || callStatus !== 'connected'}
            onClick={handleStartSpeechToText}
            className={`px-6 py-3.5 rounded-2xl flex items-center gap-2 font-black text-xs transition shadow-lg ${
              isListening
                ? 'bg-cyan-400 text-slate-950 animate-pulse shadow-cyan-400/30'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{isListening ? 'Escuchando...' : 'Hablar por Voz'}</span>
          </button>

          {/* Hang Up Button */}
          <button
            onClick={handleEndCall}
            className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex flex-col items-center gap-1"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-[10px] font-bold">Colgar</span>
          </button>
        </div>

      </div>
    </div>
  );
};


