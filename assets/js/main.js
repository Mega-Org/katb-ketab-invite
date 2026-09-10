/**
 * Boot: hydrate [data-config] nodes from INVITE_CONFIG + share button.
 */
(function () {
  const cfg = window.INVITE_CONFIG;
  if (!cfg) return;

  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  document.querySelectorAll('[data-config]').forEach((el) => {
    const path = el.getAttribute('data-config');
    const value = getPath(cfg, path);
    if (value != null && value !== '') {
      el.textContent = String(value);
    }
  });

  const shareBtn = document.getElementById('share-invite');
  shareBtn?.addEventListener('click', async () => {
    const url = cfg.share.url || window.location.href;
    const payload = {
      title: cfg.share.title,
      text: cfg.share.text,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      /* user cancelled */
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      shareBtn.textContent = 'تم نسخ الرابط';
      window.setTimeout(() => {
        shareBtn.textContent = 'مشاركة';
      }, 2000);
    } catch {
      window.prompt('انسخ الرابط:', url);
    }
  });
})();
