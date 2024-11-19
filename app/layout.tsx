import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/lib/providers/StarknetProvider";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { Navbar } from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: "Chipi Pay @ Starknet's HH Bengaluru",
  description: "Onboard your friends in less than a minute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full bg-[#CCF4E8]">
      <body className="w-full bg-[#CCF4E8]">
        <StarknetProvider>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Analytics />
        </StarknetProvider>
      </body>
    </html>
  );
}
