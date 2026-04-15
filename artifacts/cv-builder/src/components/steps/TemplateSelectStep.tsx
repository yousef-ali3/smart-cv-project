import { useCVContext, TemplateId } from "@/context/CVContext";
import { Check } from "lucide-react";

const templates: {
  id: TemplateId;
  name: string;
  nameEn: string;
  badge?: string;
  advantages: string[];
  preview: React.ReactNode;
}[] = [
  {
    id: "ats",
    name: "الاحترافي ATS",
    nameEn: "ATS Classic",
    badge: "مثالي للتوظيف",
    advantages: [
      "متوافق 100% مع أنظمة التوظيف الآلي",
      "تصميم نظيف يقرأه البشر والأنظمة بسهولة",
      "مناسب للشركات الكبرى والمتعددة الجنسيات",
      "الأمثل لإرسال السيرة إلكترونياً",
    ],
    preview: (
      <div className="w-full h-full bg-white p-2 text-right" dir="rtl">
        <div className="text-center border-b-2 border-black pb-1.5 mb-1.5">
          <div className="h-2.5 bg-black rounded w-24 mx-auto mb-1" />
          <div className="h-1.5 bg-gray-400 rounded w-16 mx-auto mb-1" />
          <div className="flex justify-center gap-1">
            <div className="h-1 bg-gray-300 rounded w-10" />
            <div className="h-1 bg-gray-300 rounded w-10" />
          </div>
        </div>
        {["خبرة", "تعليم", "مهارات"].map((s) => (
          <div key={s} className="mb-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="h-1 bg-black rounded w-8" />
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="h-1 bg-gray-200 rounded w-full mb-0.5" />
            <div className="h-1 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "modern",
    name: "العصري",
    nameEn: "Modern",
    advantages: [
      "تصميم حديث وأنيق يلفت الانتباه",
      "مناسب لشركات التقنية والإبداع",
      "يُبرز المعلومات بتنسيق واضح",
      "مميز بين القسم والقسم",
    ],
    preview: (
      <div className="w-full h-full bg-white p-2 text-right" dir="rtl">
        <div className="border-r-4 border-black pr-2 mb-2">
          <div className="h-2.5 bg-black rounded w-20 mb-0.5" />
          <div className="h-1.5 bg-gray-400 rounded w-14 mb-1" />
          <div className="flex gap-1">
            <div className="h-1 bg-gray-300 rounded w-8" />
            <div className="h-1 bg-gray-300 rounded w-8" />
          </div>
        </div>
        {["خبرة", "تعليم", "مهارات"].map((s) => (
          <div key={s} className="mb-1.5 border-r-2 border-gray-400 pr-1.5">
            <div className="h-1.5 bg-gray-700 rounded w-10 mb-0.5" />
            <div className="h-1 bg-gray-200 rounded w-full mb-0.5" />
            <div className="h-1 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "corporate",
    name: "المؤسسي",
    nameEn: "Corporate",
    advantages: [
      "مظهر رسمي يناسب القطاع الحكومي والمالي",
      "يُعطي انطباعاً أولياً قوياً",
      "رأس الصفحة يبرز اسمك بشكل استثنائي",
      "مثالي للوظائف القيادية والإدارية",
    ],
    preview: (
      <div className="w-full h-full bg-white text-right" dir="rtl">
        <div className="bg-black text-white p-2 mb-1.5">
          <div className="h-2.5 bg-white/80 rounded w-20 mb-0.5" />
          <div className="h-1.5 bg-white/50 rounded w-14 mb-1" />
          <div className="flex gap-1">
            <div className="h-1 bg-white/40 rounded w-8" />
            <div className="h-1 bg-white/40 rounded w-8" />
          </div>
        </div>
        <div className="px-2">
          {["خبرة", "تعليم", "مهارات"].map((s) => (
            <div key={s} className="mb-1.5">
              <div className="h-1.5 bg-black rounded w-10 mb-0.5" />
              <div className="h-px bg-gray-300 mb-0.5" />
              <div className="h-1 bg-gray-200 rounded w-full mb-0.5" />
              <div className="h-1 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "البسيط الأنيق",
    nameEn: "Minimal",
    advantages: [
      "تصميم بسيط يُركز على المحتوى",
      "مريح للعين وسهل القراءة",
      "مناسب لجميع المجالات والتخصصات",
      "يمنح إحساساً بالاحترافية دون تعقيد",
    ],
    preview: (
      <div className="w-full h-full bg-white p-2 text-right" dir="rtl">
        <div className="mb-2">
          <div className="h-2.5 bg-gray-900 rounded w-20 mb-0.5" />
          <div className="h-1.5 bg-gray-400 rounded w-14 mb-1" />
          <div className="flex gap-2">
            <div className="h-0.5 bg-gray-200 rounded w-8" />
            <div className="h-0.5 bg-gray-200 rounded w-8" />
            <div className="h-0.5 bg-gray-200 rounded w-8" />
          </div>
        </div>
        {["خبرة", "تعليم", "مهارات"].map((s) => (
          <div key={s} className="mb-2">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="w-1 h-1 rounded-full bg-gray-500" />
              <div className="h-1 bg-gray-500 rounded w-8" />
            </div>
            <div className="h-0.5 bg-gray-100 rounded w-full mb-0.5" />
            <div className="h-1 bg-gray-100 rounded w-full mb-0.5" />
            <div className="h-1 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    ),
  },
];

export default function TemplateSelectStep() {
  const { selectedTemplate, setSelectedTemplate } = useCVContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">اختيار القالب</h2>
        <p className="text-sm text-muted-foreground">اختر القالب الذي يناسبك — المعاينة تتحدث فوراً</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((t) => {
          const isSelected = selectedTemplate === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`relative rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? "border-black shadow-lg"
                  : "border-border hover:border-gray-400"
              }`}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Badge */}
              {t.badge && (
                <div className="absolute top-2 right-2 z-10 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t.badge}
                </div>
              )}

              {/* Mini preview */}
              <div className="h-36 bg-gray-50 border-b border-border overflow-hidden">
                <div className="w-full h-full scale-[0.85] origin-top">
                  {t.preview}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-foreground">{t.name}</h3>
                  <span className="text-[10px] text-muted-foreground">{t.nameEn}</span>
                </div>
                <ul className="space-y-1">
                  {t.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-0.5 text-black font-bold shrink-0">✓</span>
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
