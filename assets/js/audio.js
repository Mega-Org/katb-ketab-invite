/**
 * Background audio player.
 * Starts with the intro video and reveals its controls after the invitation opens.
 */
(function () {
  const cfg = window.INVITE_CONFIG?.audio;
  const player = document.getElementById('audio-player');
  const audio = document.getElementById('bg-audio');
  const toggleBtn = document.getElementById('audio-toggle');
  const nextBtn = document.getElementById('audio-next');

  if (!cfg || !audio) return;

  let inviteOpened = false;
  let errorSkips = 0;
  let fadeRaf = 0;

  let index = Math.max(
    0,
    cfg.tracks.findIndex((t) => t.id === cfg.defaultTrackId)
  );
  if (index < 0) index = 0;

  function currentTrack() {
    return cfg.tracks[index];
  }

  function showPlayer() {
    if (player) player.hidden = false;
  }

  function syncToggleUi() {
    if (!toggleBtn) return;
    const playing = !audio.paused && !audio.ended;
    toggleBtn.setAttribute('aria-pressed', String(playing));
    toggleBtn.classList.toggle('is-playing', playing);
    toggleBtn.classList.toggle('is-paused', !playing);
    toggleBtn.setAttribute(
      'aria-label',
      playing ? 'كتم الموسيقى' : 'تشغيل الموسيقى'
    );
  }

  function loadTrack() {
    const track = currentTrack();
    if (!track) return;
    audio.src = track.src;
    audio.load();
  }

  function fadeIn() {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    audio.volume = 0;
    const duration = cfg.fadeInMs || 3000;
    const started = performance.now();
    function step(now) {
      const t = Math.max(0, Math.min(1, (now - started) / duration));
      audio.volume = t;
      if (t < 1) fadeRaf = requestAnimationFrame(step);
      else fadeRaf = 0;
    }
    fadeRaf = requestAnimationFrame(step);
  }

  async function play() {
    try {
      await audio.play();
      fadeIn();
    } catch {
      /* Autoplay still blocked — UI remains for manual play */
    }
    if (inviteOpened) showPlayer();
    syncToggleUi();
  }

  function pause() {
    audio.pause();
    syncToggleUi();
  }

  function toggle() {
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  }

  function next(opts) {
    const forcePlay = opts?.forcePlay === true;
    const wasPlaying = !audio.paused;
    if (!cfg.tracks.length) return;
    index = (index + 1) % cfg.tracks.length;
    loadTrack();
    if (forcePlay || wasPlaying) play();
    else syncToggleUi();
  }

  function advanceOnError() {
    if (!cfg.tracks.length) return;
    errorSkips += 1;
    if (errorSkips >= cfg.tracks.length) {
      errorSkips = 0;
      syncToggleUi();
      return;
    }
    /* Missing file (e.g. my-song) or decode error — try the next track */
    next({ forcePlay: inviteOpened });
  }

  loadTrack();
  syncToggleUi();
  if (nextBtn) nextBtn.hidden = cfg.tracks.length < 2;

  toggleBtn?.addEventListener('click', toggle);
  nextBtn?.addEventListener('click', () => next());

  audio.addEventListener('play', syncToggleUi);
  audio.addEventListener('pause', syncToggleUi);
  audio.addEventListener('playing', () => {
    errorSkips = 0;
    syncToggleUi();
  });
  audio.addEventListener('error', advanceOnError);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) pause();
  });

  window.addEventListener('invite:intro-started', play);
  window.addEventListener('invite:intro-failed', pause);

  window.addEventListener('invite:opened', () => {
    inviteOpened = true;
    showPlayer();
    if (audio.paused) play();
    else syncToggleUi();
  });

  window.InviteAudio = { play, toggle, next, pause };
})();
