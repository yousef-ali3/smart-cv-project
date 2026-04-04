import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useCVContext } from "@/context/CVContext";
import { PersonalInfo } from "@/types/cv";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Briefcase, Sparkles, Info } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  jobTitle: z.string().optional().default(""),
  email: z.string().email("البريد الإلكتروني غير صحيح").or(z.literal("")).default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  website: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  summary: z.string().optional().default(""),
});

type FormValues = z.infer<typeof schema>;

export default function PersonalInfoStep() {
  const { cvData, updateCVData } = useCVContext();
  const [improving, setImproving] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [originalSummary, setOriginalSummary] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: cvData.personalInfo,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      updateCVData({ personalInfo: values as PersonalInfo });
    });
    return () => subscription.unsubscribe();
  }, [form, updateCVData]);

  const handleImproveSummary = async () => {
    const text = form.getValues("summary") || "";
    if (!text.trim()) {
      alert("الرجاء كتابة ملخصك أولاً قبل التحسين.");
      return;
    }
    setImproving(true);
    try {
      const res = await fetch("/api/ai/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.improved) {
        setOriginalSummary(text);
        form.setValue("summary", data.improved);
        updateCVData({ personalInfo: { ...form.getValues(), summary: data.improved } });
      } else {
        alert("حدث خطأ أثناء التحسين. حاول مرة أخرى.");
      }
    } catch {
      alert("تعذّر الاتصال بالخدمة. تأكد من الاتصال بالإنترنت وحاول مجدداً.");
    } finally {
      setImproving(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (originalSummary === null) return;
    form.setValue("summary", originalSummary);
    updateCVData({ personalInfo: { ...form.getValues(), summary: originalSummary } });
    setOriginalSummary(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">المعلومات الشخصية</h2>
        <p className="text-sm text-muted-foreground">أدخل بياناتك الشخصية الأساسية</p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="flex items-center gap-2"><User className="w-4 h-4" />الاسم الكامل *</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} data-testid="input-full-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="flex items-center gap-2"><Briefcase className="w-4 h-4" />المسمى الوظيفي</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مهندس برمجيات | محاسب قانوني" {...field} data-testid="input-job-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4" />البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} data-testid="input-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Phone className="w-4 h-4" />رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="+966 5x xxx xxxx" {...field} data-testid="input-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4" />الموقع / المدينة</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الرياض، المملكة العربية السعودية" {...field} data-testid="input-location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Linkedin className="w-4 h-4" />LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/username" {...field} data-testid="input-linkedin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Globe className="w-4 h-4" />الموقع الشخصي</FormLabel>
                <FormControl>
                  <Input placeholder="www.myportfolio.com" {...field} data-testid="input-website" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <FormLabel className="mb-0">الملخص المهني</FormLabel>
                  <div className="flex items-center gap-2">
                    {/* Tooltip trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTip(true)}
                        onMouseLeave={() => setShowTip(false)}
                        onFocus={() => setShowTip(true)}
                        onBlur={() => setShowTip(false)}
                        className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        aria-label="معلومات عن تحسين النص"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      {showTip && (
                        <div className="absolute left-0 top-6 z-50 w-64 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-md leading-relaxed">
                          اكتب وصفك بشكل بسيط، ثم اضغط <strong>تحسين النص</strong> ليتم إعادة صياغته بطريقة احترافية مناسبة للسيرة الذاتية.
                        </div>
                      )}
                    </div>
                    {/* Improve button */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleImproveSummary}
                      disabled={improving}
                      className="h-7 text-xs gap-1.5 bg-black text-white hover:bg-black/80"
                      data-testid="button-improve-summary"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {improving ? "جارٍ التحسين..." : "تحسين النص"}
                    </Button>
                  </div>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="اكتب ملخصاً مختصراً عن خبراتك ومهاراتك وأهدافك المهنية..."
                    className="min-h-[100px] resize-none"
                    {...field}
                    data-testid="textarea-summary"
                  />
                </FormControl>
                {originalSummary !== null && (
                  <button
                    type="button"
                    onClick={handleRestoreOriginal}
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors mt-1 block"
                    data-testid="button-restore-summary"
                  >
                    ↩ رجوع للنص الأصل
                  </button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
