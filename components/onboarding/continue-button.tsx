interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  text?: string;
}

export function ContinueButton({
  onClick,
  disabled = false,
  isLoading = false,
  text = "Continue",
}: ContinueButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="bg-carbon hover:bg-carbon/90 disabled:bg-slate-100/50 disabled:cursor-not-allowed text-white font-sora font-extrabold text-base uppercase px-8 h-12 rounded-[48px] flex items-center justify-center gap-2 transition-colors"
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {text}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </button>
  );
}
