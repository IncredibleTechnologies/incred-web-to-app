"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { ContinueButton } from "../continue-button";
import { useOnboarding } from "@/contexts/onboarding-context";

interface PaymentOption {
  id: string;
  amount: number;
  duration: number;
  recommended?: boolean;
}

export function MonthlyPayment() {
  const router = useRouter();
  const {
    minimumPayoffSimulation,
    customPayoffSimulation1x,
    customPayoffSimulation1_5x,
    customPayoffSimulation2x,
    setSelectedMonthlyPayment,
  } = useOnboarding();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [options, setOptions] = useState<PaymentOption[]>([]);

  // Calculate payment options based on minimum payoff simulation
  useEffect(() => {
    if (
      customPayoffSimulation1x &&
      customPayoffSimulation1x.total_minimum_payment
    ) {
      const minPayment = customPayoffSimulation1x.total_minimum_payment;
      const minMonths = customPayoffSimulation1x.months_to_clear;

      // Create all options using pre-fetched simulation data
      const allOptions: PaymentOption[] = [
        {
          id: "min",
          amount: Math.round(minPayment),
          duration: minMonths,
        },
        {
          id: "1.5x",
          amount: Math.round(minPayment * 1.5),
          duration:
            customPayoffSimulation1_5x?.months_to_clear ||
            Math.round(minMonths * 0.7),
          recommended: true,
        },
        {
          id: "2x",
          amount: Math.round(minPayment * 2),
          duration:
            customPayoffSimulation2x?.months_to_clear ||
            Math.round(minMonths * 0.5),
        },
      ];

      setOptions(allOptions);
      setSelectedOption("1.5x"); // Default to recommended option
      setSelectedMonthlyPayment(allOptions[1].amount);
    } else {
      // Fallback options if simulation data is not available
      const fallbackOptions: PaymentOption[] = [
        { id: "650", amount: 650, duration: 36 },
        { id: "850", amount: 850, duration: 24, recommended: true },
        { id: "1200", amount: 1200, duration: 18 },
      ];
      setOptions(fallbackOptions);
      setSelectedOption("850");
      setSelectedMonthlyPayment(850);
    }
  }, [
    customPayoffSimulation1x,
    customPayoffSimulation1_5x,
    customPayoffSimulation2x,
    setSelectedMonthlyPayment,
  ]);

  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option.id);
    setSelectedMonthlyPayment(option.amount);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    // All simulations are already fetched, just navigate
    router.push("/onboarding/savings");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[600px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <BackButton />
        <h1 className="font-sora font-bold text-xl leading-7 text-black">
          How much can pay each month?
        </h1>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className={`bg-white rounded-3xl p-5 flex flex-col gap-0 border-2 transition-all ${
              selectedOption === option.id
                ? "border-neon-lime"
                : "border-black/[0.02]"
            } hover:border-neon-lime/50 relative`}
          >
            {/* Recommended Badge */}
            {option.recommended && (
              <div
                className={`absolute top-3 right-3 px-3 py-0.5 rounded-xl ${
                  selectedOption === option.id
                    ? "bg-neon-lime"
                    : "bg-slate-100/20"
                }`}
              >
                <p className="font-satoshi font-bold text-base leading-6 text-black">
                  Recommended
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 h-8">
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  selectedOption === option.id
                    ? "bg-neon-lime border-[#f6f5f1]"
                    : "border-slate-100/20"
                }`}
              >
                {selectedOption === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#142a31]" />
                )}
              </div>

              {/* Amount */}
              <p className="flex-1 font-sora font-extrabold text-base leading-normal text-carbon uppercase">
                £{option.amount.toLocaleString()} / mo
              </p>
            </div>

            {/* Duration */}
            <div className="pl-9">
              <p className="font-satoshi font-medium text-base leading-6 text-slate-100">
                Pay off in {option.duration} months
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <ContinueButton onClick={handleContinue} disabled={!selectedOption} />
    </div>
  );
}
