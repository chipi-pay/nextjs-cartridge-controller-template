"use client";

import { motion } from "framer-motion";
import { useWalletBalances } from "@/features/balances/hooks/use-wallet-balances";
import { useEffect, useState } from "react";
import { CreateInvestmentButton } from "./create-investment.button";
import { joinClassNames } from "@/lib/utils";
import { useInvest } from "../hooks/use-create-investment";

export function InvestmentsSummaryCard({
  hideCreateButton,
}: {
  hideCreateButton?: boolean;
}) {
  const { balances } = useWalletBalances();
  const { invest, pendingInvestment } = useInvest();

  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
    }>
  >([]);

  useEffect(() => {
    if (balances.investedBalance <= 0) return;

    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 0,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Clean up old particles after 2 seconds (matching animation duration)
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 2000);
    }, 500); // Reduced frequency to every 500ms

    return () => clearInterval(interval);
  }, [balances.investedBalance]);

  return (
    <div className="flex w-full flex-col justify-between rounded-xl border-2 border-black bg-white p-6">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex flex-col text-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            TOTAL INVESTED
          </h3>
          <p className="text-5xl font-bold">
            ${balances.investedBalance.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col text-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            EARNINGS TO DATE
          </h3>
          <div className="flex flex-row items-center justify-center gap-2 text-center">
            <img
              src="/icons/up-investment.png"
              alt="increase"
              className="h-8 w-8"
            />
            <p className="flex items-center justify-center text-3xl font-semibold">
              $0.00
              <span className="ml-2 text-sm text-green-500">(+0.00%)</span>
            </p>
          </div>
          {balances.investedBalance < 1 && (
            <p className="text-xs text-gray-500">
              *If you invested $1,000, you could be making $100 each month.
            </p>
          )}
        </div>

        {!hideCreateButton && (
          <button
            className={joinClassNames(
              `flex w-full items-center justify-center rounded-xl border-2 border-black p-2.5 text-center text-xl font-medium`,
              pendingInvestment
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "",
              `bg-white hover:bg-rose-50 active:bg-rose-100`,
            )}
            onClick={invest}
            disabled={pendingInvestment}
          >
            Invest
          </button>
        )}
      </div>

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-3xl font-bold text-green-500 opacity-30"
          style={{
            left: `${particle.x}%`,
            bottom: "0px",
          }}
          initial={{ y: 0 }}
          animate={{ y: -200 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          $
        </motion.div>
      ))}
    </div>
  );
}
