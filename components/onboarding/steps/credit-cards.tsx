"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { useOnboarding } from "@/contexts/onboarding-context";

export function CreditCards() {
  const router = useRouter();
  const {
    availableCards,
    totalBalance,
    selectedCards,
    setSelectedCards,
    setMinimumPayoffSimulation,
    setCustomPayoffSimulation1_5x,
    setCustomPayoffSimulation2x,
  } = useOnboarding();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(
    new Set(selectedCards.map((card) => card.provider))
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedCount = selectedProviders.size;

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return availableCards;
    const query = searchQuery.toLowerCase();
    return availableCards.filter((card) => card.name.toLowerCase().includes(query));
  }, [availableCards, searchQuery]);

  const toggleCard = (provider: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(provider)) {
      newSelected.delete(provider);
    } else {
      newSelected.add(provider);
    }
    setSelectedProviders(newSelected);
  };

  const handleContinue = async () => {
    if (selectedCount === 0) return;

    setIsLoading(true);

    try {
      // Calculate balance per card (split evenly for now)
      const balancePerCard = totalBalance / selectedCount;

      // Create cards array for API call
      const cards = Array.from(selectedProviders).map((provider) => ({
        provider,
        balance: balancePerCard,
        interest_rate: 0.24, // Default 24% APR
        minimum_payment: 0,
        monthly_payment: 0,
      }));

      // Save selected cards to context
      setSelectedCards(cards);

      // Call simulate-minimum-payoff API to get the minimum payment first
      const minPayoffResponse = await fetch("https://api.getincredible.com/user/simulate-minimum-payoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          cards,
          strategy: "AVALANCHE",
          budget: 0,
        }),
      });

      if (!minPayoffResponse.ok) {
        throw new Error("Failed to simulate minimum payoff");
      }

      const minPayoffSimulation = await minPayoffResponse.json();
      setMinimumPayoffSimulation(minPayoffSimulation);

      // Now call simulate-custom-payoff for 1.5x and 2x in parallel
      const minPayment = minPayoffSimulation.minimum_payment;

      const [response1_5x, response2x] = await Promise.all([
        fetch("https://api.getincredible.com/user/simulate-custom-payoff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            cards,
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
            cards,
            monthly_payment: Math.round(minPayment * 2),
            strategy: "AVALANCHE",
          }),
        }),
      ]);

      const [simulation1_5x, simulation2x] = await Promise.all([
        response1_5x.json(),
        response2x.json(),
      ]);

      setCustomPayoffSimulation1_5x(simulation1_5x);
      setCustomPayoffSimulation2x(simulation2x);

      router.push("/onboarding/monthly-payment");
    } catch (error) {
      console.error("Failed to simulate payoffs:", error);
      // Still navigate even if API fails
      router.push("/onboarding/monthly-payment");
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
          What cards do you have a balance on?
        </h1>
      </div>

      {/* Card Content */}
      <div className="bg-white border-2 border-[#fbfbfc] rounded-3xl p-8 h-[565px] overflow-hidden relative">
        <div className="flex flex-col gap-6 h-full">
          {/* Search Input */}
          <div className="bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 flex items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#71706a" strokeWidth="2"/>
              <path d="M20 20L17 17" stroke="#71706a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search providers e.g. AMEX"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-satoshi font-bold text-base leading-6 text-slate-100 placeholder:text-slate-100 bg-transparent outline-none"
            />
          </div>

          {/* Cards List */}
          <div className="flex flex-col overflow-y-auto">
            {filteredCards.length === 0 ? (
              <p className="font-satoshi font-medium text-base leading-6 text-slate-100 text-center py-8">
                {availableCards.length === 0
                  ? "Loading credit cards..."
                  : "No cards found matching your search"}
              </p>
            ) : (
              filteredCards.map((card) => (
                <button
                  key={card.provider}
                  onClick={() => toggleCard(card.provider)}
                  className="flex items-center gap-3 py-4 border-b border-slate-100/20 hover:bg-slate-100/5 transition-colors"
                >
                  {selectedProviders.has(card.provider) && (
                    <div className="bg-neon-lime rounded-lg w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 7L6 11L12 3" stroke="#142a31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {!selectedProviders.has(card.provider) && <div className="w-6 h-6 flex-shrink-0" />}

                  {/* Logo */}
                  {card.logo ? (
                    <img
                      src={card.logo}
                      alt={card.name}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-carbon text-xs font-bold flex-shrink-0">
                      {card.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <span className="font-satoshi font-bold text-base leading-6 text-carbon">
                    {card.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={selectedCount === 0 || isLoading}
        className="bg-carbon hover:bg-carbon/90 text-white font-sora font-extrabold text-base uppercase px-8 h-12 rounded-[48px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            Continue with {selectedCount} {selectedCount === 1 ? "card" : "cards"}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
