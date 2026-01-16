"use client";

import { useRouter } from "next/navigation";
import { ContinueButton } from "../continue-button";
import { useOnboarding } from "@/contexts/onboarding-context";

export function PlanReview() {
  const router = useRouter();
  const {
    totalBalance,
    selectedCards,
    availableCards,
    minimumPayoffSimulation,
    customPayoffSimulation1_5x,
    customPayoffSimulation2x,
    selectedMonthlyPayment,
  } = useOnboarding();

  const handleContinue = () => {
    router.push("/onboarding/choose-plan");
  };

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

  // Calculate interest savings
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

  // Get today's date formatted
  const today = new Date();
  const planStartDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  // Format payoff date from DD-MM-YYYY format
  const formatPayoffDate = (dateString: string) => {
    if (!dateString) return "";
    // Parse DD-MM-YYYY format
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  // Get number of payments and payment amount
  const numberOfPayments = selectedSimulation?.months_to_clear || 0;
  const paymentAmount = selectedMonthlyPayment || 0;
  const payoffDate = selectedSimulation?.payoff_date
    ? formatPayoffDate(selectedSimulation.payoff_date)
    : "";

  // Get card logos by matching provider IDs
  const getCardLogo = (providerId: string) => {
    const cardOption = availableCards.find(
      (card) => card.provider === providerId
    );
    return cardOption?.logo || "";
  };

  return (
    <div className="flex flex-col gap-8 max-w-[600px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="font-sora font-bold text-xl leading-7 text-black">
          Your Plan to pay-off your cards
        </h1>
        <p className="font-satoshi font-medium text-base leading-6 text-carbon">
          Here&apos;s how we&apos;ll help you get there faster and save money.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 pb-6">
        {/* Total Balance Card */}
        <div className="bg-white border-2 border-black/[0.02] rounded-3xl p-5 flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <p className="font-satoshi font-medium text-base leading-6 text-slate-100">
              Total balance
            </p>
            <p className="font-sora font-bold text-xl leading-7 text-carbon">
              £{totalBalance.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              {selectedCards.slice(0, 3).map((card, index) => {
                const logo = getCardLogo(card.provider);
                return (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center overflow-hidden"
                  >
                    {logo && (
                      <img
                        src={logo}
                        alt={card.provider}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="font-satoshi font-medium text-base leading-6 text-slate-100">
              {selectedCards.length}{" "}
              {selectedCards.length === 1 ? "card" : "cards"}
            </p>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border-2 border-black/[0.02] rounded-3xl p-5 flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <p className="font-satoshi font-medium text-base leading-6 text-slate-100">
              Plan start date
            </p>
            <p className="font-sora font-bold text-xl leading-7 text-carbon">
              {planStartDate}
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-1 items-end">
            <p className="font-satoshi font-medium text-base leading-6 text-slate-100 text-right">
              {numberOfPayments} payments of
            </p>
            <p className="font-sora font-bold text-xl leading-7 text-carbon text-right">
              £{paymentAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Savings Card */}
        <div className="border-2 border-neon-lime bg-neon-lime/10 rounded-3xl p-5 pt-6 pb-8 flex flex-col gap-2 items-center">
          <p className="font-satoshi font-bold text-base leading-6 text-carbon text-center">
            You&apos;ll save an estimated*
          </p>
          <p className="font-sora font-extrabold text-2xl sm:text-[32px] leading-normal text-carbon text-center">
            £{interestSaved.toLocaleString()} 🎉
          </p>
          <div className="bg-neon-lime px-3 py-1 rounded-[14px]">
            <p className="font-satoshi font-bold text-base leading-6 text-carbon">
              Pay off in {payoffDate}
            </p>
          </div>
        </div>

        <p className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100 text-center">
          *Estimates are based on your current information.
        </p>
      </div>

      {/* Continue Button */}
      <ContinueButton onClick={handleContinue} />
    </div>
  );
}
