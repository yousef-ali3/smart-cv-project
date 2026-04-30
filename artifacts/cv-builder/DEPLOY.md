# دليل نشر "سيرتك الذكية" على Vercel

هذا الدليل يشرح كيفية نشر التطبيق على Vercel مع تشغيل ميزة تحسين النص بالذكاء الاصطناعي.

---

## 1. متطلبات قبل البدء

- حساب على [Vercel](https://vercel.com) (مجاني)
- مفتاح OpenAI API من [platform.openai.com](https://platform.openai.com/api-keys)
- مستودع GitHub (أو GitLab/Bitbucket) فيه كود المشروع

---

## 2. خطوات النشر

### أ. ارفع المشروع إلى GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

### ب. اربطه بـ Vercel

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اختر "Import Git Repository" واختر المستودع
3. **مهم:** اضبط الإعدادات التالية:

| الحقل | القيمة |
|------|--------|
| **Framework Preset** | Vite (يُكتشف تلقائياً) |
| **Root Directory** | `artifacts/cv-builder` |
| **Build Command** | (يُقرأ من `vercel.json` تلقائياً) |
| **Output Directory** | (يُقرأ من `vercel.json` تلقائياً) |

### ج. أضف متغير البيئة (Environment Variable)

في صفحة الإعدادات قبل النشر، أضف:

| المفتاح | القيمة |
|--------|--------|
| `OPENAI_API_KEY` | مفتاح API الخاص بك من OpenAI |

(اختياري) إذا أردت استخدام موديل آخر:

| المفتاح | القيمة المثالية |
|--------|------------------|
| `OPENAI_MODEL` | `gpt-4o-mini` (الافتراضي) أو `gpt-4o` |

### د. اضغط Deploy

سيقوم Vercel بـ:
1. تثبيت الحزم عبر pnpm
2. بناء الواجهة (Vite)
3. نشر دالة `/api/ai/improve-summary` كـ Serverless Function
4. إعطائك رابطاً مثل `https://your-project.vercel.app`

---

## 3. كيف يعمل النظام بعد النشر

| المسار | الوجهة |
|-------|--------|
| `/` | الواجهة الرئيسية (React + Vite static) |
| `/api/ai/improve-summary` | دالة Vercel Serverless تستدعي OpenAI |

الواجهة تستخدم رابطاً نسبياً (`/api/ai/improve-summary`) — لذلك يعمل الكود نفسه:
- محلياً: عبر Vite proxy → خادم Express
- على Vercel: مباشرة إلى الـ Serverless Function

لا حاجة لتغيير أي كود بين البيئتين.

---

## 4. التحقق من النشر

بعد النشر، افتح الرابط وجرّب:
1. ادخل ملخصاً مهنياً قصيراً في الخطوة الأولى
2. اضغط زر **"تحسين النص"**
3. يجب أن ترى نصاً محسّناً خلال 2-5 ثوان

إذا ظهر خطأ، تحقق من:
- متغير `OPENAI_API_KEY` مضبوط بشكل صحيح
- الرصيد متوفر في حساب OpenAI
- اطلع على Logs في لوحة Vercel (Tab "Functions")

---

## 5. تحديثات لاحقة

أي `git push` إلى main سيُعيد النشر تلقائياً.
