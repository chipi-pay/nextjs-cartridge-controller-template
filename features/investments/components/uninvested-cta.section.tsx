"use client";

import { joinClassNames } from "@/lib/utils";
import { useInvest } from "../hooks/use-create-investment";

export function UninvestedCTASection() {
  const { invest, pendingInvestment } = useInvest();
  return (
    <div className="mx-auto w-full">
      <div className="flex justify-between gap-5">
        <div className="flex flex-col">
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Uninvested Balance
          </p>
          <p className="text-center text-3xl font-semibold">$1,234.56</p>
        </div>
        <button
          className={joinClassNames(
            "flex items-center justify-center rounded-xl border-2 border-black bg-amber-400 px-2 py-1 text-center text-xl font-medium hover:bg-amber-500 active:bg-amber-600",
            pendingInvestment
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "",
          )}
          onClick={invest}
          disabled={pendingInvestment}
        >
          Invest now
        </button>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 rounded-xl border-2 border-black bg-amber-50 p-3">
        <img
          src="/icons/happy-invest.png"
          alt="happy-invest"
          className="h-10 w-10"
        />
        <p>
          If you invested $1,000 you could earn up to $200 in a year. Make your
          money grow!
        </p>
      </div>
    </div>
  );
}
