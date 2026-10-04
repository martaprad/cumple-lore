// APPLICATION LOGIC & STATE MACHINE
const ACCESS_PASSWORD_HASH =
  "5dbcc94fbcc8c12c2a9c3821b409a4a7fe1b3c2da0d15bff13f14e4ef84afcf1";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function unlockApp() {
  document.getElementById("access-screen").style.display = "none";
  document.getElementById("app").classList.remove("locked");

  sessionStorage.setItem("grand-line-access", "true");
}

async function checkAccessPassword() {
  const input = document.getElementById("access-password");
  const error = document.getElementById("access-error");

  const password = input.value;
  const passwordHash = await sha256(password);

  if (passwordHash === ACCESS_PASSWORD_HASH) {
    error.classList.remove("visible");
    unlockApp();
  } else {
    error.classList.add("visible");
    input.value = "";
    input.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("access-button");
  const input = document.getElementById("access-password");

  if (sessionStorage.getItem("grand-line-access") === "true") {
    unlockApp();
    return;
  }

  button.addEventListener("click", checkAccessPassword);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAccessPassword();
    }
  });
});

// State Tracker
const state = {
    completedIslands: 0, // 0 to 4
    quizQuestionIdx: 0,
    quizSelectedOpt: null,
    dossierSelectedOpt: null,
    memoryMatchedPairs: 0,
    memoryFlippedCards: []
};

// Quiz Questions Data for Prueba 1
const quizQuestions = [
    {
    question: "¿Qué es más probable que haga Lorena un sábado por la mañana para arrancar el día con energía de capitana?",
    options: [
        { text: "Madrugar con un café épico y planear la próxima gran aventura.", correct: true },
        { text: "Dormir hasta el mediodía con tapones y antifaz.", correct: false },
        { text: "Ver tutoriales de jardinería marina en silencio.", correct: false },
        { text: "Salir a correr 20 km sin avisar a nadie.", correct: false }
    ]
    },
    {
    question: "¿Cuál es el superpoder secreto de Lorena cuando organiza un plan con sus amigos y nakamas?",
    options: [
        { text: "Hacer listas interminables que nadie sigue.", correct: false },
        { text: "Contagiar una energía arrolladora y conseguir que todos se rían hasta llorar.", correct: true },
        { text: "Desaparecer a las 10 de la noche sin despedirse.", correct: false },
        { text: "Llegar siempre una hora antes al punto de encuentro.", correct: false }
    ]
    },
    {
    question: "¿Qué lección pirata resume mejor las cuatro décadas de proezas de Lorena?",
    options: [
        { text: "Que los tesoros más valiosos son las personas con las que compartes el viaje.", correct: true },
        { text: "Que hay que quedarse siempre en aguas tranquilas.", correct: false },
        { text: "Que nunca se debe sonreír ante las tormentas.", correct: false },
        { text: "Que un pirata nunca come postre.", correct: false }
    ]
    }
];

// Navigation Router
function goToScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(scr => {
    scr.classList.add('hidden');
    scr.classList.remove('flex');
    });
    const target = document.getElementById(screenId);
    if (target) {
    target.classList.remove('hidden');
    target.classList.add('flex');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Screen specific initializers
    if (screenId === 'screen-map') updateMapUI();
    if (screenId === 'screen-prueba1') initQuiz();
    if (screenId === 'screen-prueba3') initMemoryGame();
    if (screenId === 'screen-reveal') triggerConfetti();
}

// ==========================================
// MAP SYSTEM & ISLAND UNLOCKS
// ==========================================
function updateMapUI() {
    const counter = document.getElementById('map-progress-counter');
    const progressBar = document.getElementById('mission-progress-bar');
    const percentageLabel = document.getElementById('progress-percentage-label');
    const ctaBtn = document.getElementById('map-primary-cta');
    const ctaText = document.getElementById('map-primary-cta-text');

    const percent = Math.max(5, state.completedIslands * 25);
    progressBar.style.width = percent + '%';
    counter.textContent = `MISIÓN ${state.completedIslands}/4 COMPLETADA`;
    percentageLabel.textContent = `${state.completedIslands * 25}% COMPLETADO`;

    // Island 1
    updateIslandItem(1, 0);
    // Island 2
    updateIslandItem(2, 1);
    // Island 3
    updateIslandItem(3, 2);
    // Island 4
    updateIslandItem(4, 3);

    // Update CTA button based on next incomplete island
    if (state.completedIslands === 0) {
    ctaText.textContent = "ZARPAR A LA PRUEBA 1 (CONOCIMIENTO)";
    } else if (state.completedIslands === 1) {
    ctaText.textContent = "CONTINUAR A LA PRUEBA 2 (ARCHIVO SECRETO)";
    } else if (state.completedIslands === 2) {
    ctaText.textContent = "CONTINUAR A LA PRUEBA 3 (SHARINGAN)";
    } else if (state.completedIslands === 3) {
    ctaText.textContent = "DESAFIAR EL JUTSU FINAL (PRUEBA 4)";
    } else {
    ctaText.textContent = "VER RECOMPENSA DE VIAJE";
    }
}

function updateIslandItem(islandNum, requiredCompletion) {
    const card = document.getElementById(`island-card-${islandNum}`);
    const badge = document.getElementById(`island-status-badge-${islandNum}`);
    const actionIcon = document.getElementById(`island-action-icon-${islandNum}`);

    if (state.completedIslands > requiredCompletion) {
    // Completed
    card.className = "cursor-pointer bg-surface-container-high/60 p-4 rounded-2xl border border-tertiary/40 flex items-center justify-between transition-all shadow-md";
    badge.className = "px-2 py-0.5 rounded text-[9px] font-bold font-cinzel bg-tertiary/20 text-tertiary border border-tertiary/30";
    badge.textContent = "SUPERADA ✓";
    actionIcon.className = "material-symbols-outlined text-tertiary text-[26px]";
    actionIcon.textContent = "check_circle";
    } else if (state.completedIslands === requiredCompletion) {
    // Unlocked and active
    card.className = "cursor-pointer bg-surface-container-high/90 hover:bg-surface-container-highest p-4 rounded-2xl border-2 border-primary/50 flex items-center justify-between transition-all shadow-xl group";
    badge.className = "px-2 py-0.5 rounded text-[9px] font-bold font-cinzel bg-primary/20 text-primary border border-primary/30";
    badge.textContent = "DISPONIBLE";
    actionIcon.className = "material-symbols-outlined text-primary text-[28px]";
    actionIcon.textContent = "play_circle";
    } else {
    // Locked
    card.className = "cursor-not-allowed opacity-60 bg-surface-container/60 p-4 rounded-2xl border border-surface-container-highest flex items-center justify-between transition-all shadow-md";
    badge.className = "px-2 py-0.5 rounded text-[9px] font-bold font-cinzel bg-surface-container text-on-surface-variant";
    badge.textContent = "BLOQUEADA";
    actionIcon.className = "material-symbols-outlined text-on-surface-variant text-[24px]";
    actionIcon.textContent = "lock";
    }
}

function handleIslandClick(islandNum) {
    if (islandNum === 1 && state.completedIslands >= 0) {
    goToScreen('screen-prueba1');
    } else if (islandNum === 2 && state.completedIslands >= 1) {
    goToScreen('screen-prueba2');
    } else if (islandNum === 3 && state.completedIslands >= 2) {
    goToScreen('screen-prueba3');
    } else if (islandNum === 4 && state.completedIslands >= 3) {
    goToScreen('screen-prueba4');
    } else {
    // Shaking feedback for locked island
    const card = document.getElementById(`island-card-${islandNum}`);
    card.classList.add('animate-pulse');
    setTimeout(() => card.classList.remove('animate-pulse'), 500);
    }
}

function startCurrentUnlockedPrueba() {
    if (state.completedIslands === 0) goToScreen('screen-prueba1');
    else if (state.completedIslands === 1) goToScreen('screen-prueba2');
    else if (state.completedIslands === 2) goToScreen('screen-prueba3');
    else if (state.completedIslands === 3) goToScreen('screen-prueba4');
    else goToScreen('screen-reveal');
}

// ==========================================
// PRUEBA 1: TRIVIA INTERACTION
// ==========================================
function initQuiz() {
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quizQuestions[state.quizQuestionIdx];
    document.getElementById('quiz-question-badge').textContent = `PREGUNTA ${state.quizQuestionIdx + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-question-title').textContent = q.question;
    
    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';
    state.quizSelectedOpt = null;

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.className = "w-full py-4 px-6 rounded-2xl bg-surface-container-high text-on-surface-variant/40 font-cinzel font-bold text-base tracking-wider flex items-center justify-center gap-2 transition-all cursor-not-allowed";
    document.getElementById('quiz-next-text').textContent = "SELECCIONA UNA RESPUESTA";

    const feedback = document.getElementById('quiz-feedback-box');
    feedback.classList.add('hidden');

    q.options.forEach((opt, idx) => {
    const letters = ['A', 'B', 'C', 'D'];
    const btn = document.createElement('button');
    btn.className = "quiz-opt-btn text-left p-4 rounded-xl bg-surface-container-high/80 border border-primary/20 text-on-surface hover:bg-surface-container-highest transition-all flex items-start gap-3 active:scale-98";
    btn.innerHTML = `
        <span class="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">${letters[idx]}</span>
        <span class="font-outfit text-xs sm:text-sm leading-relaxed">${opt.text}</span>
    `;
    btn.onclick = () => selectQuizOption(idx, opt.correct, btn);
    container.appendChild(btn);
    });
}

function selectQuizOption(idx, isCorrect, clickedBtn) {
    state.quizSelectedOpt = { idx, isCorrect };

    const allBtns = document.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(b => {
    b.classList.remove('border-primary', 'bg-primary-container/20', 'ring-2', 'ring-primary');
    b.classList.add('border-primary/20');
    });

    clickedBtn.classList.remove('border-primary/20');
    clickedBtn.classList.add('border-primary', 'bg-primary-container/20', 'ring-2', 'ring-primary');

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = false;
    nextBtn.className = "w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary-container via-primary to-yellow-300 text-on-primary font-cinzel font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all hover:brightness-110";
    document.getElementById('quiz-next-text').textContent = state.quizQuestionIdx < quizQuestions.length - 1 ? "SIGUIENTE PREGUNTA" : "COMPLETAR PRUEBA 1";
}

function handleQuizNext() {
    if (!state.quizSelectedOpt) return;

    if (state.quizQuestionIdx < quizQuestions.length - 1) {
    state.quizQuestionIdx++;
    renderQuizQuestion();
    } else {
    // Complete Prueba 1
    goToScreen('screen-result1');
    }
}

function advanceFromPrueba1() {
    if (state.completedIslands < 1) state.completedIslands = 1;
    goToScreen('screen-map');
}

// ==========================================
// PRUEBA 2: ARCHIVO SECRETO
// ==========================================
function selectDossierOption(idx) {
    state.dossierSelectedOpt = idx;
    const btns = document.querySelectorAll('.dossier-option');
    btns.forEach((btn, i) => {
    if (i === idx) {
        btn.classList.add('border-primary', 'bg-primary/20', 'ring-2', 'ring-primary');
    } else {
        btn.classList.remove('border-primary', 'bg-primary/20', 'ring-2', 'ring-primary');
    }
    });

    const confirmBtn = document.getElementById('dossier-confirm-btn');
    confirmBtn.disabled = false;
    confirmBtn.className = "w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-crimson-seal via-red-600 to-crimson-seal text-white font-cinzel font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all hover:brightness-110";
}

function confirmDossierAnswer() {
    const feedback = document.getElementById('dossier-feedback');
    feedback.classList.remove('hidden');
    feedback.textContent = "¡ANÉCDOTA DESCLASIFICADA! Tu tripulación certifica la autenticidad absoluta del incidente.";
    
    setTimeout(() => {
    if (state.completedIslands < 2) state.completedIslands = 2;
    goToScreen('screen-map');
    }, 1500);
}

// ==========================================
// PRUEBA 3: SHARINGAN MEMORY GAME
// ==========================================
const memorySymbols = [
    { id: 1, icon: 'visibility', label: 'Sharingan' },
    { id: 2, icon: 'sailing', label: 'Barco' },
    { id: 3, icon: 'military_tech', label: 'Medalla' },
    { id: 1, icon: 'visibility', label: 'Sharingan' },
    { id: 2, icon: 'sailing', label: 'Barco' },
    { id: 3, icon: 'military_tech', label: 'Medalla' }
];

function initMemoryGame() {
    state.memoryMatchedPairs = 0;
    state.memoryFlippedCards = [];
    document.getElementById('memory-pairs-badge').textContent = "0 / 3 PAREJAS";
    document.getElementById('memory-success-banner').classList.add('hidden');
    
    const nextBtn = document.getElementById('memory-next-btn');
    nextBtn.disabled = true;
    nextBtn.className = "w-full py-4 px-6 rounded-2xl bg-surface-container-high text-on-surface-variant/40 font-cinzel font-bold text-base tracking-wider flex items-center justify-center gap-2 transition-all cursor-not-allowed";

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    // Shuffle symbols
    const shuffled = [...memorySymbols].sort(() => Math.random() - 0.5);

    shuffled.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = "memory-card h-28 rounded-2xl cursor-pointer relative transform-style-3d transition-transform duration-500 shadow-lg";
    card.dataset.id = item.id;
    card.dataset.index = index;

    // Front Face (Hidden initially)
    const front = document.createElement('div');
    front.className = "absolute inset-0 rounded-2xl bg-surface-container-lowest border-2 border-secondary/40 flex flex-col items-center justify-center text-secondary rotate-y-180 backface-hidden shadow-inner";
    front.innerHTML = `<span class="material-symbols-outlined text-[36px]">${item.icon}</span><span class="text-[9px] font-cinzel font-bold mt-1 text-on-surface-variant">${item.label}</span>`;

    // Back Face (Visible cover)
    const back = document.createElement('div');
    back.className = "absolute inset-0 rounded-2xl bg-surface-container-high border border-secondary/30 flex flex-col items-center justify-center text-secondary backface-hidden hover:bg-surface-container-highest transition-colors";
    back.innerHTML = `<span class="material-symbols-outlined text-[30px] opacity-70">lens</span><span class="text-[8px] font-cinzel tracking-widest uppercase opacity-60 mt-1">TOMOE</span>`;

    card.appendChild(front);
    card.appendChild(back);

    card.onclick = () => flipMemoryCard(card, item.id);
    grid.appendChild(card);
    });
}

function flipMemoryCard(cardElement, symbolId) {
    if (cardElement.classList.contains('rotate-y-180') || state.memoryFlippedCards.length >= 2) return;

    cardElement.classList.add('rotate-y-180');
    state.memoryFlippedCards.push({ card: cardElement, id: symbolId });

    if (state.memoryFlippedCards.length === 2) {
    const [c1, c2] = state.memoryFlippedCards;
    if (c1.id === c2.id) {
        // Match
        state.memoryMatchedPairs++;
        document.getElementById('memory-pairs-badge').textContent = `${state.memoryMatchedPairs} / 3 PAREJAS`;
        state.memoryFlippedCards = [];

        if (state.memoryMatchedPairs === 3) {
        document.getElementById('memory-success-banner').classList.remove('hidden');
        const nextBtn = document.getElementById('memory-next-btn');
        nextBtn.disabled = false;
        nextBtn.className = "w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-secondary via-red-500 to-secondary text-white font-cinzel font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all hover:brightness-110";
        }
    } else {
        // No match, flip back
        setTimeout(() => {
        c1.card.classList.remove('rotate-y-180');
        c2.card.classList.remove('rotate-y-180');
        state.memoryFlippedCards = [];
        }, 800);
    }
    }
}

function advanceFromPrueba3() {
    if (state.completedIslands < 3) state.completedIslands = 3;
    goToScreen('screen-map');
}

// ==========================================
// PRUEBA 4: JUTSU FINAL & TRANSITION
// ==========================================
function fillSecretCode(code) {
    document.getElementById('secret-code-input').value = code;
}

function handleJutsuSubmit() {
    const input = document.getElementById('secret-code-input').value.trim().toUpperCase();
    // Allow NAKAMA or 40-LORENA or any input for a celebratory experience
    if (input.length > 0) {
    state.completedIslands = 4;
    startCinematicTransition();
    } else {
    fillSecretCode('NAKAMA');
    state.completedIslands = 4;
    startCinematicTransition();
    }
}

function startCinematicTransition() {
    goToScreen('screen-cinematic');

    const logs = [
    document.getElementById('log-line-1'),
    document.getElementById('log-line-2'),
    document.getElementById('log-line-3'),
    document.getElementById('log-line-4')
    ];
    const prog = document.getElementById('cinematic-progress');
    const heading = document.getElementById('cinematic-heading');

    setTimeout(() => { logs[0].classList.remove('opacity-0'); prog.style.width = '25%'; }, 600);
    setTimeout(() => { logs[1].classList.remove('opacity-0'); prog.style.width = '55%'; }, 1400);
    setTimeout(() => { logs[2].classList.remove('opacity-0'); prog.style.width = '85%'; }, 2200);
    setTimeout(() => { 
    logs[3].classList.remove('opacity-0'); 
    prog.style.width = '100%';
    heading.textContent = "¡ACCESO CONCEDIDO!";
    heading.classList.add('text-primary');
    }, 3000);

    setTimeout(() => {
    goToScreen('screen-reveal');
    }, 3800);
}

// ==========================================
// CONFETTI CELEBRATION
// ==========================================
function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#f2ca50', '#40e0d0', '#ff6b6b', '#ffffff', '#d4af37', '#38bdf8'];

    for (let i = 0; i < 45; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = -20 - Math.random() * 50 + 'px';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 3) + 's';
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    container.appendChild(piece);
    }
}

function resetAdventure() {
    state.completedIslands = 0;
    state.quizQuestionIdx = 0;
    state.quizSelectedOpt = null;
    state.dossierSelectedOpt = null;
    state.memoryMatchedPairs = 0;
    goToScreen('screen-intro');
}