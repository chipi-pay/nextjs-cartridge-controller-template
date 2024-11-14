import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/app/providers/StarknetProvider";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Chipi Pay @ Starknet's HH Bangkok",
  description: "Onboard your friends in less than a minute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StarknetProvider>
          <div className="mb-6 flex justify-center">
            <Link href="/">
              <Image
                src="/chipi.png"
                alt="Company Logo"
                height={40}
                width={120}
              />
            </Link>
          </div>
          {children}
          <Analytics />
        </StarknetProvider>
      </body>
    </html>
  );
}
