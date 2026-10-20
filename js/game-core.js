/* Reglas de la aventura, independientes de la interfaz y sin dependencias. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LorenaGame = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const STORAGE_KEY = 'lorena-pirate-game-v2';
  const SCHEMA_VERSION = 2;
  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
  const permutation = (items, size) => Array.isArray(items) && items.length === size &&
    new Set(items).size === size && items.every((n) => Number.isInteger(n) && n >= 0 && n < size);

  function shuffle(size, random = Math.random) {
    const items = range(size);
    for (let i = size - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    if (items.every((n, i) => n === i) && size > 1) [items[0], items[1]] = [items[1], items[0]];
    return items;
  }

  function initialState(data, random) {
    return {
      schemaVersion: SCHEMA_VERSION,
      contentVersion: data.version,
      screen: 'intro',
      activeChallenge: data.challenges[0].id,
      completed: [],
      games: {
        portrait: { order: shuffle(9, random) },
        ports: { matched: [] },
        phrases: { index: 0, answers: {} },
        bottles: { index: 0, answers: {} },
        tavern: { slots: [] }
      }
    };
  }

  function solved(data, state, id) {
    const challenge = data.challenges.find((item) => item.id === id);
    const game = state.games[id];
    if (!challenge || !game) return false;
    if (challenge.type === 'puzzle') return permutation(game.order, 9) && game.order.every((n, i) => n === i);
    if (challenge.type === 'match') return challenge.pairs.every((pair) => game.matched.includes(pair.id));
    if (challenge.type === 'quiz') return challenge.questions.every((q) => game.answers[q.id] === q.correctId);
    if (challenge.type === 'letters') return game.slots.length === challenge.answer.length &&
      game.slots.map((i) => challenge.letters[i]).join('') === challenge.answer;
    return false;
  }

  function restoreState(data, input, random) {
    const state = initialState(data, random);
    let raw;
    try { raw = typeof input === 'string' ? JSON.parse(input) : input; } catch (_) { return state; }
    if (!isObject(raw) || raw.schemaVersion !== SCHEMA_VERSION || raw.contentVersion !== data.version ||
        !isObject(raw.games)) return state;
    const puzzle = raw.games.portrait;
    if (isObject(puzzle) && permutation(puzzle.order, 9)) state.games.portrait.order = puzzle.order.slice();
    const ports = data.challenges.find((c) => c.id === 'ports');
    if (Array.isArray(raw.games.ports?.matched)) {
      state.games.ports.matched = [...new Set(raw.games.ports.matched)].filter((id) => ports.pairs.some((p) => p.id === id));
    }
    for (const challenge of data.challenges.filter((c) => c.type === 'quiz')) {
      const saved = raw.games[challenge.id];
      const game = state.games[challenge.id];
      if (!isObject(saved)) continue;
      // Sólo se conservan respuestas correctas y consecutivas; nunca se restaura una puntuación falsa.
      for (const q of challenge.questions) {
        if (saved.answers?.[q.id] !== q.correctId) break;
        game.answers[q.id] = q.correctId;
      }
      const firstUnanswered = challenge.questions.findIndex((q) => game.answers[q.id] !== q.correctId);
      const lastAllowed = firstUnanswered < 0 ? challenge.questions.length - 1 : firstUnanswered;
      game.index = Number.isInteger(saved.index) ? Math.max(0, Math.min(saved.index, lastAllowed)) : lastAllowed;
    }
    const tavern = data.challenges.find((c) => c.id === 'tavern');
    if (Array.isArray(raw.games.tavern?.slots)) {
      state.games.tavern.slots = [...new Set(raw.games.tavern.slots)]
        .filter((i) => Number.isInteger(i) && i >= 0 && i < tavern.letters.length).slice(0, tavern.answer.length);
    }
    for (const challenge of data.challenges) {
      if (!Array.isArray(raw.completed) || !raw.completed.includes(challenge.id) || !solved(data, state, challenge.id)) break;
      state.completed.push(challenge.id);
    }
    // Los datos de pruebas bloqueadas no se usan para saltar etapas.
    const firstPending = state.completed.length;
    const fresh = initialState(data, random);
    data.challenges.forEach((c, index) => {
      if (index > firstPending) state.games[c.id] = fresh.games[c.id];
    });
    const activeIndex = data.challenges.findIndex((c) => c.id === raw.activeChallenge);
    state.activeChallenge = activeIndex >= 0 && activeIndex <= firstPending
      ? raw.activeChallenge : data.challenges[Math.min(firstPending, data.challenges.length - 1)].id;
    const allowedScreens = ['intro', 'map', 'passport', 'challenge', 'gift', 'crew'];
    state.screen = allowedScreens.includes(raw.screen) ? raw.screen : 'intro';
    if (['gift', 'crew'].includes(state.screen) && state.completed.length !== data.challenges.length) state.screen = 'map';
    return state;
  }

  function createEngine(data, saved, random = Math.random) {
    let state = restoreState(data, saved, random);
    const challengeById = (id) => data.challenges.find((c) => c.id === id);
    const canPlay = (id) => {
      const index = data.challenges.findIndex((c) => c.id === id);
      return index >= 0 && data.challenges.slice(0, index).every((c) => state.completed.includes(c.id));
    };
    const editable = (id) => canPlay(id) && !state.completed.includes(id);
    const canReveal = () => data.challenges.every((c) => state.completed.includes(c.id));
    const finish = (id) => {
      if (!canPlay(id) || !solved(data, state, id)) return false;
      if (!state.completed.includes(id)) state.completed.push(id);
      return true;
    };
    return {
      get state() { return state; },
      canPlay,
      canReveal,
      isSolved: (id) => solved(data, state, id),
      finish,
      navigate(screen, id) {
        if (!['intro', 'map', 'passport', 'challenge', 'gift', 'crew'].includes(screen)) return false;
        if (screen === 'challenge' && !canPlay(id)) return false;
        if (['gift', 'crew'].includes(screen) && !canReveal()) return false;
        state.screen = screen;
        if (screen === 'challenge') state.activeChallenge = id;
        return true;
      },
      swapTiles(a, b) {
        if (!editable('portrait') || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a > 8 || b > 8) return false;
        const order = state.games.portrait.order;
        [order[a], order[b]] = [order[b], order[a]];
        return true;
      },
      matchPort(pairId, destinationId) {
        const challenge = challengeById('ports');
        const current = challenge.pairs.find((p) => !state.games.ports.matched.includes(p.id));
        if (!editable('ports') || !current || current.id !== pairId || destinationId !== current.id) return false;
        state.games.ports.matched.push(current.id);
        return true;
      },
      answer(id, questionId, optionId) {
        const challenge = challengeById(id);
        if (!editable(id) || challenge?.type !== 'quiz') return false;
        const game = state.games[id];
        const q = challenge.questions[game.index];
        if (!q || q.id !== questionId || optionId !== q.correctId) return false;
        game.answers[q.id] = q.correctId;
        return true;
      },
      advanceQuiz(id) {
        const challenge = challengeById(id);
        if (!editable(id) || challenge?.type !== 'quiz') return 'blocked';
        const game = state.games[id];
        const q = challenge.questions[game.index];
        if (game.answers[q.id] !== q.correctId) return 'blocked';
        if (game.index < challenge.questions.length - 1) { game.index += 1; return 'next'; }
        return finish(id) ? 'complete' : 'blocked';
      },
      addLetter(index) {
        const challenge = challengeById('tavern');
        const slots = state.games.tavern.slots;
        if (!editable('tavern') || !Number.isInteger(index) || index < 0 || index >= challenge.letters.length ||
            slots.includes(index) || slots.length >= challenge.answer.length) return false;
        slots.push(index);
        return true;
      },
      removeLetter(slot) {
        const slots = state.games.tavern.slots;
        if (!editable('tavern') || !Number.isInteger(slot) || slot < 0 || slot >= slots.length) return false;
        slots.splice(slot, 1);
        return true;
      },
      clearLetters() {
        if (!editable('tavern')) return false;
        state.games.tavern.slots = [];
        return true;
      },
      reset() { state = initialState(data, random); return state; },
      serialize() { return JSON.stringify(state); }
    };
  }

  return { STORAGE_KEY, SCHEMA_VERSION, createEngine, initialState, restoreState, shuffle };
});
