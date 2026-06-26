import { useState } from "react";
import { useCVContext } from "@/context/CVContext";
import { Education } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function EducationCard({
  edu,
  index,
  isBilingual,
  onUpdate,
  onDelete,
}: {
  edu: Education;
  index: number;
  isBilingual: boolean;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="border border-border" data-testid={`card-education-${edu.id}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">
              {edu.degree || `المؤهل العلمي ${index + 1}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-toggle-edu-${edu.id}`}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(edu.id)}
              data-testid={`button-delete-edu-${edu.id}`}
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
              <Label className="text-xs">الدرجة العلمية / المؤهل *</Label>
              <Input
                placeholder="بكالوريوس، ماجستير، دبلوم..."
                value={edu.degree}
                onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
                data-testid={`input-edu-degree-${edu.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">التخصص</Label>
              <Input
                placeholder="هندسة الحاسوب، إدارة الأعمال..."
                value={edu.field}
                onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
                data-testid={`input-edu-field-${edu.id}`}
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs">الجامعة / المؤسسة التعليمية *</Label>
              <Input
                placeholder="جامعة الملك سعود"
                value={edu.institution}
                onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
                data-testid={`input-edu-institution-${edu.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">سنة التخرج</Label>
              <Input
                placeholder="مثال: 2022"
                value={edu.endDate}
                onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
                data-testid={`input-edu-end-${edu.id}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">المعدل التراكمي (اختياري)</Label>
              <Input
                placeholder="4.5 / 5.0"
                value={edu.gpa}
                onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
                data-testid={`input-edu-gpa-${edu.id}`}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">تفاصيل إضافية (اختياري)</Label>
            <Textarea
              placeholder="الأنشطة، الإنجازات، المشاريع..."
              className="min-h-[70px] resize-none text-sm"
              value={edu.description}
              onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
              data-testid={`textarea-edu-desc-${edu.id}`}
            />
          </div>

          {/* English fields — bilingual only */}
          {isBilingual && (
            <div className="border-t pt-3 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">English Fields</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Degree</Label>
                  <Input
                    placeholder="Bachelor's, Master's..."
                    dir="ltr"
                    value={edu.degreeEn || ""}
                    onChange={(e) => onUpdate(edu.id, { degreeEn: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Major / Field</Label>
                  <Input
                    placeholder="Computer Science, Business..."
                    dir="ltr"
                    value={edu.fieldEn || ""}
                    onChange={(e) => onUpdate(edu.id, { fieldEn: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs">Institution</Label>
                  <Input
                    placeholder="King Saud University"
                    dir="ltr"
                    value={edu.institutionEn || ""}
                    onChange={(e) => onUpdate(edu.id, { institutionEn: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function EducationStep() {
  const { cvData, updateCVData, cvLanguage } = useCVContext();
  const isBilingual = cvLanguage === "bilingual";

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      degree: "",
      institution: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    };
    updateCVData({ education: [...cvData.education, newEdu] });
  };

  const updateEducation = (id: string, data: Partial<Education>) => {
    updateCVData({
      education: cvData.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
    });
  };

  const deleteEducation = (id: string) => {
    updateCVData({ education: cvData.education.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">المؤهلات العلمية</h2>
        <p className="text-sm text-muted-foreground">أضف مؤهلاتك الأكاديمية بالترتيب الزمني من الأحدث</p>
      </div>

      <div className="space-y-3">
        {cvData.education.map((edu, index) => (
          <EducationCard
            key={edu.id}
            edu={edu}
            index={index}
            isBilingual={isBilingual}
            onUpdate={updateEducation}
            onDelete={deleteEducation}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addEducation}
        data-testid="button-add-education"
      >
        <Plus className="w-4 h-4 mr-2" />
        إضافة مؤهل علمي
      </Button>
    </div>
  );
}
