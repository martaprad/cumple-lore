/* Contenido de la aventura. Los recuerdos y mensajes proceden del cuestionario. */
window.LORENA_DATA = {
  version: '2026-10-20.1',
  title: 'Operación Lorena',
  subtitle: 'El tesoro de los 40',
  photos: {
    puzzle: {
      src: './assets/lorena-infancia-1.jpg',
      fallback: './assets/lorena-grand-line-portrait.png',
      alt: 'Retrato de Lorena'
    },
    finale: {
      src: './assets/lorena-infancia-2.jpg',
      fallback: './assets/lorena-grand-line-portrait.png',
      alt: 'Lorena'
    },
    hero: './assets/lorena-grand-line-portrait.png',
    heroAlt: 'Ilustración pirata de Lorena',
    seal: './assets/lorena-grand-line-seal.png'
  },
  gift: {
    destination: 'Punta Cana',
    country: 'República Dominicana',
    passengers: 'Lorena + acompañante',
    kind: 'Resort all-inclusive',
    image: './assets/punta-cana-all-inclusive.png',
    heading: '¡Te vas de viaje!',
    message: 'Con tu compañero de aventuras para celebrar tus 40 años.',
    finalClue: ''
  },
  challenges: [
    {
      id: 'portrait',
      type: 'puzzle',
      title: 'El retrato perdido',
      description: 'El retrato de la capitana ha quedado hecho pedazos. Recompón la imagen y recupera tu primera llave.',
      hint: 'Empieza por las esquinas y continúa con las piezas de los bordes.',
      completedMessage: '¡Retrato reconstruido! La capitana vuelve a estar al mando.'
    },
    {
      id: 'ports',
      type: 'match',
      title: 'Los puertos de la memoria',
      description: 'Tu tripulación ha mezclado las páginas del cuaderno de viajes. Une cada lugar con el recuerdo que le corresponde.',
      hint: 'Busca los detalles que hacen único cada viaje: chocolate, una mochila, un untador, un kebab y una cuenta con sorpresa.',
      completedMessage: '¡Rumbo recuperado! Cada recuerdo ha vuelto a su puerto.',
      pairs: [
        {
          id: 'port-portugal',
          place: 'Portugal',
          memory: 'Las famosas boliñas de chocolate.',
          authorId: 'irene',
          story: 'Irene recuerda las boliñas de chocolate que consigues en Portugal y traes a Madrid. En su relato, la operación tenía nombre de broma: «contrabandoooo». '
        },
        {
          id: 'port-japon',
          place: 'Japón',
          memory: 'La chica que se acercó a la mochila… ¡y sí entendía español!',
          authorId: 'sonia',
          story: 'Sonia recuerda que en Japón hablabas en español pensando que nadie te entendía. Una chica se acercó a tu mochila para hacerse una foto y, después de tus advertencias, respondió: «Vale, vale, tranquila». Sorpresa: sí entendía español.'
        },
        {
          id: 'port-andorra',
          place: 'Andorra',
          memory: 'Un desayuno y un untador con mucho valor sentimental.',
          authorId: 'patri',
          story: 'Patri recuerda aquel desayuno en Andorra en el que se rompió un untador que había pertenecido a la abuela de una chica. Lo resume así: «Risas y drama por igual».'
        },
        {
          id: 'port-atenas',
          place: 'Atenas',
          memory: 'El señor del kebab que dejó pagar la cena al día siguiente.',
          authorId: 'novio',
          story: 'Tu compañero de aventuras recuerda un hotel en Atenas, cerca del Partenón y sorprendentemente barato, que resultó ser toda una sorpresa. De aquel viaje también quedó la amabilidad del señor del kebab: os dejó pagar la cena al día siguiente.'
        },
        {
          id: 'port-logrono',
          place: 'Logroño',
          memory: 'Una cuenta supuestamente pagada en la calle Laurel.',
          authorId: 'marta-basket',
          story: 'Marta, tu amiga de basket, recuerda que en un bar de la calle Laurel dijiste que ya habías pagado. Cuando tus amigas preguntaron cuánto te debían, confesaste que habíais salido sin pagar. Según Marta, «el disimulo lo trae de serie».'
        }
      ]
    },
    {
      id: 'phrases',
      type: 'quiz',
      title: 'El idioma de la capitana',
      description: 'Tu tripulación ha guardado unas cuantas expresiones memorables. Elige cómo termina cada una.',
      hint: 'Son las expresiones que tus amigos enviaron al cuestionario. Léelas en voz alta: quizá te salga el final solo.',
      completedMessage: '¡Ese lenguaje es inconfundible! Ya dominas el idioma de la capitana.',
      questions: [
        {
          id: 'phrase-tomate',
          prompt: 'Completa la expresión: «Más roja que el…»',
          options: [
            { id: 'pimiento', text: 'Pimiento' },
            { id: 'tomate', text: 'Tomate' },
            { id: 'cangrejo', text: 'Cangrejo' }
          ],
          correctId: 'tomate',
          hint: 'Alberto eligió una comparación que también podrías encontrar en una ensalada.',
          authorId: 'alberto',
          reveal: 'Alberto envió la expresión «Más roja que el tomate».',
          fullText: 'Más roja que el tomate'
        },
        {
          id: 'phrase-cloaca',
          prompt: 'Completa la expresión: «Rata de…»',
          options: [
            { id: 'bodega', text: 'Bodega' },
            { id: 'cubierta', text: 'Cubierta' },
            { id: 'cloaca', text: 'Cloaca' }
          ],
          correctId: 'cloaca',
          hint: 'La palabra que envió Patri lleva al subsuelo de la ciudad.',
          authorId: 'patri',
          reveal: 'Patri escogió una expresión muy concreta: «Rata de cloaca».',
          fullText: 'Rata de cloaca'
        },
        {
          id: 'phrase-explico',
          prompt: 'Completa la expresión: «No sé si me…»',
          options: [
            { id: 'explico', text: 'Explico' },
            { id: 'entiendes', text: 'Entiendes' },
            { id: 'sigues', text: 'Sigues' }
          ],
          correctId: 'explico',
          hint: 'La frase pone el foco en cómo estás contando algo.',
          authorId: 'novio',
          reveal: 'Tu compañero de aventuras incluyó «No sé si me explico» entre tus expresiones.',
          fullText: 'No se si me explico'
        },
        {
          id: 'phrase-cambio',
          prompt: 'Completa: «Hay que bajar a defender y, si no,…»',
          options: [
            { id: 'esperas-arriba', text: 'Esperas arriba' },
            { id: 'pides-cambio', text: 'Pides cambio' },
            { id: 'tiempo-muerto', text: 'Pides un tiempo muerto' }
          ],
          correctId: 'pides-cambio',
          hint: 'Si no bajas, deja entrar a alguien que sí lo haga.',
          authorId: 'alberto',
          reveal: 'Alberto lo dejó claro: «Hay que bajar a defender y sino, pides cambio!».',
          fullText: 'Hay que bajar a defender y sino, pides cambio!'
        }
      ]
    },
    {
      id: 'bottles',
      type: 'quiz',
      title: 'Mensajes en una botella',
      description: 'Tres personas han enviado un recuerdo al cuestionario. Lee cada historia y descubre quién la envió.',
      hint: 'Buscamos a la persona que envió el recuerdo. Las pistas sobre cómo os conocéis te ayudarán a reconocerla.',
      completedMessage: '¡Firmas encontradas! Los mensajes vuelven a tener remitente.',
      questions: [
        {
          id: 'bottle-metro',
          prompt: '¿Quién envió este recuerdo al cuestionario?',
          story: 'Todo empezó con Nuevos Ministerios. Lorena se puso a investigar en Google y ChatGPT los escalones, las dimensiones y la profundidad de las estaciones de metro. La conversación se fue extendiendo a otros lugares y terminó entre risas.',
          options: [
            { id: 'ana', text: 'Ana' },
            { id: 'arantxa', text: 'Arantxa' },
            { id: 'marta-clinico', text: 'Marta del clínico' }
          ],
          correctId: 'arantxa',
          hint: 'La remitente se incorporó recientemente al laboratorio y te conoció en el turno de tarde.',
          authorId: 'arantxa',
          reveal: 'Lo envió Arantxa, tu compañera del laboratorio. Su recuerdo empieza en Nuevos Ministerios y acaba celebrando tu curiosidad y lo fácil que es reír contigo.',
          fullText: 'Estuvo Lorena mirando por Google y el chapgot información sobre la cantidad de escalones longitud largura y profundidad de las estaciones de metro en Madrid… todo por Nuevos Ministerios… la conversación ya se fue a toda España y después a Europa … ajjajajaj….como te cuento … estuvo buscando la profundidad de las estaciones de metro y creo que el ranking estaba en Rusia y Japón y algún más larga en España pero creo que Bilbao ya lo recuerdo … fue un momento muy anecdótico y después hablar del tema pasamos a un rato muy gracioso … además que Lorena sonrie como con el respirar así que lo de reírse es fácil … '
        },
        {
          id: 'bottle-grupo',
          prompt: '¿Quién envió este recuerdo al cuestionario?',
          story: 'Una amiga se confundió de grupo al hablar de una persona. Lorena supo disimular a la perfección y sacarla del paso.',
          options: [
            { id: 'marta-basket', text: 'Marta de basket' },
            { id: 'sonia', text: 'Sonia' },
            { id: 'marta-clinico', text: 'Marta del clínico' }
          ],
          correctId: 'marta-clinico',
          hint: 'En el formulario se presenta como tu amiga del clínico.',
          authorId: 'marta-clinico',
          reveal: 'Lo envió Marta del clínico. Recordó cómo tu capacidad para disimular la sacó del apuro.',
          fullText: 'Hablar de una persona confundiéndome de grupo y que Lorena supiera disimular a la perfección sacándome del paso'
        },
        {
          id: 'bottle-fuente',
          prompt: '¿Quién envió este recuerdo al cuestionario?',
          story: 'Un viaje a Marina d’Or, unos hombres bañándose en una fuente y una llamada a la policía. Así de breve y memorable llegó esta historia.',
          options: [
            { id: 'ana', text: 'Ana' },
            { id: 'tamara', text: 'Tamara' },
            { id: 'irene', text: 'Irene' }
          ],
          correctId: 'ana',
          hint: 'Es amiga de Marta y se presentó como compañera de aquel viaje a Marina d’Or.',
          authorId: 'ana',
          reveal: 'Lo envió Ana, tu compañera del viaje a Marina d’Or y amiga de Marta.',
          fullText: 'Llamar a la policia cuando unos cincuentones se bañaban en una fuente'
        }
      ]
    },
    {
      id: 'tavern',
      type: 'letters',
      title: 'La taberna secreta',
      description: 'La última llave espera en un lugar de vuestro barrio. Ordena las seis letras y recupera el nombre de la taberna.',
      hint: 'Tamara y Vero mencionaron el mismo bar. Son seis letras y empieza por T.',
      completedMessage: '¡La taberna vuelve a tener nombre! Ya tienes la última llave del cofre.',
      answer: 'TRASGU',
      letters: ['G', 'U', 'A', 'R', 'S', 'T'],
      clues: [
        'Tamara recuerda el bar mítico donde os juntabais las amigas del barrio.',
        'Vero se queda con las cenas de los viernes en ese mismo bar.'
      ],
      reveal: '¡TRASGU! Tamara lo nombró como el bar mítico del barrio y Vero recordó las cenas de los viernes.'
    }
  ],
  crew: [
    {
      id: 'irene',
      name: 'Irene',
      relation: 'Basket · Forever young',
      message: 'Nunca hace trampas ni faltas en baloncesto… jeje. (Guiño de Irene.)',
      fullMessage: 'Que nunca hace trampas ni faltas en baloncesto...jeje',
      quote: 'Lo que tú digas!!'
    },
    {
      id: 'alberto',
      name: 'Alberto',
      relation: 'Barrio · Multideporte',
      message: 'Más brava que las papas.',
      fullMessage: 'Más brava que las papas',
      quote: 'Más roja que el tomate'
    },
    {
      id: 'ana',
      name: 'Ana',
      relation: 'Compañera de viaje a Marina d’Or · Amiga de Marta',
      message: 'Divertidísima y dicharachera.',
      fullMessage: 'Divertidisima y dicharachera'
    },
    {
      id: 'sonia',
      name: 'Sonia',
      relation: 'Amiga a través de Marta',
      message: 'La persona con más energía y ganas de hablar y conocer gente que conozco.',
      fullMessage: 'la persona con más energía y ganas de hablar y conocer gente que conozco'
    },
    {
      id: 'arantxa',
      name: 'Arantxa',
      relation: 'Laboratorio · Turno de tarde',
      message: 'Su curiosidad, su sabiduría y el querer aportar hacia los demás para ayudar. Siempre busca un porqué de las cosas.',
      fullMessage: 'Su curiosidad, su sabiduría el querer saber y sobre todo el querer aportar hacia los demás para ayudar a esa persona… siempre busca un porqué de las cosas. Me encanta !!! Luego añadimos que es súper simpática pues coctel perfecto para quien está aprendiendo !!',
      quote: 'Pues eso digo yo !!!!'
    },
    {
      id: 'marta-clinico',
      name: 'Marta del clínico',
      relation: 'Amiga del clínico',
      message: 'Es la doctora liendres, de todo sabe.',
      fullMessage: 'Es la doctora liendres , de todo sabe',
      quote: 'Los sindicatos jaja'
    },
    {
      id: 'novio',
      name: 'Tu compañero de aventuras',
      relation: 'Tu novio',
      message: 'Te contagia su alegría y ganas de hacer cosas. Puedes contar con ella: te va a escuchar y no te va a juzgar.',
      fullMessage: 'Es una persona muy alegre, que te contagia su alegría y ganas de hacer cosas. Es increíblemente buena para dar argumentos sólidos en cualquier tipo de debate. Se preocupa mucho por la gente y puedes contar con ella para lo que quieras, te va a escuchar y no te va a juzgar. Es una persona muy trabajadora y que además busca el sentido de todo lo que hace, es muy reflexiva y filosófica.',
      quote: 'No sé si me explico'
    },
    {
      id: 'patri',
      name: 'Patri',
      relation: 'Tu tripulación',
      message: 'Espontaneidad e inteligencia mezclada con expresiones del Usera profundo.',
      fullMessage: 'Espontaneidad e inteligencia mezclada con expresiones del Usera profundo',
      quote: 'Rata de cloaca'
    },
    {
      id: 'tamara',
      name: 'Tamara',
      relation: 'Amiga del barrio',
      message: 'Sus valores de justicia y solidaridad. Tener energía para dar y regalar. Su mirada y escucha que conecta con la gente.',
      fullMessage: 'Hablar alto y no tener pelos en la lengua. Sus valores de justicia y solidaridad. Tener energía para dar y regalar. Su mirada y escucha que conecta con la gente y la dignidad humana. La fiestaaaaa. Es muy sexyyyy.',
      quote: 'Vamos, nos ha jodido!'
    },
    {
      id: 'marta-basket',
      name: 'Marta de basket',
      relation: 'Amiga de basket',
      message: 'Su desparpajo y sinceridad/honestidad frente a los demás.',
      fullMessage: 'Su desparpajo y sinceridad/honestidad frente a los demás',
      quote: 'Itadakimasuu'
    },
    {
      id: 'vero',
      name: 'Vero',
      relation: 'Amiga desde la infancia',
      message: 'La principal es la lealtad: siempre está en los buenos y en los malos momentos.',
      fullMessage: 'La definen muchas cosas, pero la principal es la lealtad, siempre está en los bueno y en los malos momentos.',
      quote: 'Todo va a salir bien'
    }
  ]
};
