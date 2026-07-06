# لوحة تحكم المالك المتقدمة

أعتذر عن التأخير. سأبني الآن لوحة تحكم احترافية متكاملة للمالك بواجهة موحّدة (Sidebar + Layout مشترك) بدل الصفحات المتناثرة.

## الهيكل الجديد

```text
/owner                          → نظرة عامة (KPIs + رسوم بيانية)
/owner/properties               → عقاراتي (جدول + فلترة + نشر/إخفاء)
/owner/properties/new           → إضافة عقار
/owner/properties/:id/edit      → تعديل + صور + توفر + أسعار موسمية
/owner/bookings                 → الحجوزات (قبول/رفض/محادثة)
/owner/calendar                 → تقويم شامل لكل العقارات
/owner/messages                 → محادثات الضيوف
/owner/reviews                  → التقييمات + الرد عليها
/owner/invoices                 → الفواتير + تصدير CSV/PDF
/owner/maintenance              → طلبات الصيانة
/owner/analytics                → تحليلات (زيارات، دخل، معدل إشغال)
/owner/payouts                  → المدفوعات والحساب البنكي
/owner/settings                 → الملف الشخصي + الإشعارات
```

## المكوّنات الجديدة

- `src/layouts/OwnerLayout.tsx` — Sidebar ثابت + Topbar + Breadcrumb + حماية (يتطلب `isOwner`)
- `src/components/owner/OwnerSidebar.tsx` — قائمة جانبية قابلة للطي، badges حية (حجوزات جديدة، رسائل غير مقروءة، طلبات صيانة)
- `src/components/owner/KpiCard.tsx` — بطاقة إحصائية مع مقارنة شهرية
- `src/components/owner/RevenueChart.tsx` — منحنى الدخل (recharts)
- `src/components/owner/OccupancyChart.tsx` — معدل الإشغال
- `src/components/owner/BookingsTable.tsx` — جدول متقدم مع فلترة/بحث/تصدير
- `src/components/owner/CalendarMultiProperty.tsx` — تقويم شامل ملوّن حسب العقار
- `src/components/owner/SeasonalPricingEditor.tsx` — محرر أسعار موسمية (JSONB)
- `src/components/owner/PayoutSettings.tsx` — إدارة `bank_accounts`

## الصفحات

- `src/pages/owner/Overview.tsx` — 4 KPIs (دخل الشهر، حجوزات معلقة، إشغال، متوسط التقييم) + رسمين + آخر النشاطات
- `src/pages/owner/Properties.tsx` — جدول عقاراتي (بديل `MyProperties.tsx`)
- `src/pages/owner/PropertyEdit.tsx` — تبويبات: معلومات / صور / توفر / أسعار / ميزات
- `src/pages/owner/Bookings.tsx` — نسخة موسّعة من `dashboard/Bookings.tsx`
- `src/pages/owner/Calendar.tsx`
- `src/pages/owner/Reviews.tsx` — قائمة التقييمات مع إمكانية الرد
- `src/pages/owner/Payouts.tsx`
- `src/pages/owner/Settings.tsx`

## Hooks

- `src/hooks/useOwnerStats.ts` — دخل شهري، إشغال، KPIs
- `src/hooks/useOwnerBookings.ts` — حجوزات كل عقارات المالك مع Realtime
- `src/hooks/useOwnerNotifications.ts` — badges حية للـ Sidebar

## قاعدة البيانات (migration واحدة)

```sql
-- الرد على التقييمات
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS owner_reply TEXT,
                    ADD COLUMN IF NOT EXISTS owner_reply_at TIMESTAMPTZ;

-- دالة إحصائيات المالك (Security Definer)
CREATE FUNCTION public.get_owner_stats(_owner UUID)
RETURNS TABLE(month_revenue NUMERIC, pending_bookings BIGINT,
              occupancy_rate NUMERIC, avg_rating NUMERIC, total_properties BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ ... $$;

-- Realtime على bookings و reviews
ALTER PUBLICATION supabase_realtime ADD TABLE bookings, reviews;
```

## تعديلات

- `src/App.tsx` — إضافة كل مسارات `/owner/*` تحت `OwnerLayout`
- `src/pages/Dashboard.tsx` — قسم المالك يُحوّل تلقائياً إلى `/owner`
- `src/components/Header.tsx` — رابط "لوحة المالك" للمالكين

## بعد الإنجاز

سأنتقل لدورة QA شاملة: اختبار كل مسار، فحص RLS، وإصلاح الأخطاء المتراكمة.
