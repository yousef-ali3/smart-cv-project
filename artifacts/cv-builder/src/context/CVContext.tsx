import { createContext, useContext, useState, useCallback } from "react";
import { CVData, defaultCVData } from "@/types/cv";

export type TemplateId = "ats" | "modern" | "corporate" | "minimal";

interface CVContextType {
  cvData: CVData;
  updateCVData: (data: Partial<CVData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (t: TemplateId) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("ats");

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCvData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <CVContext.Provider value={{ cvData, updateCVData, currentStep, setCurrentStep, selectedTemplate, setSelectedTemplate }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCVContext() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCVContext must be used inside CVProvider");
  return ctx;
}
