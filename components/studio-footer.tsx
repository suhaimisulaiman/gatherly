"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StudioFooterProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  /** When true, Next button is disabled (e.g. design not selected on Step 1) */
  nextDisabled?: boolean
}

export function StudioFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextDisabled = false,
}: StudioFooterProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={currentStep <= 1}
          className="gap-1.5 border-border bg-card text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i + 1 === currentStep
                    ? "w-5 bg-foreground"
                    : i + 1 < currentStep
                      ? "w-1.5 bg-foreground/40"
                      : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {currentStep}/{totalSteps}
          </span>
        </div>

        <Button
          size="sm"
          onClick={onNext}
          disabled={currentStep >= totalSteps || nextDisabled}
          className="gap-1.5"
        >
          <span>Next</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <p className="text-[11px] tracking-wide text-muted-foreground/70">
        Preview may not fully match the final output
      </p>
    </div>
  )
}
