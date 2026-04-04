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
  Download, Eye, EyeOff, Printer
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

  const { cvData } = useCVContext();

  const handleExportPDF = useCallback(() => {
    setExporting(true);
    try {
      exportToPDF(cvData);
    } finally {
      setExporting(false);
    }
  }, [cvData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header — name only, centered */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="py-4 text-center">
          <h1 className="text-3xl font-black tracking-tight text-foreground">سيرتك الذكية</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">أنشئ سيرتك الذاتية الاحترافية خلال دقائق</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stepper */}
        <div className="mb-6 max-w-2xl mx-auto lg:mx-0">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(i) => { if (i <= currentStep) setCurrentStep(i); }}
          />
        </div>

        {/* Action bar — preview toggle + PDF + print */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs md:hidden"
            data-testid="button-toggle-preview"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5 ml-1" /> : <Eye className="w-3.5 h-3.5 ml-1" />}
            {showPreview ? "إخفاء المعاينة" : "عرض المعاينة"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs"
            data-testid="button-print"
          >
            <Printer className="w-3.5 h-3.5 ml-1" />
            طباعة
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

        <div className="flex gap-6">
          {/* Form side */}
          <div className={`flex-1 min-w-0 ${showPreview ? "hidden md:block" : "block"}`}>
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 min-h-[500px]">
              {renderStep(currentStep)}
            </div>

            {/* Navigation buttons */}
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
                  onClick={handleNext}
                  className="flex items-center gap-2"
                  data-testid="button-next-step-last"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
            </div>

          </div>

          {/* Preview side */}
          <div className={`w-[420px] shrink-0 ${showPreview ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">معاينة مباشرة</span>
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
