import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/app/providers/StarknetProvider";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers/Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
          <Providers>{children}</Providers>
          <Analytics />
          <ReactQueryDevtools initialIsOpen={false} />
        </StarknetProvider>
      </body>
    </html>
  );
}
