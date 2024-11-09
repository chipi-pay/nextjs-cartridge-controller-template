import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/app/providers/StarknetProvider";
import { Analytics } from '@vercel/analytics/react';



export const metadata: Metadata = {
  title: "Chipi Pay @ Starknet's HH Bangkok",
  description: "Next.js Cartridge Controller template.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StarknetProvider>
          {children}
          <Analytics />

        </StarknetProvider>
      </body>
    </html>
  )
}
