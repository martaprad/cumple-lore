window.LorenaSound = (() => {
  'use strict';

  const ROOT = './assets/audio/';
  const PREF_KEY = 'lorena-audio-enabled';

  const track = (file, volume, loop = true) => ({
    file,
    volume,
    loop
  });

  const MUSIC = {
    opening: track('opening.mp3', 0.35, false),
    map: track('pirata.mp3', 0.12),
    portrait: track('misterio.mp3', 0.14),
    ports: track('pirata.mp3', 0.14),
    phrases: track('misterio.mp3', 0.12),
    bottles: track('misterio.mp3', 0.09),
    tavern: track('misterio.mp3', 0.18),
    gift: track('alternativa_pirata.mp3', 0.12, false),
    crew: track('pirata.mp3', 0.08)
  };

  const EFFECTS = {
    victory: track('victoria_corta.wav', 0.65, false),
    correct: track('acierto.wav', 0.90, false),
    chest: track('cofre.wav', 1.00, false)
  };

  const music = new Audio();
  const effect = new Audio();

  music.preload = 'auto';
  effect.preload = 'auto';

  let enabled = true;
  let currentMusic = null;
  let musicRevision = 0;
  let effectRevision = 0;
  let needsGesture = false;
  let resumeOnReturn = false;

  try {
    enabled = localStorage.getItem(PREF_KEY) !== 'off';
  } catch (_) {
    // Se puede jugar aunque el navegador no guarde preferencias.
  }

  function updateButton() {
    const button = document.getElementById('audio-toggle');
    if (!button) return;

    const active = enabled && !needsGesture;

    button.textContent = active
      ? 'Silenciar'
      : 'Activar sonido';

    button.setAttribute('aria-pressed', String(active));
  }

  function showStatus(message = '') {
    const status = document.getElementById('audio-status');
    if (!status) return;

    status.textContent = message;
    status.hidden = !message;
  }

  function playSafely(element, revision, isMusic) {
    if (!enabled || document.hidden) return;

    const stillCurrent = () => revision === (
      isMusic ? musicRevision : effectRevision
    );

    function failed(error) {
      if (!stillCurrent() || error.name === 'AbortError') return;

      if (error.name === 'NotAllowedError') {
        needsGesture = true;
        showStatus('Pulsa «Activar sonido» para escuchar la música.');
      } else {
        showStatus(
          'No se ha podido cargar un audio. Puedes seguir jugando.'
        );
        console.warn('Audio no disponible:', error.name);
      }

      updateButton();
    }

    try {
      // La llamada a play ocurre inmediatamente, sin un await previo.
      const pending = element.play();

      Promise.resolve(pending).then(() => {
        if (!stillCurrent()) return;

        if (isMusic) {
          needsGesture = false;
          showStatus();
          updateButton();
        }
      }).catch(failed);
    } catch (error) {
      failed(error);
    }
  }

  function stopEffect() {
    effectRevision += 1;
    effect.pause();
  }

  function setMusic(id) {
    // Al cambiar de pantalla, se cancela cualquier efecto anterior.
    stopEffect();

    // Pedir la misma música no la devuelve al principio.
    if (id === currentMusic) return;

    musicRevision += 1;
    music.pause();
    currentMusic = id;
    resumeOnReturn = false;

    const config = MUSIC[id];
    if (!config) return;

    music.src = ROOT + config.file;
    music.loop = config.loop;
    music.volume = config.volume;

    if (document.hidden) {
      resumeOnReturn = enabled;
    } else {
      playSafely(music, musicRevision, true);
    }
  }

  function playEffect(id) {
    stopEffect();

    const config = EFFECTS[id];
    if (!config || !enabled || document.hidden) return;

    effect.src = ROOT + config.file;
    effect.loop = false;
    effect.volume = config.volume;

    playSafely(effect, effectRevision, false);
  }

  function setEnabled(value) {
    enabled = value;
    needsGesture = false;
    resumeOnReturn = false;

    try {
      localStorage.setItem(PREF_KEY, enabled ? 'on' : 'off');
    } catch (_) {}

    if (!enabled) {
      musicRevision += 1;
      music.pause();
      stopEffect();
      showStatus();
    } else if (currentMusic) {
      if (music.error) music.load();
      playSafely(music, musicRevision, true);
    }

    updateButton();
  }

  function toggle() {
    setEnabled(!enabled || needsGesture);
  }

  function pauseForVisibility() {
    resumeOnReturn = resumeOnReturn || (
      enabled && !music.paused
    );

    musicRevision += 1;
    music.pause();
    stopEffect();
  }

  function resumeAfterVisibility() {
    if (document.hidden || !resumeOnReturn) return;

    resumeOnReturn = false;

    if (enabled && currentMusic && !music.ended) {
      playSafely(music, musicRevision, true);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseForVisibility();
    else resumeAfterVisibility();
  });

  window.addEventListener('pagehide', pauseForVisibility);
  window.addEventListener('pageshow', resumeAfterVisibility);

  music.addEventListener('ended', () => {
    // Cuando acaba la entrada, pasa al ambiente del mapa.
    if (currentMusic === 'opening') setMusic('map');
  });

  document.getElementById('audio-toggle')
    ?.addEventListener('click', toggle);

  updateButton();

  return {
    music: setMusic,
    effect: playEffect,
    stopEffects: stopEffect,
    stopAll() {
      setMusic(null);
      resumeOnReturn = false;
    }
  };
})();