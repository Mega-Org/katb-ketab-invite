/**
 * Venue map (Leaflet + OSM) — scaffold stub.
 */
(function () {
  const venue = window.INVITE_CONFIG?.venue;
  const mapEl = document.getElementById('venue-map');
  if (!venue || !mapEl) return;

  const { lat, lng, name, address } = venue;
  const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const openMaps = document.getElementById('open-maps');
  const openDir = document.getElementById('open-directions');
  if (openMaps) openMaps.href = mapsSearch;
  if (openDir) openDir.href = mapsDir;

  if (typeof L === 'undefined') {
    mapEl.textContent = 'يمكنك الوصول إلى المكان عبر أزرار الخريطة بالأسفل';
    return;
  }

  const map = L.map(mapEl, {
    scrollWheelZoom: false,
    attributionControl: true,
  }).setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: `<span style="display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;background:#3E2B23;transform:rotate(-45deg);border:2px solid #F5EDE3"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
  });

  L.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup(`${name}<br>${address}`)
    .on('click', () => {
      window.open(mapsSearch, '_blank', 'noopener,noreferrer');
    });

  window.addEventListener('invite:opened', () => {
    window.setTimeout(() => map.invalidateSize(), 50);
  });
})();
