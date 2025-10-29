import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { FishIcon, ScanTextIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-8">
                  <Image
                    src="/icon.svg"
                    alt="Incredible logo mark"
                    width={24}
                    height={30}
                    className="w-full h-full"
                  />
                </div>
                <div className="relative w-[161px] h-5">
                  <Image
                    src="/logo.svg"
                    alt="INCREDIBLE"
                    width={161}
                    height={20}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div></div>
              <div className="flex items-center space-x-4">
                <NavbarUserLinks />
              </div>
            </div>
            <div className="md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
