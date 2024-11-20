import { InvestmentOption } from "@prisma/client";

export function getInvestmentImg(investmentOption: InvestmentOption) {
  return investmentOption === InvestmentOption.NIMBORA
    ? "/images/nimbora-logo.png"
    : "/images/starkfarm-logo.png";
}
