"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { ContinueButton } from "../continue-button";
import { useOnboarding } from "@/contexts/onboarding-context";

export function Savings() {
  const router = useRouter();
  const {
    minimumPayoffSimulation,
    customPayoffSimulation1_5x,
    customPayoffSimulation2x,
    selectedMonthlyPayment,
  } = useOnboarding();

  const handleContinue = () => {
    router.push("/onboarding/main-goal");
  };

  const benefits = [
    "Smarter payment schedule",
    "Lower average interest",
    "Automated payments",
    "Progress you can actually see",
  ];

  // Determine which simulation to use based on selected monthly payment
  let selectedSimulation = null;

  if (minimumPayoffSimulation) {
    const minPayment = minimumPayoffSimulation.minimum_payment;
    const payment1_5x = Math.round(minPayment * 1.5);
    const payment2x = Math.round(minPayment * 2);

    if (selectedMonthlyPayment === payment1_5x && customPayoffSimulation1_5x) {
      selectedSimulation = customPayoffSimulation1_5x;
    } else if (
      selectedMonthlyPayment === payment2x &&
      customPayoffSimulation2x
    ) {
      selectedSimulation = customPayoffSimulation2x;
    } else {
      // If minimum payment selected, default to showing 1.5x savings
      selectedSimulation = customPayoffSimulation1_5x;
    }
  }

  // Calculate interest savings: minimum payoff interest - selected custom payoff interest
  const interestSaved =
    selectedSimulation && minimumPayoffSimulation
      ? Math.max(
          0,
          Math.round(
            minimumPayoffSimulation.interest_paid -
              selectedSimulation.total_interest_paid
          )
        )
      : 0;

  // Calculate months saved: minimum payoff months - selected custom payoff months
  const monthsSaved =
    selectedSimulation && minimumPayoffSimulation
      ? Math.max(
          0,
          minimumPayoffSimulation.months_to_clear -
            selectedSimulation.months_to_clear
        )
      : 0;

  // Format months saved as "X years and Y months" if > 12 months
  const formatMonthsSaved = (months: number): string => {
    if (months > 12) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? "year" : "years"}`;
      }
      return `${years} ${
        years === 1 ? "year" : "years"
      } and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    }
    return `${months} ${months === 1 ? "month" : "months"}`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-[600px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <BackButton />
        <h1 className="font-sora font-bold text-xl leading-7 text-black">
          Here&apos;s how much you could save!
        </h1>
      </div>

      {/* Card Content */}
      <div className="bg-white border-2 border-[#fbfbfc] rounded-3xl p-8 flex flex-col gap-6">
        <p className="font-satoshi font-medium text-base leading-6 text-carbon">
          Based on people like you, you could save:
        </p>

        {/* Savings Card */}
        <div className="flex flex-col gap-4">
          <div className="border-2 border-neon-lime bg-neon-lime/10 rounded-3xl p-5 pt-6 pb-8 flex flex-col gap-2 items-center">
            <p className="font-sora font-extrabold text-[32px] leading-normal text-carbon text-center">
              £{interestSaved.toLocaleString()} 🎉
            </p>
            <div className="flex flex-col gap-3 items-center">
              <div className="bg-neon-lime px-3 py-1 rounded-[14px]">
                <p className="font-satoshi font-bold text-base leading-6 text-carbon">
                  Pay off {formatMonthsSaved(monthsSaved)} faster *
                </p>
              </div>
              <p className="font-satoshi font-medium text-base leading-6 text-carbon text-center">
                Total interest savings **
              </p>
            </div>
          </div>

          <p className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100 text-center">
            * Assuming minimum payments are made each month
          </p>

          <p className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100 text-center">
            ** Estimates are based on your current information
          </p>
        </div>

        {/* Benefits List */}
        <div className="flex flex-col gap-3 py-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="bg-neon-lime rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7L6 11L12 3"
                    stroke="#142a31"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-satoshi font-bold text-base leading-6 text-carbon">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <ContinueButton onClick={handleContinue} />
    </div>
  );
}
