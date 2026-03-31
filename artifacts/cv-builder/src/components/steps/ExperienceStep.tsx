import { useState } from "react";
import { useCVContext } from "@/context/CVContext";
import { Experience } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp } from "lucide-react";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function ExperienceCard({
  exp,
  index,
  onUpdate,
  onDelete,
}: {
  exp: Experience;
  index: number;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="border border-border" data-testid={`card-experience-${exp.id}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">
              {exp.jobTitle || `الخبرة العملية ${index + 1}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-toggle-exp-${exp.id}`}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(exp.id)}
              data-testid={`button-delete-exp-${exp.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">المسمى الوظيفي *</Label>
              <Input
                placeholder="مطور برمجيات أول"
                value={exp.jobTitle}
                onChange={(e) => onUpdate(exp.id, { jobTitle: e.target.value })}
                data-testid={`input-exp-title-${exp.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">اسم الشركة / المؤسسة *</Label>
              <Input
                placeholder="شركة أرامكو السعودية"
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
                data-testid={`input-exp-company-${exp.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الموقع</Label>
              <Input
                placeholder="الرياض، السعودية"
                value={exp.location}
                onChange={(e) => onUpdate(exp.id, { location: e.target.value })}
                data-testid={`input-exp-location-${exp.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">تاريخ البداية</Label>
              <Input
                placeholder="يناير 2020"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
                data-testid={`input-exp-start-${exp.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">تاريخ الانتهاء</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="ديسمبر 2023"
                  value={exp.current ? "حتى الآن" : exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
                  data-testid={`input-exp-end-${exp.id}`}
                />
              </div>
            </div>
            <div className="space-y-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => onUpdate(exp.id, { current: e.target.checked, endDate: e.target.checked ? "" : exp.endDate })}
                  className="rounded"
                  data-testid={`checkbox-exp-current-${exp.id}`}
                />
                <span className="text-xs">أعمل هنا حالياً</span>
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">المهام والإنجازات</Label>
            <Textarea
              placeholder={`• قيادة فريق تقني من 5 مطورين
• تطوير منصة إلكترونية زادت المبيعات بنسبة 30%
• تحسين أداء قاعدة البيانات بنسبة 40%`}
              className="min-h-[100px] resize-none text-sm"
              value={exp.description}
              onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
              data-testid={`textarea-exp-desc-${exp.id}`}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ExperienceStep() {
  const { cvData, updateCVData } = useCVContext();

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    updateCVData({ experience: [...cvData.experience, newExp] });
  };

  const updateExperience = (id: string, data: Partial<Experience>) => {
    updateCVData({
      experience: cvData.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
    });
  };

  const deleteExperience = (id: string) => {
    updateCVData({ experience: cvData.experience.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">الخبرات العملية</h2>
        <p className="text-sm text-muted-foreground">أضف خبراتك المهنية بالترتيب من الأحدث إلى الأقدم</p>
      </div>

      <div className="space-y-3">
        {cvData.experience.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            index={index}
            onUpdate={updateExperience}
            onDelete={deleteExperience}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addExperience}
        data-testid="button-add-experience"
      >
        <Plus className="w-4 h-4 mr-2" />
        إضافة خبرة عملية
      </Button>
    </div>
  );
}
