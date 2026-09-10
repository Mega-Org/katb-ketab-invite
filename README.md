# دعوة كتب كتاب — مجدي وهاجر

دعوة زفاف عربية (RTL) بصفحة واحدة ثابتة: HTML / CSS / JS بدون خطوة بناء.

افتح `index.html` في المتصفح محلياً، أو انشر المجلد كما هو على GitHub Pages أو Netlify.

## تعديل المحتوى

كل النصوص والتواريخ والإحداثيات والموسيقى تُعدَّل من ملف واحد:

[`assets/js/config.js`](assets/js/config.js)

| الحقل | الاستخدام |
| --- | --- |
| `groom` / `bride` | الأسماء والألقاب |
| `monogram` / `eventLabel` | المنديل والعنوان |
| `datetime` | العدّاد والتقويم (ISO مع `+02:00` لتوقيت القاهرة) |
| `dateDisplay` / `timeDisplay` | عرض التاريخ والوقت للزائر |
| `venue.name` / `venue.address` | نصوص المكان |
| `venue.lat` / `venue.lng` | دبوس الخريطة وروابط جوجل ماب |
| `verses` | الآيات والدعاء |
| `share` | عنوان ونص المشاركة (و`url` بعد النشر) |
| `audio` | التراك الافتراضي وقائمة الملفات |
| `calendar` | عنوان ووصف حدث التقويم |

بعد التعديل أعد تحميل الصفحة — لا حاجة لبناء أو تجميع.

## استبدال أغنيتك

1. ضع ملف MP3 باسم `my-song.mp3` في [`assets/audio/`](assets/audio/).
2. في `config.js` داخل `audio` غيّر:

```js
defaultTrackId: 'my-song',
```

التراك يظهر في القائمة كـ «أغنيتي». إن بقي الملف فارغاً أو فشل التشغيل، المشغّل يتجاوزه وينتقل للتراك التالي.

التراكات الجاهزة (`track-01` … `track-04`) من Kevin MacLeod — انظر [رخصة الموسيقى](#رخصة-الموسيقى).

## تصحيح دبوس الخريطة

في `config.js`:

```js
venue: {
  lat: 31.07444,
  lng: 31.43139,
  // ...
},
```

عدّل `lat` و`lng` فقط؛ روابط «افتح في جوجل ماب» و«الاتجاهات» والعلامة على الخريطة تتحدث تلقائياً.

## النشر

### GitHub Pages

1. ارفع المشروع إلى مستودع GitHub.
2. Settings → Pages → Source: الفرع `main` (أو `gh-pages`) ومجلد الجذر `/`.
3. بعد النشر انسخ الرابط العام إلى `share.url` في `config.js`.

لمعاينة واتساب/Open Graph بعد النشر، يُفضَّل جعل `og:image` رابطاً مطلقاً، مثلاً:

```html
<meta property="og:image" content="https://USERNAME.github.io/REPO/assets/img/og.jpg" />
```

الملف الحالي [`assets/img/og.jpg`](assets/img/og.jpg) جاهز بمقاس مناسب للمعاينة؛ المسار النسبي يعمل محلياً، وواتساب يحتاج الرابط المطلق بعد النشر.

### Netlify (سحب وإفلات)

1. افتح [Netlify Drop](https://app.netlify.com/drop).
2. اسحب مجلد المشروع كاملاً (بما فيه `index.html` و`assets/`).
3. انسخ رابط الموقع إلى `share.url` في `config.js`، وحدّث `og:image` إلى URL مطلق إن أردت معاينة واتساب صحيحة.

لا حاجة لملف بناء أو أمر `npm` — الموقع ثابت.

## رخصة الموسيقى

موسيقى الخلفية من **Kevin MacLeod** عبر [incompetech.com](https://incompetech.com/) بموجب رخصة **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.

الإسناد موجود في تذييل الصفحة. عند إعادة التوزيع أبقِ ذكر المؤلف والرخصة.

## هيكل سريع

```
index.html
assets/
  css/     base · handkerchief · sections
  js/      config · handkerchief · audio · countdown · map · calendar · effects · couple · main
  img/     hero.jpg · detail.jpg · og.jpg
  audio/   track-01…04.mp3 · my-song.mp3
```

## خارج النطاق

لا يوجد RSVP ولا إطار عمل ولا خطوة بناء — الإبقاء على vanilla مقصود.
