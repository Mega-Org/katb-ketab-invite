/**
 * Couple section: typing code editor + ECG stroke animation.
 * Starts when the section gains `.is-visible` (scroll reveal).
 */
(function () {
  const section = document.querySelector('.couple');
  const codeEl = document.getElementById('couple-code');
  const ecgSvg = document.getElementById('couple-ecg');
  if (!section || !codeEl || !ecgSvg) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path = ecgSvg.querySelector('path');

  const LINES = [
    { text: 'const magdy = { status: "single" };', kind: 'code' },
    { text: '', kind: 'blank' },
    { text: 'git merge hagar --no-ff', kind: 'cmd' },
    { text: '✓ merged successfully — 11.11.2026', kind: 'ok' },
  ];

  const CHAR_MS = 36;
  const LINE_PAUSE_MS = 420;

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightCode(text) {
    return escapeHtml(text)
      .replace(/\b(const)\b/, '<span class="couple__tok-kw">$1</span>')
      .replace(/\b(magdy)\b/, '<span class="couple__tok-id">$1</span>')
      .replace(/\b(status)\b/, '<span class="couple__tok-key">$1</span>')
      .replace(/(&quot;single&quot;)/, '<span class="couple__tok-str">$1</span>');
  }

  function renderLine(line, typed) {
    if (line.kind === 'blank') return '';
    if (line.kind === 'ok') {
      return `<span class="couple__code-ok">${escapeHtml(typed)}</span>`;
    }
    if (line.kind === 'cmd') {
      return `<span class="couple__code-cmd">$ ${escapeHtml(typed)}</span>`;
    }
    return highlightCode(typed);
  }

  function paint(completed, currentIndex, currentTyped, showCaret) {
    const parts = [];
    for (let i = 0; i < completed.length; i++) {
      parts.push(renderLine(LINES[i], completed[i]));
    }
    if (currentIndex != null && currentIndex < LINES.length) {
      parts.push(renderLine(LINES[currentIndex], currentTyped));
    }
    const caret = showCaret
      ? '<span class="couple__caret" aria-hidden="true"></span>'
      : '';
    codeEl.innerHTML = parts.join('\n') + caret;
  }

  function showFinal() {
    paint(
      LINES.map((l) => l.text),
      null,
      '',
      false
    );
    codeEl.classList.add('is-done');
    if (path) {
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
    }
    ecgSvg.classList.remove('is-running');
  }

  function startEcg() {
    if (!path || reduce) return;
    const length = Math.ceil(path.getTotalLength());
    ecgSvg.style.setProperty('--ecg-length', String(length));
    path.style.strokeDasharray = '';
    path.style.strokeDashoffset = '';
    void path.getBoundingClientRect();
    ecgSvg.classList.add('is-running');
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function typeOut() {
    codeEl.classList.add('is-typing');
    startEcg();

    const completed = [];

    for (let i = 0; i < LINES.length; i++) {
      const line = LINES[i];

      if (line.kind === 'blank') {
        completed.push('');
        paint(completed, null, '', true);
        await sleep(LINE_PAUSE_MS);
        continue;
      }

      let typed = '';
      for (let c = 0; c < line.text.length; c++) {
        typed += line.text[c];
        paint(completed, i, typed, true);
        await sleep(CHAR_MS);
      }

      completed.push(line.text);
      paint(completed, null, '', true);
      await sleep(LINE_PAUSE_MS);
    }

    paint(completed, null, '', false);
    codeEl.classList.remove('is-typing');
    codeEl.classList.add('is-done');
  }

  function start() {
    if (section.dataset.coupleStarted) return;
    section.dataset.coupleStarted = '1';

    if (reduce) {
      showFinal();
      return;
    }

    typeOut();
  }

  function whenVisible(cb) {
    if (section.classList.contains('is-visible')) {
      cb();
      return;
    }

    const mo = new MutationObserver(() => {
      if (section.classList.contains('is-visible')) {
        mo.disconnect();
        cb();
      }
    });
    mo.observe(section, { attributes: true, attributeFilter: ['class'] });
  }

  whenVisible(start);
})();
