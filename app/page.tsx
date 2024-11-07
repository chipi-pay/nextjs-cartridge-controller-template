import { ConnectWallet } from "@/app/components/ConnectWallet";
import { TransferEth } from "@/app/components/TransferEth";
import { InvestUsdc } from "@/app/components/InvestUsdc";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFEE] p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <Image
          src="/chipi.png"
          alt="Chipi logo"
          width={72}
          height={15}
          className="w-14 sm:w-16 md:w-18"
        />
      </header>
      <main className="flex flex-col items-center justify-center gap-6">
        <ConnectWallet />
        <InvestUsdc />
        <TransferEth />
      </main>
    </div>
  );
}
