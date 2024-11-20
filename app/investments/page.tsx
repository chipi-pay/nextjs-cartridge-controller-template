import { InvestmentsSummaryCard } from "@/features/investments/components/investments-summary.card";
import { InvestmentsList } from "@/features/investments/components/investments.list";
import { UninvestedCTASection } from "@/features/investments/components/uninvested-cta.section";

export default function InvestmentsPage() {
  return (
    <div className="mb-10 flex w-full justify-center bg-transparent p-6">
      <div className="flex w-full flex-col items-center space-y-6 sm:w-2/3">
        <h1 className="text-center text-3xl font-semibold">My Investments</h1>
        <InvestmentsSummaryCard hideCreateButton={true} />
        <UninvestedCTASection />
        <h2 className="text-center text-2xl font-semibold">Your Investments</h2>
        <InvestmentsList />
      </div>
    </div>
  );
}
