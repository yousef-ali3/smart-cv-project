import { createContext, useContext, useState, useCallback } from "react";
import { CVData, defaultCVData } from "@/types/cv";

interface CVContextType {
  cvData: CVData;
  updateCVData: (data: Partial<CVData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateCVData = useCallback((data: Partial<CVData>) => {
    setCvData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <CVContext.Provider value={{ cvData, updateCVData, currentStep, setCurrentStep }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCVContext() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCVContext must be used inside CVProvider");
  return ctx;
}
