/** A paused envelope, one intentional gesture, then a paper-coloured reveal. */
(function () {
  const root = document.getElementById('intro');
  const video = document.getElementById('intro-video');
  const invite = document.getElementById('invite');
  const startButton = document.getElementById('intro-start');
  const skip = document.getElementById('intro-skip');
  const status = document.getElementById('intro-status');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = 'idle';
  let watchdog;
  const events = ['pointerdown', 'wheel', 'keydown', 'click'];

  function removeTriggers() {
    events.forEach(event => document.removeEventListener(event, interact));
  }
  function openInvite() {
    if (state === 'opening' || state === 'opened') return;
    state = 'opening';
    clearTimeout(watchdog);
    removeTriggers();
    video.pause();
    invite.hidden = false;
    document.querySelector('.site-footer').hidden = false;
    root.classList.add('is-leaving');
    document.body.classList.add('invite-entering');
    window.dispatchEvent(new Event('invite:opened'));
    setTimeout(() => {
      root.hidden = true;
      document.body.classList.remove('intro-active', 'invite-entering');
      state = 'opened';
      document.getElementById('invite-title').focus({ preventScroll: true });
    }, reduce ? 0 : 1100);
  }
  function recover() {
    if (state === 'opening' || state === 'opened') return;
    clearTimeout(watchdog);
    state = 'error';
    window.dispatchEvent(new Event('invite:intro-failed'));
    root.classList.remove('is-playing');
    document.getElementById('intro-hint').textContent = 'افتح الدعوة';
    status.textContent = 'تعذّر تشغيل المقدمة. يمكنك فتح الدعوة مباشرة.';
    startButton.disabled = false;
  }
  function interact(event) {
    if (event.target instanceof Element && event.target.closest('#intro-skip')) return;
    if (event.type === 'keydown' && (event.key === 'Tab' || event.metaKey || event.ctrlKey || event.altKey || event.key === 'Shift')) return;
    if (event.type === 'keydown') event.preventDefault();
    if (state === 'error') { openInvite(); return; }
    if (state !== 'idle') return;
    state = 'playing';
    root.classList.add('is-playing');
    status.textContent = 'جارٍ فتح الدعوة';
    // Muted inline playback also permits touch and scroll activation on phones.
    video.muted = true;
    const videoPlayback = video.play();
    // Start the music within the same user gesture so mobile browsers allow it.
    window.dispatchEvent(new Event('invite:intro-started'));
    videoPlayback.catch(recover);
    watchdog = setTimeout(recover, 20000);
  }
  events.forEach(event => document.addEventListener(event, interact, event === 'wheel' ? { passive: true } : false));
  skip.addEventListener('click', openInvite);
  video.addEventListener('ended', openInvite);
  video.addEventListener('error', recover);
  video.querySelector('source').addEventListener('error', recover);
  video.addEventListener('timeupdate', () => {
    if (state !== 'playing' || !Number.isFinite(video.duration)) return;
    document.getElementById('intro-progress').style.transform = `scaleX(${video.currentTime / video.duration})`;
    clearTimeout(watchdog);
    watchdog = setTimeout(recover, 15000);
  });
  // Keep keyboard navigation within the modal while the invitation is hidden.
  root.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    (document.activeElement === skip ? startButton : skip).focus();
  });
  startButton.focus({ preventScroll: true });
})();
