/**
 * Handkerchief crumple intro — Pointer Events drag + tap open.
 * Dispatches `invite:opened` after the crumple finishes (or immediately
 * under prefers-reduced-motion).
 */
(function () {
  const root = document.getElementById('handkerchief');
  if (!root) return;

  const cloth = root.querySelector('.handkerchief__cloth');
  const stripCount = Number(cloth?.dataset.strips || 14);
  const THRESHOLD = 0.4;
  const DRAG_PX = 170;
  const TAP_PX = 10;
  const STAGGER_MS = 18;
  const FINISH_MS = 560;
  const SPRING_MS = 520;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let progress = 0;
  let opened = false;
  let dragging = false;
  let animating = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startProgress = 0;
  let maxTravel = 0;

  function buildStrips() {
    if (!cloth || cloth.children.length) return;
    root.style.setProperty('--strip-count', String(stripCount));
    cloth.style.setProperty('--strip-count', String(stripCount));
    const frag = document.createDocumentFragment();
    for (let i = 0; i < stripCount; i += 1) {
      const strip = document.createElement('div');
      strip.className = 'handkerchief__strip';
      strip.style.setProperty('--i', String(i));
      frag.appendChild(strip);
    }
    cloth.appendChild(frag);
  }

  function setProgress(value) {
    progress = Math.max(0, Math.min(1, value));
    root.style.setProperty('--crumple', String(progress));
  }

  function openInvite() {
    if (opened) return;
    opened = true;
    root.classList.remove('is-dragging', 'is-animating', 'is-finishing', 'is-hint-visible');
    root.classList.add('is-done');
    root.hidden = true;
    const invite = document.getElementById('invite');
    if (invite) invite.hidden = false;
    window.dispatchEvent(new CustomEvent('invite:opened'));
  }

  function showHint() {
    if (!opened) root.classList.add('is-hint-visible');
  }

  function staggerBudget() {
    return (stripCount - 1) * STAGGER_MS;
  }

  function animateProgress(from, to, duration, { finishing = false } = {}) {
    return new Promise((resolve) => {
      animating = true;
      root.classList.add('is-animating');
      root.classList.toggle('is-finishing', finishing);

      // Let CSS transition-delay on strips run from a single property change.
      setProgress(from);
      // Force reflow so the browser registers the starting crumple value.
      void root.offsetWidth;
      setProgress(to);

      window.setTimeout(() => {
        setProgress(to);
        root.classList.remove('is-animating', 'is-finishing');
        animating = false;
        resolve();
      }, duration + staggerBudget() + 40);
    });
  }

  async function finishOpen() {
    if (opened || animating) return;
    root.classList.remove('is-hint-visible');
    if (reducedMotion) {
      openInvite();
      return;
    }
    await animateProgress(progress, 1, FINISH_MS, { finishing: true });
    openInvite();
  }

  async function springBack() {
    if (opened || animating) return;
    await animateProgress(progress, 0, SPRING_MS, { finishing: false });
  }

  function onPointerDown(event) {
    if (opened || animating || event.button > 0) return;
    if (reducedMotion) {
      openInvite();
      return;
    }

    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startProgress = progress;
    maxTravel = 0;
    root.classList.add('is-dragging');
    root.classList.remove('is-hint-visible');

    try {
      root.setPointerCapture(event.pointerId);
    } catch {
      /* some browsers may throw if capture is unsupported mid-gesture */
    }
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== pointerId || animating) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const travel = Math.hypot(dx, dy);
    maxTravel = Math.max(maxTravel, travel);

    // Favor a downward pull; still allow sideways / upward distance.
    const pull = Math.max(dy, travel * 0.65);
    const next = startProgress + pull / DRAG_PX;
    setProgress(next);
  }

  async function onPointerUp(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    root.classList.remove('is-dragging');

    try {
      root.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }

    if (opened || animating) return;

    // Plain tap → full crumple then open
    if (maxTravel < TAP_PX) {
      await finishOpen();
      return;
    }

    if (progress >= THRESHOLD) {
      await finishOpen();
    } else {
      await springBack();
      window.setTimeout(showHint, 600);
    }
  }

  function onPointerCancel(event) {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    root.classList.remove('is-dragging');
    if (!opened && !animating && progress < THRESHOLD) {
      springBack().then(() => window.setTimeout(showHint, 600));
    }
  }

  buildStrips();
  setProgress(0);
  window.setTimeout(showHint, 2000);

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerCancel);

  // Keyboard / a11y: Enter or Space opens the invite
  root.tabIndex = 0;
  root.addEventListener('keydown', (event) => {
    if (opened || animating) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (reducedMotion) openInvite();
      else finishOpen();
    }
  });

  window.Handkerchief = { openInvite, setProgress };
})();
