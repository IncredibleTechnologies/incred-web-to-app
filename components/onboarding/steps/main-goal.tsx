"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { ContinueButton } from "../continue-button";
import { useOnboarding } from "@/contexts/onboarding-context";

interface GoalOption {
  id: string;
  label: string;
}

export function MainGoal() {
  const router = useRouter();
  const { selectedGoal, setSelectedGoal } = useOnboarding();

  // Set default goal if none is selected
  useEffect(() => {
    if (!selectedGoal) {
      setSelectedGoal("faster-payoff");
    }
  }, []);

  const goals: GoalOption[] = [
    { id: "faster-payoff", label: "Pay less interest and get out of debt faster" },
    { id: "consolidate", label: "I want to consolidate my cards without a loan" },
    { id: "simplify", label: "Simplify my repayments (even if the rate is the same)" },
    { id: "lower-rate", label: "I want to consolidate at a lower rate" },
    { id: "new-loan", label: "I need a new loan (not consolidation)" },
  ];

  const handleContinue = () => {
    router.push("/onboarding/plan-review");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[600px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <BackButton />
        <h1 className="font-sora font-bold text-xl leading-7 text-black">
          What&apos;s your main goal?
        </h1>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`bg-white rounded-3xl p-5 flex items-center gap-4 border-2 transition-all ${
              selectedGoal === goal.id
                ? "border-neon-lime"
                : "border-black/[0.02]"
            } hover:border-neon-lime/50`}
          >
            {/* Radio Button */}
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
              selectedGoal === goal.id
                ? "bg-neon-lime border-[#f6f5f1]"
                : "border-slate-100/20"
            }`}>
              {selectedGoal === goal.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#142a31]" />
              )}
            </div>

            {/* Label */}
            <p className="font-satoshi font-bold text-base leading-6 text-carbon text-left">
              {goal.label}
            </p>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <ContinueButton
        onClick={handleContinue}
        disabled={!selectedGoal}
      />
    </div>
  );
}
