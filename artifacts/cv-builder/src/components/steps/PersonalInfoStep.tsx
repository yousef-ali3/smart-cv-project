import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useCVContext } from "@/context/CVContext";
import { PersonalInfo } from "@/types/cv";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Briefcase } from "lucide-react";

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
                <FormLabel>الملخص المهني</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="اكتب ملخصاً مختصراً عن خبراتك ومهاراتك وأهدافك المهنية..."
                    className="min-h-[100px] resize-none"
                    {...field}
                    data-testid="textarea-summary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
