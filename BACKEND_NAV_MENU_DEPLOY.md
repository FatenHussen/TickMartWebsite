# Backend — نشر `GET /api/user/nav-menu` وتفعيل القائمة العلوية

## 1) الوضع الحالي

الويب صار عنده ميزة **قائمة تنقّل علوية مُدارة من الداشبورد** (`src/features/navigation/`)، وتستدعي على كل صفحة:

```http
GET /api/user/nav-menu
Accept-Language: ar | en
```

على سيرفر الإنتاج الطلب يرجع **404**:

```
The route api/user/nav-menu could not be found.
Symfony\Component\HttpKernel\Exception\NotFoundHttpException
/var/www/octopus/tikmool-backend/...
```

الكود جاهز محلياً بالباك (الـ route بالسطر 236 + `NavMenuController` + الـ service)،
بس الملفات **untracked بالـ git وما انرفعت** — يعني ما في أي تعديل كود مطلوب،
**المطلوب فقط: commit + deploy**.

الويب ما ينكسر بهالوضع — ما في قائمة احتياطية hardcoded، فالصف كامل تبع القائمة
العلوية **بيختفي** (نفس سلوك `data` فاضية)، وخطأ 404 يظهر بالـ console على كل صفحة.
يعني الموقع شغّال بس بدون شريط تنقّل علوي لحد ما ينرفع الـ endpoint.

---

## 2) خطوات الرفع المطلوبة

### 2.1 على جهاز التطوير

```bash
# تأكد شو الملفات الجديدة (لازم تشمل الـ controller والـ service وأي migration/seeder/model)
git status

git add routes/api.php app/Http/Controllers/.../NavMenuController.php app/Services/.../NavMenuService.php
# + أي migration / model / resource تابعين للميزة

git commit -m "feat: add public nav-menu endpoint"
git push
```

### 2.2 على السيرفر

```bash
git pull
composer install --no-dev   # إذا انضافت dependencies
php artisan migrate         # إذا الميزة معها جداول جديدة
```

### 2.3 مسح كاش الـ routes — **الخطوة الأهم**

إذا السيرفر مفعّل عليه `route:cache` (الوضع المعتاد بالإنتاج)، الـ route الجديد
**رح يضل يرجع 404 حتى لو الكود موجود** إلى أن ينعاد بناء الكاش:

```bash
php artisan route:clear
php artisan route:cache
php artisan config:clear    # إذا انضافت config جديدة
```

### 2.4 تحقق محلي/على السيرفر

```bash
php artisan route:list --path=api/user/nav-menu
```

لازم يظهر سطر واحد: `GET|HEAD  api/user/nav-menu`.

---

## 3) العقد اللي الويب يتوقعه (للتحقق بعد الرفع)

- الـ endpoint **عام** — بدون توكن.
- يرجع **العناصر المفعّلة فقط**، مرتبة حسب `order` تصاعدياً — الويب يعرضها بترتيب الوصول وما يعيد الترتيب.
- `title` يرجع **نص واحد** بلغة الطلب حسب هيدر `Accept-Language` (مو object بشكل `{ar, en}`).

### شكل الاستجابة

```json
{
  "status": true,
  "message": "...",
  "data": [
    {
      "id": 1,
      "title": "التصنيفات",
      "type": "category",
      "icon": "https://.../icon.webp",
      "order": 1,
      "open_in_new_tab": false,
      "target": { "category_id": 5, "name": "إلكترونيات" }
    }
  ]
}
```

- `icon`: رابط صورة مطلق أو `null` (الويب يعرض العنصر نص فقط إذا `null`).

### الأنواع وحقول `target` المطلوبة لكل نوع

| `type` | الحقل المطلوب في `target` | ملاحظات |
|---|---|---|
| `route` | `route_key` | القيم المدعومة تحت؛ أي قيمة غير معروفة **الويب يُسقط العنصر بصمت** |
| `category` | `category_id` | رقم صحيح موجب |
| `brand` | `brand_id` | رقم صحيح موجب |
| `page` | `slug` | ما في Page Builder renderer بالويب حالياً — يُحل فقط إذا الـ slug يطابق صفحة معروفة |
| `url` | `url` | روابط `http/https` فقط؛ أي شي غيره يُسقَط (حماية من `javascript:`) |

### قيم `route_key` المدعومة بالويب حالياً

```
home, categories, brands, shops | shop | store, baskets | my-baskets,
schedules | schedule | custom-basket | custom-baskets,
points | points-rewards, help | help-support, recipes, products,
privacy, terms, subscriptions | subscription-packages
```

- الشاشات الثابتة الرسمية من الداشبورد (`GET /api/admin/nav-menu-items/route-keys`):
  `baskets` → `/baskets`، **`schedules` → `/schedules`**. جدولة **ليست** صفحة Page Builder (`type=page`) — لازم `type=route`.
- `subscriptions` / `subscription-packages` ما إلها صفحة بالويب — تفتح **مودال باقات الاشتراك**.
- الويب يطبّع المفتاح: `points_rewards` و `points-rewards` والحالة الكبيرة/الصغيرة كلها مقبولة.
- أي `route_key` جديد بالداشبورد غير موجود بالقائمة أعلاه يُسقَط بالويب بدون خطأ — إذا بدكم مفتاح جديد، بلّغوا فريق الويب ليضيفوه بالـ `NAV_ROUTE_MAP`.

---

## 4) التحقق بعد الـ deploy

```bash
curl -H "Accept-Language: ar" https://<API_HOST>/api/user/nav-menu
curl -H "Accept-Language: en" https://<API_HOST>/api/user/nav-menu
```

- [ ] الاثنين يرجعوا **200** مع `data` مصفوفة (حتى لو فاضية — الويب يتعامل معها).
- [ ] `title` يتغيّر مع تغيّر `Accept-Language`.
- [ ] العناصر مرتبة حسب `order` والمعطّلة ما تظهر.
- [ ] بعدها من الداشبورد: ضيفوا/فعّلوا عناصر القائمة الفعلية.

> ملاحظة: الويب يكاشي القائمة **5 دقائق لكل لغة** — أي تعديل بالداشبورد يظهر
> على الموقع خلال 5 دقائق كحد أقصى (أو مباشرة بعد refresh مع كاش فاضي).

---

## 5) موضوع منفصل: المنتجان 23 و24 غير قابلين للشراء

هذا **مو خطأ كود** — لا بالويب ولا بالباك. الـ API يرجع لهالمنتجات الـ fallback variant
(`id`/`shop_id` = `null`)، والويب صار يعرض الصفحة كاملة مع زر «غير متوفر حالياً» معطّل.

حتى يصير الشراء ممكن: لازم **ربط المنتج بمتغيّر + فرع من الداشبورد**
(التفاصيل بـ `FRONTEND_DASHBOARD_PRODUCT_VARIANTS_SAVE.md`).
أول ما ينربط، زر السلة يشتغل بدون أي تعديل إضافي بالويب.

---

## 6) ملاحظة جانبية — أخطاء 401 بالـ console

أثناء الفحص ظهرت أخطاء 401 على endpoints مثل المفضلة و`can-rate` لما المستخدم
**غير مسجّل دخول** — هذا سلوك صحيح من الباك وما يحتاج أي إجراء.

---

## 7) Checklist النهائي

- [ ] ملفات الميزة committed & pushed (route + controller + service + migrations إن وجدت)
- [ ] `php artisan migrate` على السيرفر (إذا في جداول)
- [ ] `php artisan route:clear && php artisan route:cache` على السيرفر
- [ ] `route:list` يظهر `api/user/nav-menu`
- [ ] `curl` بالعربي والإنكليزي يرجع 200 بالشكل المتوقع
- [ ] عناصر القائمة مضافة ومفعّلة بالداشبورد
- [ ] (داشبورد) ربط المنتجين 23 و24 بمتغيّر + فرع حتى يتفعّل الشراء
