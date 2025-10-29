"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { useOnboarding, CreditCardOption } from "@/contexts/onboarding-context";

export function TotalBalance() {
  const router = useRouter();
  const { totalBalance, setTotalBalance, setAvailableCards } = useOnboarding();
  const [balance, setBalance] = useState(totalBalance);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minBalance = 1000;
  const maxBalance = 30000;

  // Fetch credit card data on mount
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const [namesResponse, logosResponse] = await Promise.all([
          fetch("https://api.getincredible.com/connections/credit-cards-names", {
            headers: { accept: "application/json" },
          }),
          fetch("https://api.getincredible.com/connections/credit-cards-logos", {
            headers: { accept: "application/json" },
          }),
        ]);

        if (!namesResponse.ok || !logosResponse.ok) {
          throw new Error("Failed to fetch credit card data");
        }

        const namesData = await namesResponse.json();
        const logosData = await logosResponse.json();

        // The API returns an object where keys are provider IDs and values contain {title, subtitle}
        const cards: CreditCardOption[] = Object.entries(namesData).map(([providerId, data]: [string, any]) => ({
          provider: providerId,
          name: data.title,
          logo: logosData[providerId] || "",
        }));

        // Sort alphabetically by name
        cards.sort((a, b) => a.name.localeCompare(b.name));

        setAvailableCards(cards);
      } catch (error) {
        console.error("Failed to fetch credit cards:", error);
      }
    };

    fetchCreditCards();
  }, [setAvailableCards]);

  const handleContinue = () => {
    setTotalBalance(balance);
    router.push("/onboarding/credit-cards");
  };

  const decreaseBalance = () => {
    if (balance > minBalance) {
      setBalance(Math.max(minBalance, balance - 100));
    }
  };

  const increaseBalance = () => {
    if (balance < maxBalance) {
      setBalance(Math.min(maxBalance, balance + 100));
    }
  };

  const sliderPercentage = ((balance - minBalance) / (maxBalance - minBalance)) * 100;

  const handleSliderChange = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newBalance = Math.round((percentage / 100) * (maxBalance - minBalance) + minBalance);

    // Round to nearest 100
    const roundedBalance = Math.round(newBalance / 100) * 100;
    setBalance(Math.max(minBalance, Math.min(maxBalance, roundedBalance)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderChange(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleSliderChange(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSliderChange(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleSliderChange(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-8 max-w-[600px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <BackButton />
        <h1 className="font-sora font-bold text-xl leading-7 text-black">
          What&apos;s your total credit card balance?
        </h1>
      </div>

      {/* Card Content */}
      <div className="bg-white border-2 border-[#fbfbfc] rounded-3xl p-8 flex flex-col gap-6">
        <p className="font-satoshi font-medium text-base leading-6 text-carbon">
          Don&apos;t worry, this can be an estimate! We&apos;ll use this to work out how much you could save by paying off your cards smarter.
        </p>

        {/* Balance Adjuster */}
        <div className="border-2 border-[#e7e5e1] rounded-[40px] h-[68px] bg-white flex items-center justify-between px-4">
          <button
            onClick={decreaseBalance}
            className="bg-[rgba(212,208,201,0.5)] rounded-3xl w-10 h-10 flex items-center justify-center hover:bg-[rgba(212,208,201,0.7)] transition-colors"
            aria-label="Decrease balance"
          >
            <div className="w-5 h-0.5 bg-[#142a31] rounded-sm" />
          </button>

          <p className="font-sora font-extrabold text-[32px] leading-normal text-black">
            £{balance.toLocaleString()}
          </p>

          <button
            onClick={increaseBalance}
            className="bg-neon-lime rounded-3xl w-10 h-10 flex items-center justify-center hover:bg-neon-lime/80 transition-colors"
            aria-label="Increase balance"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="#142a31" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-1 w-full">
          <div
            ref={sliderRef}
            className="relative h-3 bg-[rgba(212,208,201,0.5)] rounded-[21px] cursor-pointer"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div
              className="absolute h-full bg-neon-lime rounded-2xl transition-all pointer-events-none"
              style={{ width: `${sliderPercentage}%` }}
            />
            {/* Slider knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[26px] h-[26px] bg-white border-2 border-black rounded-full shadow-md transition-all pointer-events-none z-20"
              style={{ left: `calc(${sliderPercentage}% - 13px)` }}
            />
            {/* Min knob - positioned inside the track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-[1px] w-[20px] h-[20px] bg-[rgba(113,112,106,0.2)] rounded-full pointer-events-none z-10" />
            {/* Max knob - positioned inside the track */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-[1px] w-[20px] h-[20px] bg-[rgba(113,112,106,0.2)] rounded-full pointer-events-none z-10" />
          </div>

          {/* Labels */}
          <div className="flex items-center justify-between font-satoshi font-bold text-base leading-6 text-slate-100">
            <span>£1k</span>
            <span>£30k+</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="bg-carbon hover:bg-carbon/90 text-white font-sora font-extrabold text-base uppercase px-8 h-12 rounded-[48px] flex items-center justify-center gap-2 transition-colors"
      >
        Continue
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
