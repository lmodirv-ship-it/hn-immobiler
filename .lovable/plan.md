
# المرحلة التالية من التطوير

نتابع بناء الميزات الأساسية التي تجعل المنصة منافسة لـ Booking / Airbnb / Avito، ثم نعود لاحقاً لدورة تصحيح شاملة.

## 1. نظام الدفع الإلكتروني (Stripe)

- تفعيل Stripe عبر Lovable
- Edge Function `create-checkout` لإنشاء جلسة دفع لكل حجز (بالدرهم MAD)
- Edge Function `stripe-webhook` لتحديث حالة الحجز والفاتورة تلقائياً
- زر "ادفع الآن" في صفحة الحجز و`Bookings.tsx`
- صفحة `/payment/success` و`/payment/cancel`
- تسجيل كل عملية في `payment_transactions` (الجدول موجود)

## 2. تقويم توفر متقدم

- مكوّن `AvailabilityCalendar` جديد على صفحة العقار
- منع الحجوزات المتضاربة (تحقق في قاعدة البيانات عبر trigger)
- أسعار موسمية: عمود `seasonal_pricing` (JSONB) في `properties`
- حساب السعر الإجمالي تلقائياً حسب عدد الليالي والموسم
- عرض الأيام المحجوزة بلون مختلف

## 3. نظام التقييمات والمراجعات

- تفعيل الجدول الموجود `reviews`
- السماح بالتقييم فقط بعد انتهاء حجز `completed`
- مكوّن `ReviewForm` (نجوم 1-5 + تعليق)
- عرض التقييمات في صفحة العقار مع متوسط النجوم
- شارة "Superhost" للمالكين بمتوسط ≥ 4.5 و10 تقييمات+

## 4. لوحة تحكم موحّدة أوضح

- Sidebar جانبي بدل الشبكة الحالية في `/dashboard`
- تقسيم واضح: عام | كمستأجر | كمالك | كأدمن
- مؤشرات حية (badges) لكل قسم

## التفاصيل التقنية

### قاعدة البيانات
```sql
-- منع الحجوزات المتضاربة
CREATE FUNCTION prevent_booking_overlap() ...
-- عمود الأسعار الموسمية
ALTER TABLE properties ADD COLUMN seasonal_pricing JSONB DEFAULT '{}';
-- تحقق: لا تقييم إلا بعد حجز مكتمل
CREATE POLICY reviews_after_completed_booking ON reviews ...
```

### الملفات الجديدة
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `src/pages/PaymentSuccess.tsx`, `PaymentCancel.tsx`
- `src/components/AvailabilityCalendar.tsx`
- `src/components/ReviewForm.tsx`, `ReviewList.tsx`
- `src/components/DashboardSidebar.tsx`
- `src/hooks/useReviews.ts`, `usePayment.ts`

### الملفات المعدّلة
- `src/pages/PropertyDetail.tsx` — تقويم + تقييمات
- `src/pages/dashboard/Bookings.tsx` — زر الدفع
- `src/pages/Dashboard.tsx` — sidebar جديد
- migration جديدة للأسعار الموسمية ومنع التضارب

## بعد الإنجاز
نعود لدورة QA شاملة: مراجعة الأخطاء، اختبار كل الأدوار، وإصلاح مشاكل UX.
