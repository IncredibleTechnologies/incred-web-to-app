"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "../back-button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "reactfire";
import { toast } from "@/components/ui/use-toast";

export function ShareDetails() {
  const router = useRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+44",
    password: "",
  });

  // Validate UK phone number
  const isValidUKPhone = (phone: string): boolean => {
    // Remove all spaces and hyphens
    const cleanPhone = phone.replace(/[\s-]/g, "");

    // UK phone number patterns:
    // +44 followed by 10 digits (total 13 chars)
    // 0 followed by 10 digits (total 11 chars)
    const ukPhoneRegex = /^(\+44\d{10}|0\d{10})$/;

    return ukPhoneRegex.test(cleanPhone);
  };

  // Handle phone input change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers, +, spaces, and hyphens
    const sanitized = value.replace(/[^\d+\s-]/g, "");

    // Ensure +44 prefix stays if user tries to delete it at the start
    if (sanitized.length < 3 && !sanitized.startsWith("+")) {
      setFormData({ ...formData, phone: "+44" });
    } else {
      setFormData({ ...formData, phone: sanitized });
    }
  };

  const handleContinue = async () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (!isValidUKPhone(formData.phone)) {
      toast({
        title: "Invalid UK phone number",
        description:
          "Please enter a valid UK phone number (e.g., +447123456789)",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (userCredential?.user.uid && userCredential.user.email) {
        // You can store additional user data (firstName, lastName, phone) in Firestore here
        toast({ title: "Account created successfully!" });
        router.push("/onboarding/all-set");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      if (err.code === "auth/email-already-in-use") {
        toast({ title: "Email already in use", variant: "destructive" });
      } else if (err.code === "auth/invalid-email") {
        toast({ title: "Invalid email address", variant: "destructive" });
      } else if (err.code === "auth/weak-password") {
        toast({ title: "Password is too weak", variant: "destructive" });
      } else {
        toast({
          title: "Error creating account",
          description: err.message,
          variant: "destructive",
        });
      }
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
          Almost there!
        </h1>
        <p className="font-satoshi font-medium text-base leading-6 text-carbon">
          Enter your details to get started with your personalised debt payoff
          plan.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3 pb-6">
        {/* Name Fields */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1 h-[85px]">
            <label className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100">
              First name
            </label>
            <input
              type="text"
              value={formData.firstName}
              placeholder="John"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="flex-1 bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 font-satoshi font-bold text-base leading-6 text-black outline-none focus:border-carbon transition-colors"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 h-[85px]">
            <label className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100">
              Last name
            </label>
            <input
              type="text"
              value={formData.lastName}
              placeholder="Smith"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="flex-1 bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 font-satoshi font-bold text-base leading-6 text-black outline-none focus:border-carbon transition-colors"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1 h-[85px]">
          <label className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100">
            Email address
          </label>
          <input
            type="email"
            value={formData.email}
            placeholder="john@example.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="flex-1 bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 font-satoshi font-bold text-base leading-6 text-black outline-none focus:border-carbon transition-colors"
          />
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-1 h-[85px]">
          <label className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100">
            Phone number
          </label>
          <div className="flex-1 bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 flex items-center gap-1">
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+447123456789"
              className="flex-1 font-satoshi font-bold text-base leading-6 text-black outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1 h-[85px]">
          <label className="font-satoshi font-medium text-[13px] leading-[18px] text-slate-100">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            placeholder="At least 8 characters"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="flex-1 bg-white border-2 border-slate-100/20 rounded-2xl px-4 py-3 font-satoshi font-bold text-base leading-6 text-black outline-none focus:border-carbon transition-colors"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={isLoading}
        className="bg-carbon hover:bg-carbon/90 disabled:bg-carbon/50 disabled:cursor-not-allowed text-white font-sora font-extrabold text-base uppercase px-8 h-12 rounded-[48px] flex items-center justify-center gap-2 transition-colors"
      >
        CONFIRM DETAILS
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
      </button>
    </div>
  );
}
