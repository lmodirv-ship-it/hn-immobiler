# تطوير المنصة — Booking + Airbnb + Avito

خطة تنفيذ على 3 مراحل (سأنفّذها تباعاً بدون توقّف).

## المرحلة 1 — قاعدة البيانات والصلاحيات
- توسيع `app_role`: إضافة `tenant` و`visitor` بجانب (`user`, `owner`, `agent`, `agency`, `admin`)
- جدول `bookings` (نمط Booking/Airbnb): حجوزات قصيرة الأمد
  - property_id, guest_id, host_id, check_in, check_out, guests, total_price, currency, status (pending/confirmed/cancelled/completed), payment_status, special_requests
- جدول `property_availability`: تقويم توفّر + تسعير ديناميكي (تاريخ، سعر ليلة، متاح/محجوز)
- جدول `admin_audit_log`: سجل أعمال الإدارة
- جدول `property_analytics`: عرض مجمّع (مشاهدات/مفضلة/طلبات) لكل عقار
- سياسات RLS كاملة + GRANTs
- Trigger: تعيين host_id تلقائياً من owner_id للعقار

## المرحلة 2 — لوحة تحكم المالك المتقدمة
`/dashboard/properties` توسّع إلى:
- **نظرة عامة**: مبيعات/إيرادات/معدل إشغال/تقييم متوسط
- **الحجوزات**: قبول/رفض/تأكيد + محادثة مع الضيف
- **التقويم**: عرض شهري لكل عقار مع تعديل السعر والتوفّر
- **الإحصاءات**: مشاهدات، مفضلة، طلبات اتصال (رسم بياني)
- **الرسائل**: صندوق موحّد
- **العقارات**: قائمة مع حالة (نشط/معلّق/محجوز)

## المرحلة 3 — لوحة الإدارة + نظام الأدوار
- `/admin` صفحة رئيسية للإدارة
- `/admin/users` قائمة كل المستخدمين + تغيير الأدوار
- `/admin/properties` مراجعة/تعليق/تمييز العقارات
- `/admin/bookings` كل الحجوزات
- سجل الأعمال
- في لوحة المستخدم العادي: زر «كن مالكاً/وكالة» يطلب ترقية دور (تُراجع من الإدارة)

## البنية التقنية
```text
src/pages/dashboard/
  Overview.tsx        (موجود ← تحسين)
  Bookings.tsx        (جديد)
  Calendar.tsx        (جديد)
  Analytics.tsx       (جديد)
src/pages/admin/
  Users.tsx           (جديد)
  Properties.tsx      (جديد)
  Bookings.tsx        (جديد)
  Payments.tsx        (موجود)
src/hooks/
  useBookings.ts, useAvailability.ts, useAdmin.ts
```

سأبدأ الآن بالمرحلة 1 (Migration) ثم أواصل مباشرة إلى المرحلتين 2 و3.
