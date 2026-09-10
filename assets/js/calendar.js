/**
 * Add to calendar: download .ics and open Google Calendar template.
 */
(function () {
  const cfg = window.INVITE_CONFIG;
  const btn = document.getElementById('add-to-calendar');
  if (!cfg || !btn) return;

  function formatIcsDate(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  }

  function eventBounds() {
    const start = new Date(cfg.datetime);
    const end = new Date(start.getTime() + (cfg.calendar.durationMinutes || 120) * 60 * 1000);
    const location = `${cfg.venue.name}، ${cfg.venue.address}`;
    return { start, end, location };
  }

  function buildIcs() {
    const { start, end, location } = eventBounds();
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invite//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${start.getTime()}@invite.local`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${cfg.calendar.title}`,
      `DESCRIPTION:${cfg.calendar.description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    return lines.join('\r\n');
  }

  function buildGoogleCalendarUrl() {
    const { start, end, location } = eventBounds();
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: cfg.calendar.title,
      dates: `${formatIcsDate(start)}/${formatIcsDate(end)}`,
      details: cfg.calendar.description,
      location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function downloadIcs() {
    const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kitab-magdy-hagar.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  function openGoogleCalendar() {
    window.open(buildGoogleCalendarUrl(), '_blank', 'noopener,noreferrer');
  }

  btn.addEventListener('click', function () {
    downloadIcs();
    openGoogleCalendar();
  });
})();
