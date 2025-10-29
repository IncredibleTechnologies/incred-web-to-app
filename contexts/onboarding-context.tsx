"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CreditCardOption {
  provider: string;
  name: string;
  logo: string;
}

export interface SelectedCard {
  provider: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  monthly_payment: number;
}

export interface MinimumPayoffSimulation {
  total_balance: number;
  payoff_date: string;
  months_to_clear: number;
  interest_paid: number;
  total_paid: number;
  minimum_payment: number;
}

export interface CustomPayoffSimulation {
  total_balance: number;
  payoff_date: string;
  months_to_clear: number;
  interest_paid: number;
  total_paid: number;
  interest_saved?: number;
  months_saved?: number;
}

interface OnboardingContextType {
  // Total Balance
  totalBalance: number;
  setTotalBalance: (balance: number) => void;

  // Credit Cards
  availableCards: CreditCardOption[];
  setAvailableCards: (cards: CreditCardOption[]) => void;
  selectedCards: SelectedCard[];
  setSelectedCards: (cards: SelectedCard[]) => void;

  // Simulations
  minimumPayoffSimulation: MinimumPayoffSimulation | null;
  setMinimumPayoffSimulation: (simulation: MinimumPayoffSimulation | null) => void;
  customPayoffSimulation1_5x: CustomPayoffSimulation | null;
  setCustomPayoffSimulation1_5x: (simulation: CustomPayoffSimulation | null) => void;
  customPayoffSimulation2x: CustomPayoffSimulation | null;
  setCustomPayoffSimulation2x: (simulation: CustomPayoffSimulation | null) => void;

  // Selected monthly payment
  selectedMonthlyPayment: number;
  setSelectedMonthlyPayment: (payment: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [totalBalance, setTotalBalance] = useState(5000);
  const [availableCards, setAvailableCards] = useState<CreditCardOption[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [minimumPayoffSimulation, setMinimumPayoffSimulation] = useState<MinimumPayoffSimulation | null>(null);
  const [customPayoffSimulation1_5x, setCustomPayoffSimulation1_5x] = useState<CustomPayoffSimulation | null>(null);
  const [customPayoffSimulation2x, setCustomPayoffSimulation2x] = useState<CustomPayoffSimulation | null>(null);
  const [selectedMonthlyPayment, setSelectedMonthlyPayment] = useState(0);

  return (
    <OnboardingContext.Provider
      value={{
        totalBalance,
        setTotalBalance,
        availableCards,
        setAvailableCards,
        selectedCards,
        setSelectedCards,
        minimumPayoffSimulation,
        setMinimumPayoffSimulation,
        customPayoffSimulation1_5x,
        setCustomPayoffSimulation1_5x,
        customPayoffSimulation2x,
        setCustomPayoffSimulation2x,
        selectedMonthlyPayment,
        setSelectedMonthlyPayment,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
