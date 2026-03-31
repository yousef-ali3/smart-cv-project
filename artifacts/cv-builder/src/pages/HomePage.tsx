import { useState, useCallback } from "react";
import { useCVContext } from "@/context/CVContext";
import Stepper from "@/components/Stepper";
import PersonalInfoStep from "@/components/steps/PersonalInfoStep";
import EducationStep from "@/components/steps/EducationStep";
import ExperienceStep from "@/components/steps/ExperienceStep";
import SkillsStep from "@/components/steps/SkillsStep";
import CVPreview from "@/components/CVPreview";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/utils/pdfExport";
import {
  User, GraduationCap, Briefcase, Zap, ChevronRight, ChevronLeft,
  Download, Eye, EyeOff, FileText
} from "lucide-react";

const STEPS = [
  { label: "المعلومات الشخصية", icon: <User className="w-4 h-4" /> },
  { label: "المؤهلات العلمية", icon: <GraduationCap className="w-4 h-4" /> },
  { label: "الخبرات العملية", icon: <Briefcase className="w-4 h-4" /> },
  { label: "المهارات والدورات", icon: <Zap className="w-4 h-4" /> },
];

function renderStep(step: number) {
  switch (step) {
    case 0: return <PersonalInfoStep />;
    case 1: return <EducationStep />;
    case 2: return <ExperienceStep />;
    case 3: return <SkillsStep />;
    default: return null;
  }
}

export default function HomePage() {
  const { currentStep, setCurrentStep } = useCVContext();
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      await exportToPDF("cv-preview", "my-cv.pdf");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">منشئ السيرة الذاتية</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">احترافي ومجاني</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs md:hidden"
              data-testid="button-toggle-preview"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5 ml-1" /> : <Eye className="w-3.5 h-3.5 ml-1" />}
              {showPreview ? "إخفاء" : "معاينة"}
            </Button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={exporting}
              className="text-xs"
              data-testid="button-export-pdf"
            >
              <Download className="w-3.5 h-3.5 ml-1" />
              {exporting ? "جارٍ التصدير..." : "تحميل PDF"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 max-w-2xl mx-auto lg:mx-0">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(i) => { if (i <= currentStep) setCurrentStep(i); }}
          />
        </div>

        <div className="flex gap-6">
          <div className={`flex-1 min-w-0 ${showPreview ? "hidden md:block" : "block"}`}>
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 min-h-[500px]">
              {renderStep(currentStep)}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
                data-testid="button-prev-step"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} / {STEPS.length}
              </span>
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                  data-testid="button-next-step"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="flex items-center gap-2"
                  data-testid="button-finish-export"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? "جارٍ التصدير..." : "تحميل PDF"}
                </Button>
              )}
            </div>
          </div>

          <div className={`w-[420px] shrink-0 ${showPreview ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">معاينة مباشرة</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="text-xs"
                  data-testid="button-export-pdf-preview"
                >
                  <Download className="w-3 h-3 ml-1" />
                  PDF
                </Button>
              </div>
              <div className="bg-gray-100 rounded-xl border border-border overflow-hidden shadow-lg">
                <div className="overflow-y-auto max-h-[calc(100vh-160px)]">
                  <div className="bg-white m-3 rounded-lg shadow-sm overflow-hidden" style={{ transform: "scale(0.88)", transformOrigin: "top center", marginBottom: "-6%" }}>
                    <CVPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
