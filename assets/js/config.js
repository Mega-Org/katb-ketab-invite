/**
 * Wedding invite — single source of truth for editable content.
 * Change names, date, venue, coords, tracks, or share URL here.
 */
window.INVITE_CONFIG = Object.freeze({
  groom: {
    name: 'مجدي',
    title: 'مهندس برمجيات',
  },
  bride: {
    name: 'هاجر',
    title: 'كلية التمريض',
  },
  monogram: 'م & هـ',
  eventLabel: 'كتب كتاب',

  /** Ceremony datetime in Africa/Cairo (ISO with offset UTC+2) */
  datetime: '2026-11-11T16:00:00+02:00',
  timezone: 'Africa/Cairo',
  dateDisplay: 'الأربعاء ١١ نوفمبر ٢٠٢٦',
  timeDisplay: 'بعد صلاة العصر — ٤:٠٠ عصراً',

  venue: {
    name: 'مسجد نصار',
    address: 'ميت مزاح، مركز المنصورة، الدقهلية',
    /** Wikimapia pin — adjust if the marker looks off */
    lat: 31.07444,
    lng: 31.43139,
  },

  verses: {
    opening:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا',
    detail: 'وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    closing: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير',
  },

  share: {
    title: 'دعوة كتب كتاب — مجدي وهاجر',
    text: 'ندعوكم لحضور كتب كتاب مجدي وهاجر — الأربعاء ١١ نوفمبر ٢٠٢٦، مسجد نصار، ميت مزاح.',
    /** Set after deploy (GitHub Pages / Netlify URL) */
    url: '',
  },

  audio: {
    /** Default track id from `tracks` */
    defaultTrackId: 'anisat-rouhi',
    fadeInMs: 3000,
    tracks: [
      {
        id: 'anisat-rouhi',
        title: 'أنيسة روحي',
        artist: 'زياد أيمن',
        src: 'assets/audio/anisat-rouhi.mp3',
        license: '',
      },
    ],
  },

  calendar: {
    title: 'كتب كتاب مجدي وهاجر',
    description:
      'كتب كتاب مجدي وهاجر — مسجد نصار، ميت مزاح، مركز المنصورة.',
    durationMinutes: 120,
  },
});
