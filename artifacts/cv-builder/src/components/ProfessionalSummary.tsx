import { useState, useMemo, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  PenLine,
  Wand2,
  Plus,
  X,
} from "lucide-react";

// خيارات المساعد (Wizard)
const SPECIALTIES = [
  "تقنية المعلومات",
  "إدارة الأعمال",
  "محاسبة",
  "هندسة",
];

const GOALS = [
  "الحصول على وظيفة",
  "تطوير المهارات",
  "اكتساب خبرة",
];

const SKILLS = [
  "العمل ضمن فريق",
  "حل المشكلات",
  "التواصل",
  "البرمجة",
];

const LEVELS = ["مبتدئ", "متوسط", "متقدم"] as const;
type Level = (typeof LEVELS)[number];

// منطق إنشاء النص من خيارات المساعد
function buildSummary(opts: {
  specialty: string;
  goal: string;
  skills: string[];
  level: Level | "";
}): string {
  const { specialty, goal, skills, level } = opts;

  // إذا لم يُدخل المستخدم أي شيء
  if (!specialty && !goal && !skills.length && !level) {
    return "أسعى لتطوير مسيرتي المهنية واكتساب خبرات جديدة.";
  }

  const parts: string[] = [];

  // التخصص + الهدف
  if (specialty && goal) {
    parts.push(`أسعى للعمل في مجال ${specialty} لـ${goal}`);
  } else if (specialty) {
    parts.push(`أسعى للعمل في مجال ${specialty}`);
  } else if (goal) {
    parts.push(`أسعى لـ${goal}`);
  }

  // المهارات
  if (skills.length) {
    const skillsText =
      skills.length === 1
        ? skills[0]
        : skills.slice(0, -1).join("، ") + " و" + skills[skills.length - 1];
    parts.push(`وأمتلك مهارات مثل ${skillsText}`);
  }

  // مستوى الخبرة
  if (level === "مبتدئ") parts.push("وأطمح إلى اكتساب خبرة عملية");
  else if (level === "متوسط") parts.push("وأعمل على تطوير مهاراتي المهنية");
  else if (level === "متقدم") parts.push("وأهدف إلى تقديم قيمة مضافة للشركة");

  // ربط الجمل وإضافة نقطة في النهاية
  return parts.join(" ").trim() + ".";
}

type Mode = "manual" | "wizard";

interface ProfessionalSummaryProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ProfessionalSummary({
  value,
  onChange,
}: ProfessionalSummaryProps) {
  // الوضع الحالي: كتابة يدوية أو مساعد
  const [mode, setMode] = useState<Mode>("manual");

  // إظهار/إخفاء التلميح
  const [showTip, setShowTip] = useState(false);

  // حالة المساعد
  const [step, setStep] = useState(0);
  const [specialty, setSpecialty] = useState("");
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [level, setLevel] = useState<Level | "">("");

  // حالة زر النسخ
  const [copied, setCopied] = useState(false);

  // النص المولّد تلقائياً من اختيارات المساعد (Live Preview)
  const generatedText = useMemo(
    () => buildSummary({ specialty, goal, skills, level }),
    [specialty, goal, skills, level],
  );

  // تبديل اختيار مهارة (Checkbox)
  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  // إدخال مهارة مخصصة
  const [customSkill, setCustomSkill] = useState("");
  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkill("");
  };
  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  // نسخ النص إلى الحافظة
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // تجاهل بصمت
    }
  };

  // استخدام النص المولّد في حقل السيرة الذاتية
  const useInCV = () => {
    onChange(generatedText);
    setMode("manual");
  };

  // عناوين خطوات المساعد
  const stepTitles = [
    "التخصص",
    "الهدف الوظيفي",
    "المهارات",
    "مستوى الخبرة",
  ];
  const totalSteps = 4;

  return (
    <div className="space-y-3" dir="rtl">
      {/* العنوان + زر التلميح */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">
          الملخص المهني
        </label>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onFocus={() => setShowTip(true)}
            onBlur={() => setShowTip(false)}
            className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all duration-200 hover:scale-110"
            aria-label="معلومات عن الملخص المهني"
            data-testid="button-summary-tip"
          >
            <HelpCircle className="w-3 h-3" />
          </button>
          {showTip && (
            <div
              className="absolute right-0 top-7 z-50 w-72 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-md leading-relaxed animate-in fade-in-0 zoom-in-95 duration-200"
              role="tooltip"
            >
              يمكنك كتابة الملخص المهني بنفسك أو استخدام المساعد لإنشائه بسهولة
              من خلال خطوات بسيطة.
            </div>
          )}
        </div>
      </div>

      {/* اختيار الطريقة (Tabs) */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "manual"
              ? "bg-black text-white shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-manual"
        >
          <PenLine className="w-4 h-4" />
          كتابة يدوية
        </button>
        <button
          type="button"
          onClick={() => setMode("wizard")}
          className={`flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "wizard"
              ? "bg-black text-white shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-wizard"
        >
          <Wand2 className="w-4 h-4" />
          استخدام المساعد
        </button>
      </div>

      {/* وضع الكتابة اليدوية */}
      {mode === "manual" && (
        <Textarea
          placeholder="اكتب ملخصاً مختصراً عن خبراتك ومهاراتك وأهدافك المهنية..."
          className="min-h-[120px] resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid="textarea-summary"
        />
      )}

      {/* وضع المساعد */}
      {mode === "wizard" && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          {/* مؤشر الخطوات */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              الخطوة {step + 1} من {totalSteps}
            </span>
            <span className="text-sm font-semibold">{stepTitles[step]}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-black" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* خطوة 1 — التخصص (كتابة حرة + اقتراحات) */}
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                اكتب تخصصك المهني أو اختر من الاقتراحات (اختياري)
              </p>
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="مثال: تصميم جرافيك، تسويق رقمي، طب الأسنان..."
                data-testid="input-specialty"
              />
              <div className="flex flex-wrap gap-1.5">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpecialty(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      specialty === s
                        ? "bg-black text-white border-black"
                        : "border-border hover:bg-muted"
                    }`}
                    data-testid={`chip-specialty-${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* خطوة 2 — الهدف الوظيفي */}
          {step === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                ما هو هدفك الوظيفي؟ (اختياري)
              </p>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger data-testid="select-goal">
                  <SelectValue placeholder="اختر الهدف..." />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* خطوة 3 — المهارات (اختيار + كتابة حرة) */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                اختر من الاقتراحات أو اكتب مهاراتك الخاصة (اختياري)
              </p>

              {/* اقتراحات سريعة */}
              <div className="grid grid-cols-2 gap-2">
                {SKILLS.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 p-2 border border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={skills.includes(s)}
                      onCheckedChange={() => toggleSkill(s)}
                      data-testid={`checkbox-skill-${s}`}
                    />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>

              {/* إدخال مهارة مخصصة */}
              <div className="flex gap-2">
                <Input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="أضف مهارة أخرى ثم اضغط Enter..."
                  className="flex-1"
                  data-testid="input-custom-skill"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addCustomSkill}
                  className="bg-black text-white hover:bg-black/80"
                  data-testid="button-add-skill"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة
                </Button>
              </div>

              {/* عرض المهارات المختارة كـ chips */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-xs bg-black text-white rounded-full pr-2 pl-1 py-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                        aria-label={`حذف ${s}`}
                        data-testid={`button-remove-skill-${s}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* خطوة 4 — مستوى الخبرة */}
          {step === 3 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                ما هو مستوى خبرتك؟ (اختياري)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(level === l ? "" : l)}
                    className={`py-2 px-3 text-sm border rounded-md transition-all ${
                      level === l
                        ? "bg-black text-white border-black"
                        : "border-border hover:bg-muted"
                    }`}
                    data-testid={`button-level-${l}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              data-testid="button-wizard-prev"
            >
              <ChevronRight className="w-4 h-4 ml-1" />
              السابق
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              disabled={step === totalSteps - 1}
              className="bg-black text-white hover:bg-black/80"
              data-testid="button-wizard-next"
            >
              التالي
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </div>

          {/* عرض النتيجة (Live Preview) */}
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
              النص المولّد:
            </p>
            <div
              className="p-3 bg-muted rounded-md text-sm leading-relaxed min-h-[60px]"
              data-testid="text-generated-summary"
            >
              {generatedText}
            </div>

            {/* أزرار النسخ والاستخدام */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex-1"
                data-testid="button-copy-summary"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 ml-1" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-1" />
                    نسخ النص
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={useInCV}
                className="flex-1 bg-black text-white hover:bg-black/80"
                data-testid="button-use-summary"
              >
                استخدام في السيرة الذاتية
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
