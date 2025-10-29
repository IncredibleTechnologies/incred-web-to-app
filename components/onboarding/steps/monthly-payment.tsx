"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
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
    selectedCards,
    setCustomPayoffSimulation,
    selectedMonthlyPayment,
    setSelectedMonthlyPayment,
  } = useOnboarding();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [options, setOptions] = useState<PaymentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate payment options based on minimum payoff simulation
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      if (minimumPayoffSimulation && minimumPayoffSimulation.minimum_payment) {
        const minPayment = minimumPayoffSimulation.minimum_payment;
        const minMonths = minimumPayoffSimulation.months_to_clear;

        // First option: minimum payment
        const minOption: PaymentOption = {
          id: "min",
          amount: Math.round(minPayment),
          duration: minMonths,
        };

        setOptions([minOption]);
        setSelectedOption("min");
        setSelectedMonthlyPayment(minOption.amount);

        try {
          // Fetch 1.5x and 2x simulations in parallel
          const [response1_5x, response2x] = await Promise.all([
            fetch("https://api.getincredible.com/user/simulate-custom-payoff", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                cards: selectedCards,
                monthly_payment: Math.round(minPayment * 1.5),
                strategy: "AVALANCHE",
              }),
            }),
            fetch("https://api.getincredible.com/user/simulate-custom-payoff", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                cards: selectedCards,
                monthly_payment: Math.round(minPayment * 2),
                strategy: "AVALANCHE",
              }),
            }),
          ]);

          const [simulation1_5x, simulation2x] = await Promise.all([
            response1_5x.json(),
            response2x.json(),
          ]);

          console.log("1.5x simulation response:", simulation1_5x);
          console.log("2x simulation response:", simulation2x);

          // Create all options
          const allOptions: PaymentOption[] = [
            minOption,
            {
              id: "1.5x",
              amount: Math.round(minPayment * 1.5),
              duration: simulation1_5x.months_to_clear || Math.round(minMonths * 0.7),
              recommended: true,
            },
            {
              id: "2x",
              amount: Math.round(minPayment * 2),
              duration: simulation2x.months_to_clear || Math.round(minMonths * 0.5),
            },
          ];

          setOptions(allOptions);
          setSelectedOption("1.5x"); // Default to recommended option
          setSelectedMonthlyPayment(allOptions[1].amount);
        } catch (error) {
          console.error("Failed to fetch custom payoff simulations:", error);
          // Use estimated durations if API fails
          const fallbackOptions: PaymentOption[] = [
            minOption,
            {
              id: "1.5x",
              amount: Math.round(minPayment * 1.5),
              duration: Math.round(minMonths * 0.7),
              recommended: true,
            },
            {
              id: "2x",
              amount: Math.round(minPayment * 2),
              duration: Math.round(minMonths * 0.5),
            },
          ];
          setOptions(fallbackOptions);
          setSelectedOption("1.5x");
          setSelectedMonthlyPayment(fallbackOptions[1].amount);
        }
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
    };

    fetchPaymentOptions();
  }, [minimumPayoffSimulation, selectedCards, setSelectedMonthlyPayment]);

  const handleOptionSelect = (option: PaymentOption) => {
    setSelectedOption(option.id);
    setSelectedMonthlyPayment(option.amount);
  };

  const handleContinue = async () => {
    if (!selectedOption) return;

    setIsLoading(true);

    try {
      // Call simulate-custom-payoff API
      const response = await fetch("https://api.getincredible.com/user/simulate-custom-payoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          cards: selectedCards,
          monthly_payment: selectedMonthlyPayment,
          strategy: "AVALANCHE",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to simulate custom payoff");
      }

      const simulation = await response.json();
      setCustomPayoffSimulation(simulation);

      router.push("/onboarding/savings");
    } catch (error) {
      console.error("Failed to simulate custom payoff:", error);
      // Still navigate even if API fails
      router.push("/onboarding/savings");
    } finally {
      setIsLoading(false);
    }
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
              <div className={`absolute top-3 right-3 px-3 py-0.5 rounded-xl ${
                selectedOption === option.id ? "bg-neon-lime" : "bg-slate-100/20"
              }`}>
                <p className="font-satoshi font-bold text-base leading-6 text-black">
                  Recommended
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 h-8">
              {/* Radio Button */}
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selectedOption === option.id
                  ? "bg-neon-lime border-[#f6f5f1]"
                  : "border-slate-100/20"
              }`}>
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
      <button
        onClick={handleContinue}
        disabled={!selectedOption || isLoading}
        className="bg-carbon hover:bg-carbon/90 text-white font-sora font-extrabold text-base uppercase px-8 h-12 rounded-[48px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            Continue
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
