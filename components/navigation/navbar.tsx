import Link from "next/link";

import { FeaturesNavbar, FeaturesNavbarMobile } from "./features-navbar";

export function Navbar() {
  return (
    <nav className="">
      <div
        className="flex items-center justify-between border-b-2 border-black bg-white p-4 lg:px-8"
        aria-label="Global"
      >
        <Link href="/" className="p-1.5">
          <img
            className="h-12 w-auto"
            src="/chipi-chunky.png"
            alt="chipi logo"
          />
        </Link>

        <div className="hidden sm:block">
          <FeaturesNavbar />
        </div>
        {/* <div className="rounded-md border-2 border-black">
          <DynamicWidget />
        </div> */}

        <div className="block sm:hidden">
          <FeaturesNavbarMobile />
        </div>
      </div>
    </nav>
  );
}
