import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  icon: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => onStepClick?.(index)}
              className={cn(
                "flex flex-col items-center gap-1.5 group",
                (onStepClick && index <= currentStep) ? "cursor-pointer" : "cursor-default"
              )}
              data-testid={`step-button-${index}`}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium hidden sm:block",
                  isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full transition-colors duration-300"
                style={{ background: index < currentStep ? "hsl(var(--primary))" : "hsl(var(--border))" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
