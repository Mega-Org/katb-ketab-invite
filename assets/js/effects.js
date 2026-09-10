/**
 * Reveal-on-scroll + lightweight petal / gold particle canvas.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    items.forEach((el) => io.observe(el));
  }

  /**
   * Soft cream / gold petals drifting gently over the invite.
   * Skipped entirely when prefers-reduced-motion is set.
   */
  function initPetals() {
    if (reduce) return;

    let canvas = document.getElementById('petals-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'petals-canvas';
      canvas.className = 'petals-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = [
      'rgba(176, 138, 90, 0.55)', // gold
      'rgba(217, 196, 169, 0.65)', // sand
      'rgba(245, 237, 227, 0.5)', // cream
      'rgba(90, 62, 48, 0.22)', // cocoa soft
    ];

    /** @type {{ x: number, y: number, size: number, rot: number, spin: number, vx: number, vy: number, sway: number, swaySpeed: number, color: string, wobble: number }[]} */
    let petals = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = false;
    let raf = 0;
    let lastTs = 0;

    function petalCount() {
      const area = width * height;
      if (area < 400000) return 14;
      if (area < 900000) return 22;
      return 28;
    }

    function makePetal(spawnTop) {
      const size = 4 + Math.random() * 7;
      return {
        x: Math.random() * width,
        y: spawnTop ? -20 - Math.random() * height * 0.3 : Math.random() * height,
        size,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.8,
        vx: (Math.random() - 0.5) * 12,
        vy: 12 + Math.random() * 22,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.4 + Math.random() * 0.9,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        wobble: 0.55 + Math.random() * 0.45,
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = petalCount();
      if (petals.length === 0) {
        petals = Array.from({ length: count }, () => makePetal(false));
      } else if (petals.length < count) {
        while (petals.length < count) petals.push(makePetal(true));
      } else if (petals.length > count) {
        petals.length = count;
      }
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, p.wobble);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick(ts) {
      if (!running) return;
      const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
      lastTs = ts;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.sway += p.swaySpeed * dt;
        p.x += (p.vx + Math.sin(p.sway) * 18) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;

        if (p.y > height + 30 || p.x < -40 || p.x > width + 40) {
          petals[i] = makePetal(true);
          continue;
        }
        drawPetal(p);
      }

      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    if (!document.hidden) start();
  }

  function onOpened() {
    initReveal();
    initPetals();
  }

  window.addEventListener('invite:opened', onOpened);
  // If the intro has already finished, initialize immediately:
  if (document.getElementById('invite') && !document.getElementById('invite').hidden) {
    onOpened();
  }
})();
