import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY non está configurada en las variables de entorno.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: AI Trivia Pack Generator
  app.post('/api/generate-trivia', async (req, res) => {
    try {
      const { topic, count = 10, difficulty = 'medio', language = 'es' } = req.body;

      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: 'El tema (topic) es requerido.' });
      }

      const ai = getAiClient();
      const numQuestions = Math.min(Math.max(Number(count) || 10, 3), 20);

      const prompt = `Genera un paquete interactivo de trivia con exactamente ${numQuestions} preguntas desafiantes sobre el tema: "${topic}".
Nivel de dificultad objetivo: ${difficulty}.
Idioma: ${language === 'en' ? 'Inglés' : 'Español'}.

Requisitos para cada pregunta:
- Texto de la pregunta claro, libre de ambigüedades.
- Exactamente 4 opciones de respuesta distintas.
- 'correctAnswerIndex' debe ser un número entero de 0 a 3 indicando la respuesta correcta.
- 'explanation' breve (1-2 oraciones) explicando el dato fascinante detrás de la respuesta correcta.
- 'hint' una pista sutil pero útil que no revele directamente la respuesta.
- 'difficulty' clasificado como 'facil', 'medio', 'dificil' o 'extremo'.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Hablame en acento Argentino fuerte y claro, háblame de neurociencia y epigenética.',
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'Lista de preguntas de trivia',
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: 'Texto de la pregunta' },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactamente 4 opciones de respuesta',
                },
                correctAnswerIndex: {
                  type: Type.INTEGER,
                  description: 'Índice de la respuesta correcta (0, 1, 2 o 3)',
                },
                explanation: { type: Type.STRING, description: 'Explicación curiosa' },
                hint: { type: Type.STRING, description: 'Pista sutil' },
                difficulty: { type: Type.STRING, description: 'Nivel: facil, medio, dificil, o extremo' },
              },
              required: ['text', 'options', 'correctAnswerIndex', 'explanation', 'hint', 'difficulty'],
            },
          },
        },
      });

      const responseText = response.text || '[]';
      const parsedQuestions = JSON.parse(responseText);

      // Add unique IDs and normalize
      const formattedQuestions = parsedQuestions.map((q: any, idx: number) => ({
        id: `gen_${Date.now()}_${idx}`,
        text: q.text,
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswerIndex: Math.min(Math.max(Number(q.correctAnswerIndex) || 0, 0), 3),
        explanation: q.explanation || 'Respuesta correcta.',
        category: 'custom',
        difficulty: (['facil', 'medio', 'dificil', 'extremo'].includes(q.difficulty) ? q.difficulty : difficulty) as any,
        hint: q.hint || 'Revisa atentamente las opciones.',
      }));

      return res.json({
        success: true,
        topic,
        questions: formattedQuestions,
      });
    } catch (err: any) {
      console.error('Error generating trivia:', err);
      return res.status(500).json({
        error: 'No se pudo generar la trivia con IA.',
        details: err.message || String(err),
      });
    }
  });

  // API Route: AI Call Assistant Host & Hotline
  app.post('/api/call-assistant', async (req, res) => {
    try {
      const { userMessage, callType = 'hotline', currentQuestion, personality = 'showman' } = req.body;

      const ai = getAiClient();

      let personaName = "Don Triviado AI";
      let personaDescription = "el célebre y carismático presentador de TV de Trivia Studio. Tu tono es súper alegre, profesional, eufórico y entusiasta.";

      if (personality === 'sabia') {
        personaName = "Dra. Sofía AI";
        personaDescription = "la brillante investigadora erudita del programa. Tu tono es sabio, sereno, analítico y pedagógico.";
      } else if (personality === 'retador') {
        personaName = "Profesor Cero AI";
        personaDescription = "el sarcástico e insaciable maestro del concurso. Tu tono es irónico, divertido, desafiante y astuto.";
      }

      let systemInstruction = `Eres "${personaName}", ${personaDescription}
Escribe respuestas concisas y directas (máximo 2 a 3 oraciones cortas), pensadas para ser leídas fluidamente por síntesis de voz en vivo (Gemini Live Voice Call).
Utiliza un lenguaje natural de conversación telefónica directa.`;

      if (callType === 'lifeline' && currentQuestion) {
        systemInstruction += `\n\nEl jugador te está llamando EN VIVO por teléfono durante su partida para usar su comodín de "Llamada al Experto IA".
La pregunta actual es:
Texto: "${currentQuestion.text}"
Opciones: ${JSON.stringify(currentQuestion.options)}
Pista secundaria: "${currentQuestion.hint || ''}"

Instrucciones para la llamada del comodín de voz:
1. Da una orientación astuta o pista lógica. No le des la respuesta de forma aburrida. Ayúdale a descartar opciones.
2. Mantén el ritmo rápido de una llamada telefónica de concurso televisivo en vivo.`;
      }

      const prompt = `Llamada de voz entrante del jugador: "${userMessage || '¡Hola! Salúdame brevemente y dime en qué puedes ayudarme.'}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-live-preview',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              spokenResponse: {
                type: Type.STRING,
                description: 'Respuesta natural y carismática para síntesis de voz (2-3 oraciones)',
              },
              suggestedOptionIndex: {
                type: Type.INTEGER,
                description: 'Índice de la opción sugerida (0-3) o -1 si no aplica',
              },
              mood: {
                type: Type.STRING,
                description: 'Tono emocional: eufórico, sabio, misterioso, divertido',
              },
              followUpPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array de 2 o 3 frases cortas de seguimiento para continuar la llamada',
              },
            },
            required: ['spokenResponse', 'suggestedOptionIndex', 'mood', 'followUpPrompts'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Error in call assistant:', err);
      return res.status(500).json({
        error: 'Error al comunicarse con el Asistente telefónico IA.',
        details: err.message || String(err),
      });
    }
  });

  // Vite middleware or Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Trivia Studio Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
