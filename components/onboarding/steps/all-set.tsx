"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export function AllSet() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/app");
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-[600px] w-full text-center">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="font-sora font-extrabold text-4xl leading-tight text-black">
          You&apos;re all set!
        </h1>
        <p className="font-satoshi font-medium text-lg leading-7 text-carbon">
          Download Incredible to complete your Plan.
        </p>
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-satoshi font-bold text-base text-carbon">
          Scan to download:
        </p>

        {/* QR Code - Using placeholder, replace with actual QR code */}
        <div className="relative w-[160px] h-[160px] bg-white border-2 border-[#e5e5e5] rounded-2xl p-4 flex items-center justify-center">
          {/* QR Code placeholder - you can replace this with an actual QR code generator */}
          <div className="w-full h-full bg-black/10 rounded flex items-center justify-center relative">
            {/* QR pattern simulation - replace with real QR code */}
            <div className="grid grid-cols-8 grid-rows-8 gap-[2px] w-full h-full p-2">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'} rounded-sm`}
                />
              ))}
            </div>
            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-neon-lime rounded-lg flex items-center justify-center">
                <Image
                  src="http://localhost:3845/assets/da22b51781b151e0c1c21904acbe18ecf5effdc2.svg"
                  alt="Incredible"
                  width={24}
                  height={30}
                  className="w-6 h-auto"
                />
              </div>
            </div>
          </div>
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
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="iOS"
              width={20}
              height={20}
              className="w-full h-full"
            />
          </div>
          {/* Android Logo */}
          <div className="w-5 h-5 relative">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
              alt="Android"
              width={20}
              height={20}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
