# فلش‌کارت‌های حقوق و آزادی‌های بنیادین بشر

## Human Rights & Fundamental Freedoms — Educational Flashcard System

---

### ۱. هدف

ساخت مجموعه‌ای از فلش‌کارت‌های آموزشی به زبان فارسی برای یادگیری و حفظ مفاد اسناد بین‌المللی حقوق بشر. کاربران پس از تکمیل هر مجموعه، نشان (Badge) دریافت می‌کنند و معادل ~۱ USDC اتریوم به‌عنوان پاداش به کیف‌پول آنان واریز می‌شود.

### ۲. اسناد مرجع (۱۱ سند)

| # | عنوان فارسی | عنوان انگلیسی | کد مجموعه |
|---|------------|---------------|-----------|
| ۱ | منشور جهانی حقوق بشر | Universal Declaration of Human Rights | `UDHR` |
| ۲ | پیمان حقوق اقتصادی، اجتماعی و فرهنگی | International Covenant on Economic, Social & Cultural Rights | `ICESCR` |
| ۳ | پیمان حقوق مدنی و سیاسی | International Covenant on Civil and Political Rights | `ICCPR` |
| ۴ | قوانین یوگیاکارتا | Yogyakarta Principles | `YP` |
| ۵ | پیمان حقوق کودک | Convention on the Rights of the Child | `CRC` |
| ۶ | پیمان رفع تبعیض علیه زنان | Convention on the Elimination of All Forms of Discrimination against Women | `CEDAW` |
| ۷ | پیمان حقوق افراد دارای کم‌توانی | Convention on the Rights of Persons with Disabilities | `CRPD` |
| ۸ | پیمان منع شکنجه | Convention against Torture and Other Cruel, Inhuman or Degrading Treatment or Punishment | `CAT` |
| ۹ | پیمان منع نسل‌کشی | Convention on the Prevention and Punishment of the Crime of Genocide | `CPPCG` |
| ۱۰ | پیمان حقوق کارگران مهاجر | International Convention on the Protection of the Rights of All Migrant Workers and Members of Their Families | `ICMW` |
| ۱۱ | پیمان حمایت از ناپدیدشدگان اجباری | International Convention for the Protection of All Persons from Enforced Disappearance | `ICPPED` |

### ۳. ساختار فلش‌کارت‌ها

هر فلش‌کارت دارای:

- **روی کارت (Front):** سؤال یا اصل حقوقی به فارسی
- **پشت کارت (Back):** پاسخ / توضیح به فارسی + ارجاع به ماده‌ی مربوطه
- **متادیتا:**
  - `deckCode`: کد مجموعه (مثلاً `UDHR`)
  - `articleRef`: شماره ماده (مثلاً `Article 3`)
  - `difficulty`: سطح (`BEGINNER` | `INTERMEDIATE` | `ADVANCED`)
  - `order`: ترتیب نمایش

#### انواع کارت‌ها

| نوع | توضیح | مثال |
|-----|--------|------|
| `CONCEPT` | تعریف یک مفهوم | «حق حیات چیست؟» |
| `ARTICLE` | محتوای یک ماده | «ماده ۳ اعلامیه جهانی حقوق بشر چه می‌گوید؟» |
| `MATCH` | تطبیق ماده با سند | «حق آموزش رایگان ابتدایی در کدام سند آمده؟» |
| `TRUE_FALSE` | صحیح/غلط | «آیا شکنجه تحت هر شرایطی ممنوع است؟» |

### ۴. مکانیزم یادگیری

```
شروع مجموعه
    → نمایش کارت (روی)
    → کاربر فکر می‌کند
    → نمایش پاسخ (پشت)
    → خودارزیابی: «بلد بودم ❌ / تقریباً 🔶 / کاملاً ✅»
    → کارت‌های ❌ و 🔶 دوباره تکرار
    → تکمیل وقتی همه ✅
```

- الگوریتم تکرار فاصله‌دار (Spaced Repetition) ساده: کارت‌هایی که ❌ خورده‌اند زودتر تکرار می‌شوند
- پیشرفت ذخیره می‌شود — کاربر می‌تواند ادامه دهد

### ۵. سیستم نشان و پاداش (Badge & Reward)

#### نشان‌ها (Badges)

هر مجموعه یک نشان دارد. نشان قبل از تکمیل به‌صورت قفل‌شده و خاکستری نمایش داده می‌شود با آیکون ℹ️ (info) روی آن که توضیح پاداش را نشان می‌دهد:

```
┌─────────────────────────────────┐
│  ℹ️                              │
│    🔒  نشان منشور جهانی        │
│         حقوق بشر               │
│                                 │
│   تکمیل = ~۱ USDC پاداش       │
│   ۰ از ۳۰ کارت تکمیل شده      │
│                                 │
│       [ شروع یادگیری ]          │
└─────────────────────────────────┘
```

پس از تکمیل:

```
┌─────────────────────────────────┐
│  ✅                              │
│    🏅  نشان منشور جهانی        │
│         حقوق بشر               │
│                                 │
│   پاداش ارسال شد! ✓            │
│   ۳۰ از ۳۰ کارت تکمیل شده     │
│                                 │
│      تاریخ: ۱۳۹۴/۱۲/۲۴        │
└─────────────────────────────────┘
```

#### پاداش مالی

- مبلغ: معادل **~۱ USDC** به اتریوم (ETH) در شبکه Polygon
- منبع: خزانه (Treasury) پروژه $CIVIC
- زمان واریز: بلافاصله پس از تکمیل مجموعه
- محدودیت: هر کاربر فقط **یک بار** برای هر مجموعه پاداش دریافت می‌کند
- ثبت: تراکنش در `TokenTransfer` با `reason: 'FLASHCARD_COMPLETION'` ذخیره می‌شود

### ۶. مدل داده (Prisma)

```prisma
model FlashcardDeck {
  id          String   @id @default(cuid())
  code        String   @unique          // e.g. "UDHR"
  titleFa     String                    // عنوان فارسی
  titleEn     String                    // English title
  description String?                   // توضیح کوتاه
  sourceUrl   String?                   // لینک سند مرجع
  icon        String   @default("📜")   // ایموجی نشان
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  cards       Flashcard[]
  progress    FlashcardProgress[]
  rewards     FlashcardReward[]
}

model Flashcard {
  id          String   @id @default(cuid())
  deckId      String
  deck        FlashcardDeck @relation(fields: [deckId], references: [id])
  type        String   @default("CONCEPT")  // CONCEPT | ARTICLE | MATCH | TRUE_FALSE
  front       String                        // سؤال (فارسی)
  back        String                        // پاسخ (فارسی)
  articleRef  String?                       // e.g. "Article 3"
  difficulty  String   @default("BEGINNER") // BEGINNER | INTERMEDIATE | ADVANCED
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  
  progress    FlashcardProgress[]
}

model FlashcardProgress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  cardId      String
  card        Flashcard @relation(fields: [cardId], references: [id])
  deckId      String
  deck        FlashcardDeck @relation(fields: [deckId], references: [id])
  status      String   @default("UNSEEN")   // UNSEEN | AGAIN | HARD | GOOD
  reviewCount Int      @default(0)
  lastReview  DateTime?
  nextReview  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, cardId])
}

model FlashcardReward {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  deckId      String
  deck        FlashcardDeck @relation(fields: [deckId], references: [id])
  amount      Float                          // مبلغ ETH
  usdValue    Float    @default(1.0)         // ارزش USDC
  txHash      String?                        // هش تراکنش
  awardedAt   DateTime @default(now())

  @@unique([userId, deckId])                 // یک پاداش برای هر مجموعه
}
```

### ۷. API Endpoints

#### کاربر

| Method | Path | توضیح |
|--------|------|--------|
| `GET` | `/flashcards/decks` | لیست مجموعه‌ها + تعداد کارت + وضعیت نشان |
| `GET` | `/flashcards/decks/:code` | جزئیات یک مجموعه + کارت‌ها |
| `GET` | `/flashcards/decks/:code/progress` | پیشرفت کاربر در یک مجموعه |
| `POST` | `/flashcards/review` | ثبت نتیجه مرور یک کارت `{cardId, status}` |
| `POST` | `/flashcards/decks/:code/complete` | بررسی تکمیل مجموعه + ثبت پاداش + اعلان ادمین |

#### ادمین

| Method | Path | توضیح |
|--------|------|--------|
| `GET` | `/flashcards/admin/rewards/pending` | لیست پاداش‌های پرداخت‌نشده |
| `POST` | `/flashcards/admin/rewards/:rewardId/pay` | ثبت پرداخت `{txHash}` |
| `GET` | `/flashcards/admin/notifications` | اعلان‌های ادمین (تکمیل‌ها) |
| `POST` | `/flashcards/admin/notifications/:id/read` | علامت‌گذاری اعلان به‌عنوان خوانده‌شده |

#### جریان اعلان ادمین

```
کاربر تمام کارت‌ها را MASTERED می‌کند
    → POST /flashcards/decks/:code/complete
    → سرویس بررسی می‌کند: آیا همه تکمیل شده؟
    → بله → FlashcardReward ایجاد می‌شود
          → AdminNotification ثبت می‌شود (type: FLASHCARD_COMPLETION)
          → لاگ سرور: 🏅 User completed deck
    → ادمین از GET /flashcards/admin/notifications مطلع می‌شود
    → ادمین ETH ارسال می‌کند → POST /admin/rewards/:id/pay {txHash}
```

### ۸. صفحات فرانت‌اند

تب جدید **«حقوق بشر»** (یا **«یادگیری»**) در داشبورد:

1. **صفحه اصلی یادگیری:** گرید نشان‌ها — ۱۱ مجموعه با وضعیت قفل/باز
2. **صفحه مجموعه:** لیست کارت‌ها با پیشرفت
3. **صفحه مرور:** فلش‌کارت تعاملی (ورق زدن)
4. **مودال پاداش:** تبریک + جزئیات تراکنش پس از تکمیل

### ۹. محتوای اولیه — مجموعه ۱: منشور جهانی حقوق بشر (UDHR)

نمونه‌ی ۱۰ فلش‌کارت اولیه (مجموعه کامل ~۳۰ کارت):

| # | روی کارت | پشت کارت | ماده | نوع |
|---|---------|----------|------|-----|
| ۱ | ماده ۱ اعلامیه جهانی حقوق بشر چه اصلی را بیان می‌کند؟ | تمام افراد بشر آزاد به دنیا می‌آیند و از لحاظ حیثیت و حقوق با هم برابرند. همگی دارای عقل و وجدان هستند و باید با یکدیگر با روحیه‌ی برادرانه رفتار کنند. | Article 1 | ARTICLE |
| ۲ | حق حیات، آزادی و امنیت شخصی در کدام ماده آمده است؟ | ماده ۳: هر فردی حق زندگی، آزادی و امنیت شخصی دارد. | Article 3 | ARTICLE |
| ۳ | آیا بردگی تحت هر شرایطی ممنوع است؟ | بله. ماده ۴: هیچ‌کس را نباید در بردگی یا بندگی نگاه داشت. بردگی و خرید و فروش بردگان به هر شکلی ممنوع است. | Article 4 | TRUE_FALSE |
| ۴ | اعلامیه جهانی حقوق بشر در چه تاریخی تصویب شد؟ | ۱۰ دسامبر ۱۹۴۸ (۱۹ آذر ۱۳۲۷) توسط مجمع عمومی سازمان ملل متحد | — | CONCEPT |
| ۵ | «حق تابعیت» در کدام ماده بیان شده؟ | ماده ۱۵: هر فردی حق دارد تابعیتی داشته باشد. هیچ‌کس را نمی‌توان خودسرانه از تابعیتش محروم کرد. | Article 15 | MATCH |
| ۶ | ماده ۱۸ چه حقی را تضمین می‌کند؟ | آزادی اندیشه، وجدان و مذهب — شامل حق تغییر مذهب و اظهار آزادانه‌ی عقیده. | Article 18 | ARTICLE |
| ۷ | «حق آموزش» در اعلامیه جهانی چه ویژگی‌هایی دارد؟ | ماده ۲۶: آموزش باید رایگان باشد — حداقل در مراحل ابتدایی. آموزش ابتدایی اجباری است. آموزش فنی و حرفه‌ای باید عمومی باشد. | Article 26 | CONCEPT |
| ۸ | اعلامیه جهانی حقوق بشر چند ماده دارد؟ | ۳۰ ماده | — | CONCEPT |
| ۹ | آیا هر فردی حق شرکت در حکومت کشور خود را دارد؟ | بله. ماده ۲۱: هر فردی حق دارد مستقیماً یا از طریق نمایندگان آزادانه انتخاب‌شده در حکومت کشور خود شرکت کند. | Article 21 | TRUE_FALSE |
| ۱۰ | ماده ۵ اعلامیه جهانی چه چیزی را ممنوع می‌کند؟ | شکنجه و مجازات یا رفتار بی‌رحمانه، غیرانسانی یا تحقیرآمیز. | Article 5 | ARTICLE |

### ۱۰. ملاحظات فنی

- **ضد تقلب:** حداقل زمان مرور هر کارت ۳ ثانیه — مرورهای سریع‌تر ثبت نمی‌شوند
- **تکمیل واقعی:** تمام کارت‌های یک مجموعه باید وضعیت `GOOD` داشته باشند
- **محدودیت پاداش:** `@@unique([userId, deckId])` تضمین می‌کند هر کاربر فقط یک بار پاداش بگیرد
- **RTL:** رابط کاربری کاملاً راست‌به‌چپ (فارسی)
- **آفلاین:** کارت‌ها قابل کش شدن برای مطالعه‌ی آفلاین

### ۱۱. مراحل پیاده‌سازی

1. ✅ تعریف مدل داده (Prisma migration) — شامل `AdminNotification`
2. ✅ ساخت ماژول backend (NestJS: controller, service, module)
3. ✅ اتصال سیستم اعلان ادمین (تکمیل → ثبت → اعلان)
4. ✅ ساخت seed data برای UDHR (مجموعه اول — ۳۰ کارت)
5. ✅ ساخت صفحات فرانت‌اند (تب یادگیری + badge grid + flashcard review + completion modal)
6. ✅ اتصال سیستم پاداش به wallet (AdminNotification + pending rewards)
7. ⬜ تست و بازبینی
8. ⬜ افزودن محتوای ۱۰ مجموعه‌ی دیگر (تدریجی)
