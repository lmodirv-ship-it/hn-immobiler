

## الوضع الحالي بصراحة

عندك 11 صفحة مصممة بصرياً، ولكن **معظم الميزات اللي طلبتها فالخطة الأصلية (`.lovable/plan.md`) ماتفعلاتش بعد**. الموقع كيبان شيك من بَرّا، ولكن داخلياً كيخدم بـ mock data وأغلب الصفحات الوظيفية ناقصة.

## ما تم فعلاً

- التصميم الهولوغرافي + الترجمة FR/AR
- 11 صفحة UI
- Lovable Cloud + جداول قاعدة البيانات
- تسجيل دخول (Email + Google)

## ما هو ناقص من خطتك الأصلية

| المرحلة فالخطة | الحالة |
|---|---|
| Sprint 2: ربط العقارات بـ DB + رفع الصور | ❌ |
| Sprint 3: بحث متقدم + خريطة Leaflet | ❌ |
| Sprint 4: معرض وسائط + جولة 360° + PDF | ❌ |
| Sprint 5: مفضلة + مقارنة + رسائل + حجوزات | ❌ |
| Sprint 6: لوحة المالك/الوكيل | ❌ |
| Sprint 7: AI Chatbot + مقدّر الأسعار | ❌ |
| Sprint 8: Admin Dashboard + مراجعات + Verified | ❌ |
| Sprint 9: PWA + SEO متقدم + لغات إضافية | ❌ |

## الخطة المقترحة دابا — Sprint 2 كامل

هاد السبرنت هو الأساس باش كل شي اللي بعدو يخدم. بدونها Admin Dashboard ومقدّر الأسعار وكلشي ماغيخدمو.

### 1. ربط PropertyList بقاعدة البيانات
- استبدال `mockProperties` بـ query حقيقي من جدول `properties`
- جلب الصور من جدول `property_images`
- الفلاتر (نوع، مدينة، بيع/كراء) تخدم على DB
- إضافة فلتر السعر (slider مزدوج) + عدد الغرف

### 2. ربط PropertyDetail بقاعدة البيانات
- جلب العقار + كل صوره من DB حسب `:id`
- نموذج التواصل يكتب فـ `contact_requests`
- زر "أضف للمفضلة" يكتب فـ `favorites` (للمستخدمين المسجلين)
- زر WhatsApp مباشر

### 3. صفحة "إضافة عقار" `/dashboard/properties/new`
- فورم كامل (عنوان، وصف، سعر، مساحة، غرف، مدينة، عنوان، نوع، بيع/كراء، ميزات)
- رفع صور متعددة لـ Storage bucket `property-media`
- محمية بـ ProtectedRoute (owner/agent/admin فقط)
- بعد الحفظ → redirect لصفحة العقار

### 4. صفحة "عقاراتي" `/dashboard/properties`
- جدول/grid فيه عقارات المستخدم المسجل
- أزرار: تعديل، حذف، تفعيل/إيقاف
- زر "+ إضافة عقار جديد"

### 5. صفحة "المفضلة" `/favorites`
- عرض العقارات المحفوظة من جدول `favorites`
- زر إزالة

### 6. ربط Dashboard الرئيسي
- إحصائيات حقيقية: عدد عقاراتي، عدد المفضلة، عدد الرسائل
- روابط شغالة لكل الأقسام أعلاه

### 7. Seed data
- إدخال 8-12 عقار تجريبي حقيقي فـ DB (مدن مغربية: الدار البيضاء، الرباط، مراكش، طنجة، أكادير) باش الموقع يبان معمور

## التفاصيل التقنية

- **Storage bucket**: `property-media` (public read, authenticated write) — موجود؟ نتحقق ونصاوب RLS
- **RLS policies**: 
  - `properties`: قراءة عامة، كتابة للمالك فقط
  - `favorites`: المستخدم يقرا/يكتب/يمسح غير ديالو
  - `property_images`: قراءة عامة، كتابة للمالك
  - `contact_requests`: insert مفتوح، read للمالك فقط
- **React Query**: لجلب البيانات + cache + invalidation بعد mutations
- **Forms**: react-hook-form + zod validation
- **Image upload**: drag-and-drop مع preview قبل الرفع

## ما خارج هاد السبرنت (سبرنتات قادمة)

- خريطة Leaflet التفاعلية → Sprint 3
- Admin Dashboard → Sprint 8
- AI Chatbot ومقدّر الأسعار → Sprint 7
- PWA + SEO متقدم → Sprint 9

## بعد الموافقة

نبدا تنفيذ Sprint 2 كامل فـ default mode، ونوريك كل صفحة مربوطة بقاعدة بيانات حقيقية.

