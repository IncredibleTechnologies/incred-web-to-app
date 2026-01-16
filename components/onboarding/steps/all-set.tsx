"use client";
import Image from "next/image";

const DOWNLOAD_URL = "https://rb.gy/6xlt1i";

export function AllSet() {
  const handleGetStarted = () => {
    window.open(DOWNLOAD_URL, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-[600px] w-full text-center">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="font-sora font-extrabold text-2xl sm:text-4xl leading-tight text-black">
          You&apos;re all set!
        </h1>
        <p className="font-satoshi font-medium text-base sm:text-lg leading-7 text-carbon">
          Download Incredible to complete your Plan.
        </p>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-satoshi font-bold text-base text-carbon">
          Scan to download:
        </p>

        {/* QR Code */}
        <div className="relative w-40 h-40 sm:w-[207px] sm:h-[207px]">
          <Image
            src="/qr-code.svg"
            alt="Download Incredible QR Code"
            width={207}
            height={207}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleGetStarted}
        className="bg-neon-lime hover:bg-neon-lime/90 text-carbon font-sora font-extrabold text-sm md:text-base uppercase px-8 md:px-12 h-12 md:h-14 rounded-full flex items-center justify-center transition-colors w-full max-w-[300px]"
      >
        Download Incredible
      </button>

      {/* Available on iOS/Android */}
      <div className="flex items-center gap-2 text-carbon">
        <span className="font-satoshi font-medium text-sm">Available on</span>
        <div className="flex items-center gap-2">
          {/* iOS Logo */}
          <div className="w-5 h-5 relative">
            <a href={DOWNLOAD_URL} target="_blank">
              <Image
                src="/app-store.svg"
                alt="iOS"
                width={20}
                height={20}
                className="w-full h-full"
              />
            </a>
          </div>
          {/* Android Logo */}
          <div className="w-5 h-5 relative">
            <a href={DOWNLOAD_URL} target="_blank">
              <Image
                src="/play-store.svg"
                alt="Android"
                width={20}
                height={20}
                className="w-full h-full"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
