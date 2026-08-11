import { Category, Question } from '../types';

export const PRESET_CATEGORIES: Category[] = [
  {
    id: 'general',
    name: 'Cultura General',
    icon: 'Globe',
    color: 'from-amber-500 to-orange-600',
    description: 'Preguntas variadas sobre ciencia, arte, curiosidades y cultura global.',
  },
  {
    id: 'cine_tv',
    name: 'Cine & Series',
    icon: 'Film',
    color: 'from-purple-500 to-indigo-600',
    description: 'Películas taquilleras, clásicos del cine, series icónicas y actores.',
  },
  {
    id: 'ciencia_tech',
    name: 'Ciencia & Tecnología',
    icon: 'Cpu',
    color: 'from-cyan-500 to-blue-600',
    description: 'Descubrimientos científicos, física, informática, espacio y gadgets.',
  },
  {
    id: 'historia',
    name: 'Historia del Mundo',
    icon: 'BookOpen',
    color: 'from-emerald-500 to-teal-600',
    description: 'Imperios antiguos, eventos históricos, batallas y personajes celebres.',
  },
  {
    id: 'deportes',
    name: 'Deportes & Fútbol',
    icon: 'Trophy',
    color: 'from-emerald-600 to-green-700',
    description: 'Mundiales de fútbol, Juegos Olímpicos, leyendas del deporte y récords.',
  },
  {
    id: 'videojuegos',
    name: 'Videojuegos & Gaming',
    icon: 'Gamepad2',
    color: 'from-pink-500 to-rose-600',
    description: 'Consolas, personajes icónicos de Nintendo, PlayStation, Xbox y PC.',
  },
  {
    id: 'musica',
    name: 'Música & Pop Culture',
    icon: 'Music',
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Bandas legendarias, hits musicales, géneros y cultura pop.',
  },
  {
    id: 'geografia',
    name: 'Geografía Mundial',
    icon: 'MapPin',
    color: 'from-sky-500 to-indigo-500',
    description: 'Capitales, banderas, monumentos, ríos y maravillas del mundo.',
  },
];

export const PRESET_QUESTIONS: Question[] = [
  // --- CULTURA GENERAL ---
  {
    id: 'gen_1',
    category: 'general',
    difficulty: 'facil',
    text: '¿Cuál es el océano más grande del planeta Tierra?',
    options: ['Océano Atlántico', 'Océano Pacífico', 'Océano Índico', 'Océano Ártico'],
    correctAnswerIndex: 1,
    hint: 'Baña las costas de Asia, Oceanía y las Américas.',
    explanation: 'El Océano Pacífico ocupa más de 165 millones de km², cubriendo más del 30% de la superficie terrestre.',
  },
  {
    id: 'gen_2',
    category: 'general',
    difficulty: 'facil',
    text: '¿Quién pintó la famosa obra de arte "La Gioconda" (Mona Lisa)?',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswerIndex: 2,
    hint: 'Fue un polímata renacentista italiano, inventor y pintor.',
    explanation: 'Leonardo da Vinci pintó la Mona Lisa a principios del siglo XVI. Se exhibe en el Museo del Louvre en París.',
  },
  {
    id: 'gen_3',
    category: 'general',
    difficulty: 'medio',
    text: '¿En qué país se encuentra la antigua ciudad arqueológica de Petra?',
    options: ['Egipto', 'Jordania', 'Grecia', 'Marruecos'],
    correctAnswerIndex: 1,
    hint: 'Es famosa por sus construcciones labradas en la roca rosa.',
    explanation: 'Petra es un famoso yacimiento arqueológico en el desierto sudoeste de Jordania, capital del antiguo reino nabateo.',
  },
  {
    id: 'gen_4',
    category: 'general',
    difficulty: 'dificil',
    text: '¿Cuál es la lengua viva con el mayor número de hablantes nativos en el mundo?',
    options: ['Inglés', 'Español', 'Chino Mandarín', 'Hindi'],
    correctAnswerIndex: 2,
    hint: 'Tiene más de 900 millones de hablantes nativos.',
    explanation: 'El Chino Mandarín tiene aproximadamente 920 millones de hablantes nativos, superando al español y al inglés como lengua materna.',
  },
  {
    id: 'gen_5',
    category: 'general',
    difficulty: 'extremo',
    text: '¿Qué tratado formalizó el fin de la Primera Guerra Mundial en 1919?',
    options: ['Tratado de Utrecht', 'Tratado de Versalles', 'Tratado de Westfalia', 'Tratado de Ginebra'],
    correctAnswerIndex: 1,
    hint: 'Se firmó en la Galería de los Espejos del famoso palacio francés.',
    explanation: 'El Tratado de Versalles se firmó el 28 de junio de 1919 exactamente 5 años después del asesinato del archiduque Francisco Fernando.',
  },

  // --- CINE Y SERIES ---
  {
    id: 'cine_1',
    category: 'cine_tv',
    difficulty: 'facil',
    text: '¿Qué director dirigió "Titanic" y "Avatar"?',
    options: ['Steven Spielberg', 'James Cameron', 'Christopher Nolan', 'Quentin Tarantino'],
    correctAnswerIndex: 1,
    hint: 'Es conocido por sus expediciones submarinas y efectos visuales revolucionarios.',
    explanation: 'James Cameron es el creador de dos de las películas más taquilleras de la historia del cine.',
  },
  {
    id: 'cine_2',
    category: 'cine_tv',
    difficulty: 'medio',
    text: 'En la saga Harry Potter, ¿cuál es el animal patronus de Severus Snape?',
    options: ['Un ciervo', 'Una cierva', 'Un fénix', 'Un lobo'],
    correctAnswerIndex: 1,
    hint: 'Es el mismo patronus que tenía Lily Potter. "Always..."',
    explanation: 'Snape compartía la cierva (Doe) como patronus con Lily Potter debido a su amor incondicional por ella.',
  },
  {
    id: 'cine_3',
    category: 'cine_tv',
    difficulty: 'medio',
    text: '¿Qué película ganó el Óscar a la Mejor Película en la ceremonia de 2024?',
    options: ['Barbie', 'Oppenheimer', 'Poor Things', 'The Zone of Interest'],
    correctAnswerIndex: 1,
    hint: 'Trata sobre el padre de la bomba atómica y fue dirigida por Christopher Nolan.',
    explanation: 'Oppenheimer arrasó en la 96ª edición de los Premios de la Academia recibiendo 7 estatuillas.',
  },
  {
    id: 'cine_4',
    category: 'cine_tv',
    difficulty: 'dificil',
    text: '¿Cómo se llama la inteligencia artificial rebelde en la película "2001: Odisea del Espacio"?',
    options: ['Skynet', 'HAL 9000', 'JARVIS', 'WOPR'],
    correctAnswerIndex: 1,
    hint: 'Su ojo rojo brillante es su rasgo más distintivo.',
    explanation: 'HAL 9000 es la computadora de a bordo de la nave Discovery One en la obra maestra de Stanley Kubrick.',
  },
  {
    id: 'cine_5',
    category: 'cine_tv',
    difficulty: 'extremo',
    text: '¿Cuál fue el primer largometraje animado a color de la historia del cine en 1937?',
    options: ['Pinocho', 'Fantasía', 'Blanca Nieves y los Siete Enanos', 'Bambi'],
    correctAnswerIndex: 2,
    hint: 'Fue el ambicioso proyecto que consolidó a Walt Disney.',
    explanation: 'Snow White and the Seven Dwarfs fue el primer largometraje de animación sonoro y en Technicolor producida por Walt Disney.',
  },

  // --- CIENCIA Y TECNOLOGÍA ---
  {
    id: 'cienc_1',
    category: 'ciencia_tech',
    difficulty: 'facil',
    text: '¿Cuál es el elemento químico más abundante en el universo conocido?',
    options: ['Oxígeno', 'Carbono', 'Hidrógeno', 'Helio'],
    correctAnswerIndex: 2,
    hint: 'Su símbolo químico es H y es el más ligero de la tabla periódica.',
    explanation: 'El Hidrógeno representa cerca del 75% de la masa elemental del universo.',
  },
  {
    id: 'cienc_2',
    category: 'ciencia_tech',
    difficulty: 'medio',
    text: '¿Qué científico formuló la Teoría de la Relatividad General?',
    options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Galileo Galilei'],
    correctAnswerIndex: 1,
    hint: 'Revolucionó la física con la ecuación E = mc².',
    explanation: 'Albert Einstein publicó la Teoría de la Relatividad General en 1915 transformando nuestra comprensión de la gravedad y el espacio-tiempo.',
  },
  {
    id: 'cienc_3',
    category: 'ciencia_tech',
    difficulty: 'dificil',
    text: '¿Qué significa la sigla "HTTP" en la navegación web?',
    options: [
      'HyperText Transfer Protocol',
      'High-Tech Text Program',
      'HyperText Technical Process',
      'Hosted Text Transfer Path'
    ],
    correctAnswerIndex: 0,
    hint: 'Es el protocolo de transferencia de hipertexto de la World Wide Web.',
    explanation: 'HyperText Transfer Protocol es el protocolo fundamental para el intercambio de información en la web.',
  },
  {
    id: 'cienc_4',
    category: 'ciencia_tech',
    difficulty: 'extremo',
    text: '¿Qué partícula elemental es conocida popularmente como la "partícula de Dios"?',
    options: ['Bosón de Higgs', 'Neutrino', 'Quark Top', 'Gravitón'],
    correctAnswerIndex: 0,
    hint: 'Fue confirmada experimentalmente en el Gran Colisionador de Hadrones (CERN) en 2012.',
    explanation: 'El Bosón de Higgs otorga masa a las demás partículas elementales dentro del Modelo Estándar de física de partículas.',
  },

  // --- HISTORIA DEL MUNDO ---
  {
    id: 'hist_1',
    category: 'historia',
    difficulty: 'facil',
    text: '¿En qué año llegó Cristóbal Colón a América?',
    options: ['1492', '1521', '1453', '1500'],
    correctAnswerIndex: 0,
    hint: 'Siglo XV, a bordo de La Niña, La Pinta y La Santa María.',
    explanation: 'El 12 de octubre de 1492, la expedición al mando de Cristóbal Colón llegó a la isla de Guanahani en las Bahamas.',
  },
  {
    id: 'hist_2',
    category: 'historia',
    difficulty: 'medio',
    text: '¿Quién fue el primer emperador del Imperio Romano?',
    options: ['Julio César', 'Marco Aurelio', 'Augusto (Octavio)', 'Noche de Nerón'],
    correctAnswerIndex: 2,
    hint: 'Sobrino e hijo adoptivo de Julio César.',
    explanation: 'César Augusto se convirtió en el primer emperador romano tras la caída de la República en el 27 a.C.',
  },
  {
    id: 'hist_3',
    category: 'historia',
    difficulty: 'dificil',
    text: '¿En qué año cayó el Muro de Berlín, símbolo de la Guerra Fría?',
    options: ['1985', '1989', '1991', '1975'],
    correctAnswerIndex: 1,
    hint: 'Sucedió en noviembre, poco antes de la disolución de la URSS.',
    explanation: 'El Muro de Berlín cayó la noche del 9 de noviembre de 1989 abriendo paso a la reunificación alemana.',
  },

  // --- DEPORTES Y FÚTBOL ---
  {
    id: 'dep_1',
    category: 'deportes',
    difficulty: 'facil',
    text: '¿Qué país ha ganado más Copas Mundiales de Fútbol de la FIFA?',
    options: ['Alemania', 'Argentina', 'Brasil', 'Italia'],
    correctAnswerIndex: 2,
    hint: 'Conocida como la "Verdeamarela", cuenta con 5 estrellas en su escudo.',
    explanation: 'Brasil ha ganado 5 Mundiales de la FIFA (1958, 1962, 1970, 1994 y 2002).',
  },
  {
    id: 'dep_2',
    category: 'deportes',
    difficulty: 'medio',
    text: '¿Quién ostenta el récord de más medallas olímpicas de oro en la historia?',
    options: ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Simone Biles'],
    correctAnswerIndex: 1,
    hint: 'Es un nadador estadounidense conocido como el "Tiburón de Baltimore".',
    explanation: 'Michael Phelps tiene un total de 28 medallas olímpicas, de las cuales 23 son de oro puro.',
  },
  {
    id: 'dep_3',
    category: 'deportes',
    difficulty: 'dificil',
    text: '¿En qué ciudad se celebraron los primeros Juegos Olímpicos de la era moderna en 1896?',
    options: ['París', 'Atenas', 'Londres', 'Roma'],
    correctAnswerIndex: 1,
    hint: 'Homenaje a la cuna histórica de las Olimpiadas antiguas.',
    explanation: 'Los Juegos de la I Olimpiada se disputaron en Atenas, Grecia, impulsados por el barón Pierre de Coubertin.',
  },

  // --- VIDEOJUEGOS ---
  {
    id: 'vj_1',
    category: 'videojuegos',
    difficulty: 'facil',
    text: '¿Cuál es el videojuego más vendido de todos los tiempos?',
    options: ['Tetris', 'Grand Theft Auto V', 'Minecraft', 'Super Mario Bros'],
    correctAnswerIndex: 2,
    hint: 'Un mundo infinito de bloques creado por Markus "Notch" Persson.',
    explanation: 'Minecraft ha vendido más de 300 millones de copias en múltiples plataformas desde su lanzamiento.',
  },
  {
    id: 'vj_2',
    category: 'videojuegos',
    difficulty: 'medio',
    text: '¿Cómo se llama el reino ficticio donde transcurre la mayoría de juegos de The Legend of Zelda?',
    options: ['Kanto', 'Hyrule', 'Tamriel', 'Azeroth'],
    correctAnswerIndex: 1,
    hint: 'Protegido por la Trifuerza y la princesa del mismo nombre.',
    explanation: 'Hyrule es la próspera y mística tierra creada por las diosas Din, Nayru y Farore.',
  },
  {
    id: 'vj_3',
    category: 'videojuegos',
    difficulty: 'dificil',
    text: '¿En qué año se lanzó al mercado la primera consola PlayStation original de Sony?',
    options: ['1991', '1994', '1998', '2000'],
    correctAnswerIndex: 1,
    hint: 'Se lanzó primero en Japón en diciembre de ese año.',
    explanation: 'La PlayStation (PSX) debutó en Japón el 3 de diciembre de 1994 marcando una nueva era en juegos en CD-ROM.',
  },

  // --- MÚSICA & POP CULTURE ---
  {
    id: 'mus_1',
    category: 'musica',
    difficulty: 'facil',
    text: '¿A qué icónica banda pertenecían John Lennon, Paul McCartney, George Harrison y Ringo Starr?',
    options: ['The Rolling Stones', 'Queen', 'The Beatles', 'Pink Floyd'],
    correctAnswerIndex: 2,
    hint: 'Los cuatro fabulosos de Liverpool.',
    explanation: 'The Beatles revolucionaron la música popular durante la década de 1960.',
  },
  {
    id: 'mus_2',
    category: 'musica',
    difficulty: 'medio',
    text: '¿Cuál es el álbum musical más vendido de la historia en todo el mundo?',
    options: ['Back in Black - AC/DC', 'Thriller - Michael Jackson', 'The Dark Side of the Moon - Pink Floyd', 'Rumours - Fleetwood Mac'],
    correctAnswerIndex: 1,
    hint: 'Lanzado en 1982 por el Rey del Pop.',
    explanation: 'Thriller de Michael Jackson ha vendido aproximadamente 70 millones de copias mundiales.',
  },

  // --- GEOGRAFÍA ---
  {
    id: 'geo_1',
    category: 'geografia',
    difficulty: 'facil',
    text: '¿Cuál es la capital oficial de Australia?',
    options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctAnswerIndex: 2,
    hint: 'No es Sídney ni Melbourne, fue elegida como compromiso entre ambas.',
    explanation: 'Canberra fue elegida como la capital planificada de Australia en 1908.',
  },
  {
    id: 'geo_2',
    category: 'geografia',
    difficulty: 'medio',
    text: '¿Cuál es el río más largo del mundo?',
    options: ['Río Nilo', 'Río Amazonas', 'Río Misisipi', 'Río Yangtsé'],
    correctAnswerIndex: 1,
    hint: 'Atraviesa Sudamérica y posee el mayor caudal de agua del planeta.',
    explanation: 'El Río Amazonas mide aproximadamente 6,992 km, superando ligeramente al Nilo en longitud según estudios científicos modernos.',
  }
];

/**
 * Filter questions based on configuration parameters
 */
export function getFilteredQuestions(
  categoryId: string,
  difficulty: string,
  count: number = 10
): Question[] {
  let list = [...PRESET_QUESTIONS];

  if (categoryId !== 'todas') {
    list = list.filter(q => q.category === categoryId);
  }

  if (difficulty !== 'mixto') {
    const matchingDiff = list.filter(q => q.difficulty === difficulty);
    // If we have enough matching difficulty, use them, otherwise supplement
    if (matchingDiff.length >= count) {
      list = matchingDiff;
    }
  }

  // Shuffle list
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }

  return list.slice(0, count);
}
