"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingHeader({
  currentStep,
  totalSteps,
}: OnboardingHeaderProps) {
  const router = useRouter();
  const progressPercentage = (currentStep / totalSteps) * 100;
  return (
    <header className="w-full flex flex-col py-4 gap-2 sm:gap-4">
      {/* Top row: Back button + Centered Logo */}
      <div className="flex items-center w-full max-w-[600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="bg-slate-100/10 flex items-center justify-center p-1.5 sm:p-2.5 rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-slate-100/20 transition-colors"
          aria-label="Go back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 13.5L6.75 9L11.25 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Centered Logo */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 h-[25px] sm:h-[30px]"
          >
            <div className="relative w-5 h-[25px] sm:w-6 sm:h-[30px]">
              <Image
                src="/icon.svg"
                alt="Incredible logo mark"
                width={24}
                height={30}
                className="w-full h-full"
              />
            </div>
            <div className="relative w-[130px] h-4 sm:w-[161px] sm:h-5">
              <Image
                src="/logo.svg"
                alt="INCREDIBLE"
                width={161}
                height={20}
                className="w-full h-full"
              />
            </div>
          </Link>
        </div>

        {/* Spacer to balance the back button */}
        <div className="w-10 h-10" />
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[600px] mx-auto flex flex-col gap-0.5">
        <p className="font-satoshi font-bold text-sm sm:text-base leading-6 text-carbon text-center">
          {currentStep} / {totalSteps}
        </p>
        <div className="bg-[#142a31] h-2.5 rounded-lg p-0.5">
          <div
            className="bg-neon-lime h-full rounded-md transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </header>
  );
}
