/**
 * Countdown to ceremony in Africa/Cairo — scaffold.
 */
(function () {
  const cfg = window.INVITE_CONFIG;
  const root = document.getElementById('countdown');
  const doneEl = document.getElementById('countdown-done');
  if (!cfg || !root) return;

  const target = new Date(cfg.datetime).getTime();

  const nodes = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      root.hidden = true;
      if (doneEl) doneEl.hidden = false;
      return false;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (nodes.days) nodes.days.textContent = String(days);
    if (nodes.hours) nodes.hours.textContent = pad(hours);
    if (nodes.minutes) nodes.minutes.textContent = pad(minutes);
    if (nodes.seconds) nodes.seconds.textContent = pad(seconds);
    return true;
  }

  if (tick()) {
    window.setInterval(tick, 1000);
  }
})();
