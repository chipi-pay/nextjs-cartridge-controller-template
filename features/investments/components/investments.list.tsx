"use client";

import { Investment } from "@prisma/client";
import { useMyInvestments } from "../hooks/use-my-investments";
import { joinClassNames } from "@/lib/utils";
import { useInvest } from "../hooks/use-create-investment";

export function InvestmentsList() {
  const { data: investments } = useMyInvestments();
  const { invest, pendingInvestment } = useInvest();

  if (!investments) return null;
  if (investments.investments.length === 0)
    return (
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 sm:w-1/3">
        <button
          className={joinClassNames(
            "flex w-full items-center justify-center rounded-xl border-2 border-black bg-white px-2.5 py-1.5 text-center text-xl font-medium",
            pendingInvestment
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "",
          )}
          onClick={invest}
          disabled={pendingInvestment}
        >
          Create your first investment
        </button>
      </div>
    );

  return (
    <div className="space-y-4">
      {investments?.investments.map((investment) => (
        <InvestmentCard key={investment.id} investment={investment} />
      ))}
    </div>
  );
}

function InvestmentCard({ investment }: { investment: Investment }) {
  const apr =
    ((investment.amountGenerated - investment.amountInvested) /
      investment.amountInvested) *
    100;

  return (
    <div className="flex items-start gap-4 rounded-xl border-2 border-black bg-white p-6">
      <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary">
        <img
          src="/investment-placeholder.png"
          alt="investment-icon"
          className="h-12 w-auto"
        />
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          💰
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {investment.investmentOption}
          </h2>
        </div>
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>Generated: ${investment.amountGenerated.toFixed(2)}</span>
          <span>APR: {apr.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
