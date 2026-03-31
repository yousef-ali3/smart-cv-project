import { useState } from "react";
import { useCVContext } from "@/context/CVContext";
import { Skill, Language, Course } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Zap, Globe, BookOpen } from "lucide-react";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const skillLevels: Skill["level"][] = ["مبتدئ", "متوسط", "متقدم", "خبير"];
const languageLevels: Language["level"][] = ["مبتدئ", "متوسط", "جيد", "ممتاز", "اللغة الأم"];

const skillLevelColor = (level: Skill["level"]) => {
  switch (level) {
    case "مبتدئ": return "bg-slate-100 text-slate-700";
    case "متوسط": return "bg-blue-100 text-blue-700";
    case "متقدم": return "bg-green-100 text-green-700";
    case "خبير": return "bg-purple-100 text-purple-700";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function SkillsStep() {
  const { cvData, updateCVData } = useCVContext();
  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<Skill["level"]>("متوسط");
  const [newLang, setNewLang] = useState("");
  const [newLangLevel, setNewLangLevel] = useState<Language["level"]>("جيد");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateCVData({
      skills: [...cvData.skills, { id: generateId(), name: newSkill.trim(), level: newSkillLevel }],
    });
    setNewSkill("");
  };

  const deleteSkill = (id: string) => {
    updateCVData({ skills: cvData.skills.filter((s) => s.id !== id) });
  };

  const addLanguage = () => {
    if (!newLang.trim()) return;
    updateCVData({
      languages: [...cvData.languages, { id: generateId(), name: newLang.trim(), level: newLangLevel }],
    });
    setNewLang("");
  };

  const deleteLanguage = (id: string) => {
    updateCVData({ languages: cvData.languages.filter((l) => l.id !== id) });
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: generateId(), name: "", provider: "", date: "", certificateId: "",
    };
    updateCVData({ courses: [...cvData.courses, newCourse] });
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    updateCVData({ courses: cvData.courses.map((c) => (c.id === id ? { ...c, ...data } : c)) });
  };

  const deleteCourse = (id: string) => {
    updateCVData({ courses: cvData.courses.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">المهارات والكفاءات</h2>
        <p className="text-sm text-muted-foreground">أضف مهاراتك، لغاتك، والدورات التدريبية</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            المهارات التقنية والمهنية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill) => (
              <div key={skill.id} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${skillLevelColor(skill.level)}`} data-testid={`badge-skill-${skill.id}`}>
                <span>{skill.name}</span>
                <span className="opacity-60">· {skill.level}</span>
                <button onClick={() => deleteSkill(skill.id)} className="ml-1 opacity-60 hover:opacity-100" data-testid={`button-delete-skill-${skill.id}`}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="اسم المهارة (مثال: Python، Excel، ...)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              className="flex-1"
              data-testid="input-new-skill"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as Skill["level"])}
              className="border border-input rounded-md px-2 py-1 text-sm bg-background"
              data-testid="select-skill-level"
            >
              {skillLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <Button onClick={addSkill} size="sm" data-testid="button-add-skill">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            اللغات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground" data-testid={`badge-lang-${lang.id}`}>
                <span>{lang.name}</span>
                <span className="opacity-60">· {lang.level}</span>
                <button onClick={() => deleteLanguage(lang.id)} className="ml-1 opacity-60 hover:opacity-100" data-testid={`button-delete-lang-${lang.id}`}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="اللغة (مثال: العربية، الإنجليزية...)"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLanguage()}
              className="flex-1"
              data-testid="input-new-language"
            />
            <select
              value={newLangLevel}
              onChange={(e) => setNewLangLevel(e.target.value as Language["level"])}
              className="border border-input rounded-md px-2 py-1 text-sm bg-background"
              data-testid="select-language-level"
            >
              {languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <Button onClick={addLanguage} size="sm" data-testid="button-add-language">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            الدورات التدريبية والشهادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cvData.courses.map((course, i) => (
            <div key={course.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg border border-border" data-testid={`card-course-${course.id}`}>
              <div className="space-y-1">
                <Label className="text-xs">اسم الدورة / الشهادة</Label>
                <Input
                  placeholder="دورة PMP، شهادة AWS..."
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  data-testid={`input-course-name-${course.id}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">جهة الإصدار</Label>
                <Input
                  placeholder="Coursera، PMI، Google..."
                  value={course.provider}
                  onChange={(e) => updateCourse(course.id, { provider: e.target.value })}
                  data-testid={`input-course-provider-${course.id}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">تاريخ الحصول</Label>
                <Input
                  placeholder="مارس 2023"
                  value={course.date}
                  onChange={(e) => updateCourse(course.id, { date: e.target.value })}
                  data-testid={`input-course-date-${course.id}`}
                />
              </div>
              <div className="space-y-1 flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">رقم الشهادة (اختياري)</Label>
                  <Input
                    placeholder="CERT-12345"
                    value={course.certificateId}
                    onChange={(e) => updateCourse(course.id, { certificateId: e.target.value })}
                    data-testid={`input-course-cert-${course.id}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive mb-0.5"
                  onClick={() => deleteCourse(course.id)}
                  data-testid={`button-delete-course-${course.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={addCourse}
            data-testid="button-add-course"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة دورة / شهادة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
