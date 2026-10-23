/* Interfaz de Operación Lorena. Abrir index.html; no requiere compilación. */
(() => {
  'use strict';
  const DATA = window.LORENA_DATA;
  const CORE = window.LorenaGame;
  const $ = (id) => document.getElementById(id);
  let storageAvailable = true;
  let saved = null;
  try { saved = localStorage.getItem(CORE.STORAGE_KEY); } catch (_) { storageAvailable = false; }
  const game = CORE.createEngine(DATA, saved);
  const sound = window.LorenaSound;

  // Los sellos recuperados de una partida guardada no vuelven a sonar.
  const celebratedSeals = new Set(game.state.completed);

  function syncAudio({ opening = false } = {}) {
    const state = game.state;

    if (state.screen === 'challenge') {
      const completed = state.completed.includes(
        state.activeChallenge
      );

      sound.music(completed ? null : state.activeChallenge);
      return;
    }

    if (state.screen === 'intro') {
      sound.music(opening ? 'opening' : 'map');
      return;
    }

    if (state.screen === 'gift') {
      sound.music('gift');
      return;
    }

    if (state.screen === 'crew') {
      sound.music('crew');
      return;
    }

    sound.music('map');
  }

  $('hero-portrait').src = DATA.photos.hero;
  $('hero-portrait').alt = DATA.photos.heroAlt || 'Retrato de Lorena';
  const photos = {};
  let confettiTimer = null;
  let ui = freshUI();

  function freshUI() {
    return { tile: null, selected: null, error: '', portReveal: null, hints: new Set(), preview: false };
  }
  function node(tag, className, text, attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) element.setAttribute(key, String(value));
    });
    return element;
  }
  function button(text, classes, action, attributes = {}) {
    const element = node('button', classes, text, { type: 'button', ...attributes });
    element.addEventListener('click', action);
    return element;
  }
  function author(id) { return DATA.crew.find((person) => person.id === id)?.name || 'Tu tripulación'; }
  function announce(text) { $('announcer').textContent = text; }
  function save() {
    try { localStorage.setItem(CORE.STORAGE_KEY, game.serialize()); storageAvailable = true; }
    catch (_) { storageAvailable = false; }
    const notice = $('storage-notice');
    notice.hidden = storageAvailable;
    notice.textContent = storageAvailable ? '' : 'Este navegador no está guardando la partida. Puedes seguir jugando; evita cerrar o recargar la página.';
  }
  function progressPanel() {
    const panel = node('div', 'progress-panel');
    panel.append(node('p', 'eyebrow', 'El botín de la capitana'));
    panel.append(node('h2', '', `${game.state.completed.length} de ${DATA.challenges.length} sellos`));
    const meter = node('div', 'progress-meter', null, {
      role: 'progressbar', 'aria-label': 'Pruebas completadas',
      'aria-valuemin': 0, 'aria-valuemax': DATA.challenges.length, 'aria-valuenow': game.state.completed.length
    });
    const fill = node('span');
    fill.style.width = `${game.state.completed.length / DATA.challenges.length * 100}%`;
    meter.append(fill);
    panel.append(meter, node('p', 'progress-text', game.canReveal()
      ? 'La ruta está completa. El tesoro te espera.'
      : 'Cada prueba guarda un recuerdo. Cada recuerdo, un sello para abrir el cofre.'));
    return panel;
  }
  function heading(title, eyebrow, lead, id) {
    const header = node('header', 'screen-heading');
    header.append(node('p', 'eyebrow', eyebrow), node('h1', '', title, { id, tabindex: -1 }));
    if (lead) header.append(node('p', 'lead', lead));
    return header;
  }
  function routeStatus(id) {
    if (game.state.completed.includes(id)) return 'completed';
    return game.canPlay(id) ? 'available' : 'locked';
  }
  function statusText(id) {
    return { completed: 'Sello conseguido', available: 'Lista para jugar', locked: 'Completa la escala anterior' }[routeStatus(id)];
  }
  function nextPending() { return DATA.challenges.find((c) => !game.state.completed.includes(c.id)); }
  function go(screen, id) {
    if (!game.navigate(screen, id)) { announce('Completa primero las pruebas anteriores.'); return; }
    ui = freshUI();
    clearConfetti();
    save();
    renderScreen(true);
    syncAudio();
    if (screen === 'gift') {
      sound.effect('chest');
      celebrate();
    }
  }
  function renderScreen(focus = false) {
    document.querySelectorAll('.screen').forEach((screen) => { screen.hidden = true; });
    const current = game.state.screen;
    const screen = $(`screen-${current}`);
    screen.hidden = false;
    $('header-progress').textContent = `${game.state.completed.length} / ${DATA.challenges.length} sellos`;
    $('header-progress').setAttribute('aria-label', `${game.state.completed.length} de ${DATA.challenges.length} sellos obtenidos`);
    $('nav-map').setAttribute('aria-current', current === 'map' ? 'page' : 'false');
    $('nav-passport').setAttribute('aria-current', current === 'passport' ? 'page' : 'false');
    $('start-adventure').textContent = game.canReveal() ? 'Volver al tesoro →' : game.state.completed.length ? 'Continuar la aventura →' : 'Comenzar la aventura →';
    if (current === 'map') renderMap();
    if (current === 'passport') renderPassport();
    if (current === 'challenge') renderChallenge();
    if (current === 'gift') renderGift();
    if (current === 'crew') renderCrew();
    document.title = `${screen.querySelector('h1')?.textContent || DATA.title} · Operación Lorena`;
    if (focus) {
      screen.querySelector('h1')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  function renderMap() {
    const screen = $('screen-map');
    screen.replaceChildren(heading('La ruta hacia tu tesoro', 'El mapa de la tripulación',
      'Sigue las cinco escalas. Puedes volver a los recuerdos que ya has descubierto cuando quieras.', 'map-title'));
    const layout = node('div', 'map-layout');
    const list = node('ol', 'map-route');
    DATA.challenges.forEach((challenge, index) => {
      const item = node('li', 'route-stop', null, { 'data-status': routeStatus(challenge.id) });
      const card = button('', 'route-card', () => go('challenge', challenge.id), { 'data-challenge': challenge.id });
      card.disabled = !game.canPlay(challenge.id);
      card.append(node('span', 'route-number', game.state.completed.includes(challenge.id) ? '✓' : String(index + 1).padStart(2, '0'), { 'aria-hidden': true }));
      const copy = node('span', 'route-copy');
      copy.append(node('strong', '', challenge.title), node('small', '', challenge.description));
      card.append(copy, node('span', 'route-state', statusText(challenge.id)));
      item.append(card);
      list.append(item);
    });
    const aside = node('aside', 'map-summary');
    aside.append(progressPanel());
    const note = node('div', 'game-card');
    note.append(node('p', 'eyebrow', 'Reglas de cubierta'), node('h2', '', 'Aquí se juega con cariño.'),
      node('p', '', 'No hay cuenta atrás ni vidas que perder. Si un recuerdo se resiste, pide una pista y vuelve a probar.'),
      node('p', 'muted', 'La partida se guarda en este navegador. Puedes hacer una pausa y volver a la misma ruta.'));
    aside.append(note);
    if (game.canReveal()) aside.append(button('Abrir mi tesoro →', 'btn btn-primary', () => go('gift'), { id: 'map-open-gift' }));
    layout.append(list, aside);
    screen.append(layout);
  }
  function renderPassport() {
    const screen = $('screen-passport');
    screen.replaceChildren(heading('Pasaporte de la capitana', 'Documento de abordo',
      'Una vida de historias. Una tripulación que las recuerda contigo.', 'passport-title'));
    const card = node('div', 'passport-card parchment');
    const top = node('div', 'passport-top');
    const portrait = node('div', 'passport-portrait');
    portrait.append(node('img', '', null, { src: DATA.photos.hero, alt: DATA.photos.heroAlt || 'Retrato de Lorena', width: 1024, height: 1024 }));
    const identity = node('div', 'passport-identity');
    identity.append(node('p', 'eyebrow', 'Permiso para vivir mil aventuras'), node('h2', '', 'Lorena'), node('p', 'lead', 'Capitana de esta historia'));
    const fields = node('div', 'passport-fields');
    const dl = node('dl');
    // ${DATA.crew.length} en lugar de "muchos" complices para poner el número
    const entries = [['Expedición', 'El tesoro de los 40'], ['Tripulación', `muchos cómplices`], ['Rango', game.canReveal() ? 'Leyenda de los siete mares' : 'Capitana en misión'], ['Sellos', `${game.state.completed.length} de ${DATA.challenges.length}`]];
    entries.forEach(([name, value]) => { const group = node('div'); group.append(node('dt', '', name), node('dd', '', value)); dl.append(group); });
    fields.append(dl); identity.append(fields); top.append(portrait, identity);
    const seals = node('ol', 'seal-list', null, { 'aria-label': 'Sellos del pasaporte' });
    DATA.challenges.forEach((challenge, index) => {
      const earned = game.state.completed.includes(challenge.id);
      const seal = node('li', 'seal-token', null, { 'data-earned': earned });
      seal.append(node('span', '', earned ? '✦' : String(index + 1).padStart(2, '0'), { 'aria-hidden': true }), node('strong', '', challenge.title), node('small', '', earned ? 'Conseguido' : 'Por descubrir'));
      seals.append(seal);
    });
    card.append(top, seals);
    screen.append(card, button('Volver a la ruta →', 'btn btn-primary', () => go('map')));
  }
  function miniRoute() {
    const sidebar = node('aside', 'challenge-sidebar');
    const details = node('details', 'route-details');
    // En escritorio permanece abierta; en pantallas pequeñas puede plegarse.
    details.open = window.matchMedia('(min-width: 1100px)').matches;
    details.append(node('summary', '', `Tu ruta · ${game.state.completed.length} / ${DATA.challenges.length} sellos`));
    const list = node('ol', 'mini-route');
    DATA.challenges.forEach((challenge, index) => {
      const item = node('li');
      const link = button('', 'mini-route-btn', () => go('challenge', challenge.id), {
        'data-status': routeStatus(challenge.id), 'data-challenge': challenge.id,
        'aria-current': game.state.activeChallenge === challenge.id ? 'step' : 'false'
      });
      link.disabled = !game.canPlay(challenge.id);
      link.append(node('span', 'mini-route-number', game.state.completed.includes(challenge.id) ? '✓' : index + 1, { 'aria-hidden': true }), node('span', 'mini-route-label', challenge.title));
      item.append(link); list.append(item);
    });
    details.append(list, button('Ver el mapa', 'btn btn-ghost', () => go('map')));
    sidebar.append(details);
    return sidebar;
  }
  function rerenderChallenge(focusKey) {
    const key = focusKey || document.activeElement?.dataset.focus;
    renderChallenge();
    if (key) {
      const target = Array.from($('screen-challenge').querySelectorAll('[data-focus]')).find((item) => item.dataset.focus === key);
      if (target && !target.disabled) target.focus({ preventScroll: true });
    }
  }
  function renderChallenge() {
    const challenge = DATA.challenges.find((c) => c.id === game.state.activeChallenge);
    if (!challenge || !game.canPlay(challenge.id)) { go('map'); return; }
    const screen = $('screen-challenge');
    const layout = node('div', 'adventure-layout');
    const main = node('div', 'challenge-main');
    const header = node('header', 'challenge-header');
    const index = DATA.challenges.indexOf(challenge);
    header.append(node('p', 'eyebrow', `Escala ${String(index + 1).padStart(2, '0')} de ${String(DATA.challenges.length).padStart(2, '0')}`),
      node('h1', '', challenge.title, { id: 'challenge-title', tabindex: -1 }), node('p', 'lead', challenge.description));
    main.append(header);
    const content = node('div', 'challenge-content');
    if (game.state.completed.includes(challenge.id)) content.append(completionCard(challenge));
    else if (challenge.type === 'puzzle') renderPuzzle(content, challenge);
    else if (challenge.type === 'match') renderPorts(content, challenge);
    else if (challenge.type === 'quiz') renderQuiz(content, challenge);
    else if (challenge.type === 'letters') renderLetters(content, challenge);
    main.append(content);
    layout.append(miniRoute(), main);
    screen.replaceChildren(layout);
  }
  function feedback(text, tone = 'info') { return node('p', 'feedback', text, { 'data-tone': tone }); }
  function hintBox(challenge, text, key = challenge.id) {
    const wrap = node('div', 'hint-box');
    const open = ui.hints.has(key);
    const toggle = button(open ? 'Ocultar pista' : 'Pedir una pista', 'btn btn-ghost', () => {
      if (ui.hints.has(key)) ui.hints.delete(key); else ui.hints.add(key);
      rerenderChallenge(`hint-${key}`);
    }, { 'data-focus': `hint-${key}`, 'aria-expanded': open, 'aria-controls': `hint-text-${key}` });
    wrap.append(toggle);
    const hint = node('p', '', text, { id: `hint-text-${key}` });
    hint.hidden = !open; wrap.append(hint);
    return wrap;
  }
  function fullStory(text, label) {
    const details = node('details', 'full-story');
    details.append(node('summary', '', label || 'Leer el mensaje original'), node('p', '', text));
    return details;
  }
  function ensurePhoto(kind) {
    if (photos[kind]) return photos[kind];
    const config = DATA.photos[kind];
    const record = { status: 'loading', src: config.src, fallback: false };
    photos[kind] = record;
    const image = new Image();
    function refresh() {
      if (kind === 'puzzle' && game.state.screen === 'challenge' && game.state.activeChallenge === 'portrait') rerenderChallenge();
      if (kind === 'finale' && game.state.screen === 'crew') renderCrew();
    }
    image.onload = () => { record.status = 'ready'; record.src = image.src; refresh(); };
    image.onerror = () => {
      if (!record.fallback && config.fallback && config.src !== config.fallback) {
        record.fallback = true; image.src = config.fallback;
      } else { record.status = 'error'; refresh(); }
    };
    image.src = config.src;
    return record;
  }
  function renderPuzzle(container, challenge) {
    const photo = ensurePhoto('puzzle');
    const layout = node('div', 'puzzle-layout');
    const left = node('div');
    left.append(node('p', 'round-count', '9 piezas · Intercambia dos cada vez'));
    const grid = node('div', 'puzzle-grid', null, { role: 'group', 'aria-label': 'Puzle de nueve piezas. Selecciona una y después otra para intercambiarlas.' });
    game.state.games.portrait.order.forEach((piece, position) => {
      const tile = button('', 'puzzle-tile', () => {
        if (ui.tile === null) { ui.tile = position; announce(`Pieza ${piece + 1} seleccionada. Elige otra para intercambiarlas.`); }
        else if (ui.tile === position) { ui.tile = null; announce('Selección cancelada.'); }
        else {
          game.swapTiles(ui.tile, position); ui.tile = null; save();
          if (game.isSolved('portrait')) { complete('portrait'); return; }
          announce('Piezas intercambiadas.');
        }
        rerenderChallenge(`tile-${position}`);
      }, { 'aria-pressed': ui.tile === position, 'aria-label': `Pieza ${piece + 1}, posición ${position + 1} de 9`, 'data-focus': `tile-${position}`, 'data-piece': piece, 'data-position': position });
      tile.disabled = photo.status !== 'ready';
      if (photo.status === 'ready') {
        const img = node('img', 'puzzle-piece-image', null, { src: photo.src, alt: '', draggable: false, 'aria-hidden': true });
        img.style.left = `${-(piece % 3) * 100}%`;
        img.style.top = `${-Math.floor(piece / 3) * 100}%`;
        tile.append(img);
      } else tile.append(node('span', '', photo.status === 'error' ? piece + 1 : '✦', { 'aria-hidden': true }));
      grid.append(tile);
    });
    left.append(grid);
    const right = node('div', 'game-card');
    right.append(node('p', 'eyebrow', 'El primer recuerdo'), node('h2', '', 'Pon cada pieza en su sitio.'),
      node('p', '', 'Toca una pieza y después otra: intercambiarán sus posiciones. No hay un hueco vacío ni necesitas arrastrar.'),
      feedback(ui.tile === null ? 'Elige dos piezas para intercambiarlas.' : 'Primera pieza elegida. Selecciona la segunda.'));
    right.append(button(ui.preview ? 'Ocultar el retrato' : 'Ver el retrato completo', 'btn btn-secondary', () => {
      ui.preview = !ui.preview; rerenderChallenge('photo-reference');
    }, { 'data-focus': 'photo-reference', 'aria-expanded': ui.preview, 'aria-controls': 'photo-reference-image' }));
    const preview = node('div', 'photo-preview', null, { id: 'photo-reference-image' });
    preview.hidden = !ui.preview;
    if (photo.status === 'ready') preview.append(node('img', '', null, { src: photo.src, alt: DATA.photos.puzzle.alt }));
    right.append(preview, hintBox(challenge, challenge.hint));
    if (photo.status === 'loading') right.append(feedback('Recuperando el retrato…'));
    if (photo.status === 'error') {
      grid.querySelectorAll('button').forEach((tile) => { tile.disabled = false; });
      right.append(feedback('El retrato no ha podido cargarse. Puedes completar el puzle ordenando los números del 1 al 9 por filas.', 'info'));
    }
    layout.append(left, right); container.append(layout);
  }
  function renderPorts(container, challenge) {
    const matched = game.state.games.ports.matched;
    const reveal = challenge.pairs.find((p) => p.id === ui.portReveal);
    const current = reveal || challenge.pairs.find((p) => !matched.includes(p.id));
    if (!current) {
      const card = node('div', 'game-card');
      card.append(node('h2', '', 'Todos los recuerdos han vuelto a su puerto.'),
        button('Recoger el sello →', 'btn btn-primary', () => complete(challenge.id), { id: 'answer-action', 'data-focus': 'answer-action' }));
      container.append(card, portsRecap(challenge)); return;
    }
    const layout = node('div', 'ports-layout');
    const question = node('div', 'question-card parchment');
    question.append(node('p', 'question-label', `Recuerdo ${challenge.pairs.indexOf(current) + 1} de ${challenge.pairs.length}`),
      node('h2', '', '¿En qué lugar ocurrió?', { id: 'port-question', tabindex: -1 }), node('blockquote', 'memory-card-text', current.memory));
    const options = node('div', 'destination-grid', null, { role: 'group', 'aria-labelledby': 'port-question' });
    challenge.pairs.slice().sort((a, b) => a.place.localeCompare(b.place, 'es')).forEach((destination) => {
      const selected = ui.selected === destination.id;
      const choice = button(destination.place, 'destination-button', () => {
        ui.selected = destination.id; ui.error = ''; rerenderChallenge(`destination-${destination.id}`);
      }, { 'aria-pressed': selected || reveal?.id === destination.id, 'data-focus': `destination-${destination.id}`, 'data-option': destination.id });
      if (matched.includes(destination.id)) { choice.disabled = true; choice.dataset.result = 'correct'; choice.append(node('span', '', ' ✓', { 'aria-hidden': true })); }
      if (reveal) choice.disabled = true;
      if (selected && ui.error) choice.dataset.result = 'incorrect';
      options.append(choice);
    });
    const actions = node('div', 'challenge-actions');
    const check = button(reveal ? (matched.length === challenge.pairs.length ? 'Recoger el sello →' : 'Siguiente recuerdo →') : 'Comprobar puerto', 'btn btn-primary', () => {
      if (reveal) {
        if (matched.length === challenge.pairs.length) { complete(challenge.id); return; }
        ui = freshUI(); rerenderChallenge(); focusNewQuestion('port-question'); return;
      }
      if (!ui.selected) return;
      if (game.matchPort(current.id, ui.selected)) {
        sound.effect('correct');

        ui.portReveal = current.id; 
        ui.error = ''; 
        save(); 
        announce(`¡Correcto! ${current.place}. ${author(current.authorId)} envió este recuerdo.`);
      } else { ui.error = 'Ese recuerdo sigue buscando puerto. Prueba con otro.'; announce(ui.error); }
      rerenderChallenge('answer-action');
    }, { id: 'answer-action', 'data-focus': 'answer-action' });
    check.disabled = !reveal && !ui.selected;
    actions.append(check);
    const selection = node('div', 'ports-selection');
    selection.append(options, actions);
    if (reveal) selection.append(feedback(`¡Puerto encontrado! Lo recuerda ${author(current.authorId)}.`, 'success'), node('p', '', current.story));
    if (ui.error) selection.append(feedback(ui.error, 'error'));
    if (!reveal) selection.append(hintBox(challenge, challenge.hint));
    layout.append(question, selection); container.append(layout);
    if (matched.length) container.append(portsRecap(challenge));
  }
  function portsRecap(challenge) {
    const wrap = node('div', 'game-card');
    wrap.append(node('h2', '', 'Puertos recuperados'));
    const list = node('ul', 'matched-list');
    challenge.pairs.filter((p) => game.state.games.ports.matched.includes(p.id)).forEach((pair) => {
      const item = node('li');
      item.append(node('strong', '', `${pair.place} · ${author(pair.authorId)}`), node('p', '', pair.memory), fullStory(pair.story, 'Recordar esta historia'));
      list.append(item);
    });
    wrap.append(list); return wrap;
  }
  function renderQuiz(container, challenge) {
    const state = game.state.games[challenge.id];
    const question = challenge.questions[state.index];
    const answered = state.answers[question.id] === question.correctId;
    const card = node('div', 'question-card parchment');
    card.append(node('p', 'question-label', `${challenge.id === 'bottles' ? 'Botella' : 'Frase'} ${state.index + 1} de ${challenge.questions.length}`));
    if (question.story) card.append(node('blockquote', '', question.story));
    card.append(node('h2', '', question.prompt, { id: 'quiz-question', tabindex: -1 }));
    const options = node('div', 'option-grid', null, { role: 'group', 'aria-labelledby': 'quiz-question' });
    question.options.forEach((option, index) => {
      const selected = answered ? option.id === question.correctId : ui.selected === option.id;
      const choice = button('', 'option-button', () => {
        ui.selected = option.id; ui.error = ''; rerenderChallenge(`option-${option.id}`);
      }, { 'aria-pressed': selected, 'data-focus': `option-${option.id}`, 'data-option': option.id });
      choice.append(node('span', 'option-letter', String.fromCharCode(65 + index), { 'aria-hidden': true }), node('span', '', option.text));
      choice.disabled = answered;
      if (answered && selected) choice.dataset.result = 'correct';
      if (!answered && selected && ui.error) choice.dataset.result = 'incorrect';
      options.append(choice);
    });
    card.append(options);
    const actions = node('div', 'challenge-actions');
    const check = button(answered ? (state.index === challenge.questions.length - 1 ? 'Recoger el sello →' : 'Siguiente →') : 'Comprobar respuesta', 'btn btn-primary', () => {
      if (answered) {
        const result = game.advanceQuiz(challenge.id); save(); ui = freshUI();
        if (result === 'complete') { afterCompletion(challenge); return; }
        rerenderChallenge(); focusNewQuestion('quiz-question'); return;
      }
      if (!ui.selected) return;
      if (game.answer(challenge.id, question.id, ui.selected)) { 
        sound.effect('correct');
        ui.error = ''; save(); announce(`¡Correcto! ${question.reveal}`); }
      else { ui.error = 'Casi, capitana. Elige otra opción o pide una pista.'; announce(ui.error); }
      rerenderChallenge('answer-action');
    }, { id: 'answer-action', 'data-focus': 'answer-action' });
    check.disabled = !answered && !ui.selected;
    actions.append(check); card.append(actions);
    if (answered) {
      card.append(feedback(question.reveal, 'success'));
      if (question.fullText) card.append(fullStory(question.fullText, `Leer lo que escribió ${author(question.authorId)}`));
    } else {
      if (ui.error) card.append(feedback(ui.error, 'error'));
      card.append(hintBox(challenge, question.hint || challenge.hint, question.id));
    }
    container.append(card);
  }
  function renderLetters(container, challenge) {
    const slots = game.state.games.tavern.slots;
    const layout = node('div', 'secret-layout');
    const card = node('div', 'game-card');
    card.append(node('p', 'eyebrow', 'La última contraseña'), node('h2', '', 'El nombre que abre el cofre'),
      node('p', '', 'Pulsa las letras en orden. Para quitar una, pulsa su casilla; las demás se recolocarán.'));
    const slotRow = node('div', 'letter-slots', null, { role: 'group', 'aria-label': 'Nombre de la taberna. Seis letras.' });
    Array.from({ length: challenge.answer.length }, (_, index) => {
      const bankIndex = slots[index];
      const text = bankIndex === undefined ? '·' : challenge.letters[bankIndex];
      const slot = button(text, 'letter-slot', () => {
        if (game.removeLetter(index)) { ui.error = ''; save(); rerenderChallenge(`letter-${bankIndex}`); announce('Letra retirada.'); }
      }, { 'data-focus': `slot-${index}`, 'data-slot': index, 'aria-label': bankIndex === undefined ? `Casilla ${index + 1} vacía` : `Quitar ${text} de la casilla ${index + 1}` });
      slot.disabled = bankIndex === undefined; slotRow.append(slot);
    });
    const bank = node('div', 'letter-bank', null, { role: 'group', 'aria-label': 'Letras disponibles' });
    challenge.letters.forEach((letter, index) => {
      const tile = button(letter, 'letter-tile', () => {
        if (game.addLetter(index)) { ui.error = ''; save(); rerenderChallenge(`slot-${game.state.games.tavern.slots.length - 1}`); announce(`Letra ${letter} añadida.`); }
      }, { 'data-focus': `letter-${index}`, 'data-letter': index, 'aria-label': `Añadir letra ${letter}` });
      tile.disabled = slots.includes(index) || slots.length === challenge.answer.length; bank.append(tile);
    });
    const actions = node('div', 'challenge-actions');
    const check = button('Probar la contraseña', 'btn btn-primary', () => {
      if (game.isSolved(challenge.id)) { complete(challenge.id); return; }
      ui.error = 'La cerradura sigue cerrada. Reordena las letras y vuelve a probar.'; announce(ui.error); rerenderChallenge('answer-action');
    }, { id: 'answer-action', 'data-focus': 'answer-action' });
    check.disabled = slots.length !== challenge.answer.length;
    const undo = button('Borrar letras', 'btn btn-secondary', () => { game.clearLetters(); ui.error = ''; save(); rerenderChallenge('letter-0'); }, { 'data-focus': 'clear-letters' });
    undo.disabled = slots.length === 0;
    actions.append(check, undo);
    card.append(slotRow, bank, actions);
    if (ui.error) card.append(feedback(ui.error, 'error'));
    card.append(hintBox(challenge, challenge.hint));
    const clues = node('aside', 'question-card parchment');
    clues.append(node('span', 'treasure-symbol', '⚓', { 'aria-hidden': true }), node('h2', '', 'Dos voces, un lugar'));
    challenge.clues.forEach((clue) => clues.append(node('p', '', clue)));
    layout.append(card, clues); container.append(layout);
  }
  function complete(id) {
    if (!game.finish(id)) { announce('Todavía queda algo por resolver en esta prueba.'); return; }
    save(); afterCompletion(DATA.challenges.find((c) => c.id === id));
  }
  function afterCompletion(challenge) {
    sound.music(null);
    if (!celebratedSeals.has(challenge.id)) {
      celebratedSeals.add(challenge.id);
      sound.effect('victory');
    }

    ui = freshUI(); renderScreen();
    $('completion-title')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
    announce(`Sello conseguido. ${challenge.completedMessage}`); celebrate();
  }
  function focusNewQuestion(id) {
    // Tras una historia larga, la siguiente ronda empieza por el principio también en móvil.
    $('screen-challenge').querySelector('.question-card')?.scrollIntoView({ block: 'start', behavior: 'auto' });
    $(id)?.focus({ preventScroll: true });
  }
  function completionCard(challenge) {
    const card = node('div', 'completion-card game-card');
    card.append(node('div', 'completion-seal', '✦', { 'aria-hidden': true }), node('p', 'eyebrow', `Sello ${DATA.challenges.indexOf(challenge) + 1} conseguido`),
      node('h2', '', challenge.completedMessage, { id: 'completion-title', tabindex: -1 }),
      node('p', '', game.canReveal() ? 'Tu pasaporte está completo. Ha llegado el momento de descubrir tu regalo.' : 'Una historia más en tu pasaporte. La siguiente escala ya está disponible.'));
    const actions = node('div', 'challenge-actions');
    const next = nextPending();
    actions.append(button(next ? 'Seguir la aventura →' : 'Abrir mi tesoro →', 'btn btn-primary', () => next ? go('challenge', next.id) : go('gift'), { id: 'continue-adventure' }),
      button('Volver al mapa', 'btn btn-secondary', () => go('map')));
    card.append(actions);
    if (challenge.type === 'puzzle') {
      const photo = ensurePhoto('puzzle');
      if (photo.status === 'ready') { const preview = node('div', 'photo-preview'); preview.append(node('img', '', null, { src: photo.src, alt: DATA.photos.puzzle.alt })); card.append(preview); }
    }
    if (challenge.type === 'match') card.append(portsRecap(challenge));
    if (challenge.type === 'quiz') {
      const recap = node('details', 'full-story');
      recap.append(node('summary', '', 'Volver a leer estos recuerdos'));
      challenge.questions.forEach((q) => {
        const item = node('article');
        item.append(node('h3', '', author(q.authorId)), node('p', '', q.reveal));
        if (q.fullText) item.append(fullStory(q.fullText, 'Leer el texto original'));
        recap.append(item);
      });
      card.append(recap);
    }
    if (challenge.type === 'letters') card.append(feedback(challenge.reveal, 'success'));
    return card;
  }
  function renderGift() {
    if (!game.canReveal()) { go('map'); return; }
    const gift = DATA.gift;
    const screen = $('screen-gift');
    screen.replaceChildren();
    const layout = node('div', 'reveal-grid');
    const visual = node('div', 'reveal-image');
    visual.append(node('img', '', null, { src: gift.image, alt: 'El cofre del tesoro, abierto junto a una playa tropical', width: 1376, height: 768 }));
    const copy = node('div', 'reveal-copy');
    copy.append(node('p', 'eyebrow', 'Cinco sellos · Un regalo enorme'), node('p', 'badge', 'Misión cumplida, capitana'),
      node('h1', '', gift.heading, { id: 'gift-title', tabindex: -1 }), node('h2', '', gift.destination), node('p', 'lead', gift.message));
    const pass = node('div', 'boarding-pass parchment');
    pass.append(node('p', 'eyebrow', 'Tu próximo destino'));
    const dl = node('dl');
    [
      ['Rumbo', `${gift.destination}, ${gift.country}`],
      ['Tripulación viajera', gift.passengers],
      ['Plan', gift.kind]
    ].forEach(([name, value]) => {
      const item = node('div'); item.append(node('dt', '', name), node('dd', '', value)); dl.append(item);
    });
    pass.append(dl); copy.append(pass);
    if (gift.finalClue) copy.append(node('p', 'hint-box', gift.finalClue));
    copy.append(node('p', '', 'El regalo lo has encontrado tú. Las ganas de celebrarte las teníamos todos.'),
      button('Un último mensaje de tu tripulación →', 'btn btn-primary', () => go('crew'), { id: 'meet-crew' }));
    layout.append(visual, copy); screen.append(layout);
  }
  function renderCrew() {
    if (!game.canReveal()) { go('map'); return; }
    const screen = $('screen-crew');
    screen.replaceChildren(heading('El verdadero tesoro: tu tripulación', 'Por todos los recuerdos que nos quedan',
      'Esto es lo que tus amigos han contado de ti. Muchas voces que celebran tu energía, tu curiosidad y esa forma tan tuya de estar en el mundo.', 'crew-title'));
    const intro = node('div', 'crew-intro');
    const photo = ensurePhoto('finale');
    if (photo.status === 'ready') { const frame = node('div', 'crew-photo'); frame.append(node('img', '', null, { src: photo.src, alt: DATA.photos.finale.alt })); intro.append(frame); }
    const message = node('div');
    message.append(node('p', 'eyebrow', 'Una capitana, mil versiones inolvidables'), node('h2', '', 'Felices 40, Lorena.'), node('p', 'lead', 'Gracias por todas las historias que ya compartimos. Que esta nueva aventura sea sólo el principio de muchas más.'));
    intro.append(message); screen.append(intro);
    const grid = node('div', 'crew-grid');
    DATA.crew.forEach((person) => {
      const card = node('article', 'crew-card', null, { 'data-crew': person.id });
      card.append(node('p', 'eyebrow', person.relation), node('h3', '', person.name), node('p', '', person.message));
      if (person.quote) card.append(node('p', 'muted', `Una frase que le recuerda a ti: «${person.quote}»`));
      card.append(fullStory(person.fullMessage, 'Leer su respuesta original'));
      grid.append(card);
    });
    screen.append(grid);
    const actions = node('div', 'button-row');
    actions.append(button('Volver a mi regalo', 'btn btn-primary', () => go('gift')), button('Ver mi pasaporte completo', 'btn btn-secondary', () => go('passport')));
    screen.append(actions);
  }
  function clearConfetti() {
    if (confettiTimer !== null) window.clearTimeout(confettiTimer);
    confettiTimer = null; $('confetti-container').replaceChildren();
  }
  function celebrate() {
    clearConfetti();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 36; i += 1) {
      const piece = node('span', 'confetti-piece');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = ['#d8b86a', '#f5e7c8', '#59a9a1', '#fff'][i % 4];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.animationDuration = `${2.2 + Math.random() * 1.1}s`;
      fragment.append(piece);
    }
    $('confetti-container').append(fragment);
    confettiTimer = window.setTimeout(clearConfetti, 4200);
  }
  function unlock({ playOpening = false } = {}) {
    $('access-screen').hidden = true;
    $('app').hidden = false;
    $('access-password').value = '';
    try { sessionStorage.setItem('grand-line-access', 'true'); } catch (_) { /* La partida sigue disponible en esta pestaña. */ }
    save(); renderScreen(true);
    syncAudio({ opening: playOpening });
  }
  $('access-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('access-password');
    const submit = $('access-button');
    submit.disabled = true; $('access-error').textContent = '';
    try {
      if (!window.crypto?.subtle) throw new Error('crypto-unavailable');
      const bytes = new TextEncoder().encode(input.value);
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      if (hash === window.LORENA_ACCESS_HASH) {
        unlock({ playOpening: true });
      }
      else { $('access-error').textContent = 'Esa clave no abre la pasarela. Vuelve a intentarlo.'; input.value = ''; input.focus(); }
    } catch (_) {
      $('access-error').textContent = 'Este navegador no puede comprobar la clave aquí. Abre el juego en un navegador actualizado mediante HTTPS o un servidor local.';
    } finally { submit.disabled = false; }
  });
  $('brand-home').addEventListener('click', () => go('intro'));
  $('start-adventure').addEventListener('click', () => go(game.canReveal() ? 'gift' : 'map'));
  $('intro-passport').addEventListener('click', () => go('passport'));
  $('nav-map').addEventListener('click', () => go('map'));
  $('nav-passport').addEventListener('click', () => go('passport'));
  $('nav-reset').addEventListener('click', () => {
    const dialog = $('reset-dialog');
    dialog.returnValue = 'cancel';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else if (window.confirm('¿Borrar los sellos y empezar esta partida desde el principio?')) resetGame();
  });
  $('reset-dialog').addEventListener('close', () => { if ($('reset-dialog').returnValue === 'reset') resetGame(); });
  function resetGame() {
    sound.stopAll();
    celebratedSeals.clear();

    clearConfetti(); 
    game.reset(); 
    ui = freshUI();

    ['map', 'passport', 'challenge', 'gift', 'crew'].forEach((screen) => $(`screen-${screen}`).replaceChildren());

    save(); 
    renderScreen(true); 
    
    syncAudio({ opening: true });

    announce('Partida reiniciada. La aventura vuelve a empezar.');
  }
  window.addEventListener('pagehide', clearConfetti);
  try { if (sessionStorage.getItem('grand-line-access') === 'true') unlock(); }
  catch (_) { /* El formulario permite entrar aunque no exista sessionStorage. */ }
})();
