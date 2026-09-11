# دعوة كتب كتاب — مجدي وهاجر

دعوة زفاف عربية (RTL) بصفحة واحدة ثابتة: HTML / CSS / JS بدون خطوة بناء.

افتح `index.html` في المتصفح محلياً، أو انشر المجلد كما هو على GitHub Pages أو Netlify.

## تعديل المحتوى

كل النصوص والتواريخ والإحداثيات والموسيقى تُعدَّل من ملف واحد:

[`assets/js/config.js`](assets/js/config.js)

| الحقل | الاستخدام |
| --- | --- |
| `groom` / `bride` | الأسماء والألقاب |
| `monogram` / `eventLabel` | الحروف المختصرة والعنوان |
| `datetime` | العدّاد والتقويم (ISO مع `+02:00` لتوقيت القاهرة) |
| `dateDisplay` / `timeDisplay` | عرض التاريخ والوقت للزائر |
| `venue.name` / `venue.address` | نصوص المكان |
| `venue.lat` / `venue.lng` | دبوس الخريطة وروابط جوجل ماب |
| `verses` | الآيات والدعاء |
| `share` | عنوان ونص ورابط المشاركة |
| `audio` | التراك الافتراضي وقائمة الملفات |
| `calendar` | عنوان ووصف حدث التقويم |

بعد التعديل أعد تحميل الصفحة — لا حاجة لبناء أو تجميع.

## الموسيقى

ملف الموسيقى المستخدم هو [`assets/audio/anisat-rouhi.mp3`](assets/audio/anisat-rouhi.mp3)، وتفاصيله موجودة في `audio.tracks` داخل `config.js`. يبدأ التشغيل مع أول تفاعل يشغّل فيديو المقدمة، ويستمر بعد ظهور الدعوة. يظهر زر الإيقاف والتشغيل بعد انتهاء المقدمة.

لاستبداله، ضع ملف MP3 جديداً في `assets/audio/` وحدّث `src` والعنوان والفنان داخل `audio.tracks`.

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
3. بيانات المشاركة مضبوطة على `https://mega-org.github.io/katb-ketab-invite/` في `index.html` و`share.url` داخل `config.js`.

صورة معاينة واتساب والمنصات هي [`assets/img/invite-card.png`](assets/img/invite-card.png). تستخدم وسوم Open Graph وTwitter رابطاً مطلقاً، مع المقاس والنوع والنص البديل، ويحتوي الموقع كذلك على بيانات Event منظمة لمحركات البحث. عند تغيير رابط النشر يجب تحديث الرابط في `index.html` و`config.js`.

### Netlify (سحب وإفلات)

1. افتح [Netlify Drop](https://app.netlify.com/drop).
2. اسحب مجلد المشروع كاملاً (بما فيه `index.html` و`assets/`).
3. استبدل رابط GitHub Pages في `index.html` و`share.url` داخل `config.js` برابط Netlify.

لا حاجة لملف بناء أو أمر `npm` — الموقع ثابت.

## هيكل سريع

```
index.html
assets/
  css/     base · intro · sections
  js/      config · intro · audio · countdown · map · calendar · effects · main
  img/     hero.jpg · detail.jpg · invite-card.png · couple-identity.jpg
  audio/   anisat-rouhi.mp3
```

## خارج النطاق

لا يوجد RSVP ولا إطار عمل ولا خطوة بناء — الإبقاء على vanilla مقصود.

## المقدمة والتصميم الجديد

الفيديو في `assets/video/envelope.mp4` (١٠ ثوانٍ)، ولقطة البداية الثابتة في `assets/video/poster.jpg`. لا يعمل تلقائياً: أول لمسة أو نقرة أو تمرير أو ضغطة مفتاح تبدأ التشغيل مكتوماً داخل الصفحة، ثم تظهر الدعوة بتلاشي هادئ عند نهاية الفيديو. زر «تخطي المقدمة» متاح دائماً، وإذا تعذّر التحميل يمكن فتح الدعوة مباشرة. عند استبدال الفيديو حدّث لقطة البداية أيضاً.

التصميم كريمي وزيتوني بلمسات ذهبية؛ خط IBM Plex Sans Arabic للنصوص وAref Ruqaa للأسماء والعناوين، مع خطوط نظام بديلة عند عدم توفر الإنترنت. الأسماء الأولى فقط مستخدمة في الدعوة والمشاركة والتقويم. تفضيل تقليل الحركة يلغي حركة الانتقال والزخارف؛ يمكن تخطي الفيديو يدوياً.

للمعاينة المحلية شغّل `python3 -m http.server 4173` ثم افتح `http://localhost:4173`.
