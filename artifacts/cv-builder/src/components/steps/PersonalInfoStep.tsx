import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useCVContext, CvLanguage } from "@/context/CVContext";
import { PersonalInfo } from "@/types/cv";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ProfessionalSummary from "@/components/ProfessionalSummary";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Briefcase,
} from "lucide-react";

const schema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  jobTitle: z.string().optional().default(""),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .or(z.literal(""))
    .default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  website: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  summary: z.string().optional().default(""),
});

type FormValues = z.infer<typeof schema>;

export default function PersonalInfoStep() {
  const { cvData, updateCVData, cvLanguage, setCvLanguage, selectedTemplate, setSelectedTemplate } = useCVContext();
  const isBilingual = cvLanguage === "bilingual";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: cvData.personalInfo.fullName,
      jobTitle: cvData.personalInfo.jobTitle,
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      location: cvData.personalInfo.location,
      website: cvData.personalInfo.website,
      linkedin: cvData.personalInfo.linkedin,
      summary: cvData.personalInfo.summary,
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      updateCVData({ personalInfo: { ...cvData.personalInfo, ...(values as PersonalInfo) } });
    });
    return () => subscription.unsubscribe();
  }, [form, updateCVData]);

  const updateEnField = (field: Partial<PersonalInfo>) => {
    updateCVData({ personalInfo: { ...cvData.personalInfo, ...field } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          المعلومات الشخصية
        </h2>
        <p className="text-sm text-muted-foreground">
          أدخل بياناتك الشخصية الأساسية
        </p>
      </div>

      {/* Language selector — first thing the user sees */}
      <div className="rounded-xl border border-border p-4 bg-muted/30 space-y-3">
        <p className="text-sm font-semibold text-foreground">لغة السيرة الذاتية</p>
        <div className="grid grid-cols-2 gap-3">
          {(["ar", "bilingual"] as CvLanguage[]).map((lang) => {
            const isSelected = cvLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setCvLanguage(lang);
                  if (lang === "bilingual" && selectedTemplate !== "bilingual") {
                    setSelectedTemplate("bilingual");
                  } else if (lang === "ar" && selectedTemplate === "bilingual") {
                    setSelectedTemplate("ats");
                  }
                }}
                className={`rounded-xl border-2 p-3 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-border hover:border-gray-400 bg-white text-foreground"
                }`}
              >
                <div className="text-lg mb-0.5">{lang === "ar" ? "🇸🇦" : "🌐"}</div>
                <div className="font-bold text-sm">{lang === "ar" ? "عربي فقط" : "عربي + إنجليزي"}</div>
                <div className={`text-xs mt-0.5 ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                  {lang === "ar" ? "Arabic only" : "Bilingual"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className={isBilingual ? "" : "sm:col-span-2"}>
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    data-testid="input-full-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English name — only when bilingual */}
          {isBilingual && (
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Full Name (English)
              </Label>
              <Input
                placeholder="First Last"
                dir="ltr"
                value={cvData.personalInfo.fullNameEn || ""}
                onChange={(e) => updateEnField({ fullNameEn: e.target.value })}
                data-testid="input-full-name-en"
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  المسمى الوظيفي
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="مثال: مهندس برمجيات | محاسب قانوني"
                    {...field}
                    data-testid="input-job-title"
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    data-testid="input-email"
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+966 5x xxx xxxx"
                    {...field}
                    data-testid="input-phone"
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  الموقع / المدينة
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="مثال: الرياض، المملكة العربية السعودية"
                    {...field}
                    data-testid="input-location"
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="linkedin.com/in/username"
                    {...field}
                    data-testid="input-linkedin"
                  />
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
                <FormLabel className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  الموقع الشخصي
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="www.myportfolio.com"
                    {...field}
                    data-testid="input-website"
                  />
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
                <ProfessionalSummary
                  value={field.value || ""}
                  onChange={(val) => {
                    form.setValue("summary", val, { shouldValidate: true });
                    updateCVData({
                      personalInfo: { ...cvData.personalInfo, ...form.getValues(), summary: val },
                    });
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {/* English summary — only when bilingual */}
      {isBilingual && (
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">English Fields</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Career Objective (English)</Label>
            <Textarea
              placeholder="I aspire to join your esteemed organization to contribute my knowledge and professional services..."
              dir="ltr"
              className="min-h-[100px] resize-none text-sm"
              value={cvData.personalInfo.summaryEn || ""}
              onChange={(e) => updateEnField({ summaryEn: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
